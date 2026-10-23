import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { Buffer } from "node:buffer";
import { URL, URLSearchParams } from "node:url";
import ts from "typescript";

// Keep the application test suite runnable under the repository's Node 20 CI.
// The tested modules are the same TypeScript sources imported by the UI.
async function loadTs(relativePath) {
  const file = new URL("../../app/features/" + relativePath, import.meta.url);
  const source = readFileSync(file, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  return import(
    "data:text/javascript;base64," + Buffer.from(compiled).toString("base64")
  );
}

const [
  state,
  auth,
  { hospitalPatientRecords },
  { appointmentSamples },
  { hospitalNotificationSamples, hospitalNotificationFilters },
] = await Promise.all([
  loadTs("hospital-dashboard/hospital-preview-state.ts"),
  loadTs("hospital-auth/registration-flow.ts"),
  loadTs("hospital-dashboard/hospital-patient-data.ts"),
  loadTs("hospital-dashboard/hospital-appointment-data.ts"),
  loadTs("hospital-dashboard/hospital-notification-data.ts"),
]);

test("hospital section is loaded from URL, including invalid fallback", () => {
  assert.equal(
    state.getHospitalSection(new URLSearchParams("section=Patients")),
    "Patients"
  );
  assert.equal(
    state.getHospitalSection(new URLSearchParams("section=Appointments")),
    "Appointments"
  );
  assert.equal(
    state.getHospitalSection(new URLSearchParams("section=Unknown")),
    "Dashboard"
  );
});

test("sidebar navigation produces shareable URLs and preserves earlier history state", () => {
  const initial = new URLSearchParams("section=Patients&q=John&tab=overview");
  const next = state.hospitalNavigationParams(initial, "Appointments");
  assert.equal(state.getHospitalSection(next), "Appointments");
  assert.equal(next.has("q"), false);
  assert.equal(next.has("tab"), false);
  assert.equal(state.getHospitalSection(initial), "Patients");
  assert.equal(initial.get("q"), "John");
  assert.equal(
    state.hospitalNavigationParams(next, "Dashboard").has("section"),
    false
  );
});

test("search and filter parameters can be restored on refresh", () => {
  let url = new URLSearchParams("section=Appointments&page=3");
  url = state.hospitalFilterParams(url, "q", "Maria");
  assert.equal(url.get("q"), "Maria");
  assert.equal(url.has("page"), false);
  url = state.hospitalFilterParams(url, "department", "Cardiology", "All");
  url = state.hospitalFilterParams(url, "status", "Confirmed", "All Status");
  assert.equal(
    new URLSearchParams(url.toString()).get("department"),
    "Cardiology"
  );
  assert.equal(new URLSearchParams(url.toString()).get("status"), "Confirmed");
  assert.equal(
    state
      .hospitalFilterParams(url, "department", "All", "All")
      .has("department"),
    false
  );
});

test("header and local Patients search use identical matching rules", () => {
  const results = hospitalPatientRecords.filter((record) =>
    state.matchesPatient(record, "maria")
  );
  assert.equal(results.length, 1);
  assert.equal(results[0].id, "maria-santos");
  assert.equal(
    hospitalPatientRecords.filter((record) =>
      state.matchesPatient(record, "unknown patient")
    ).length,
    0
  );
  assert.equal(
    hospitalPatientRecords.filter((record) => state.matchesPatient(record, ""))
      .length,
    8
  );
});

test("appointment search and filters keep matches limited to the chosen records", () => {
  const matches = appointmentSamples.filter(
    (item) =>
      state.matchesAppointment(item, "sarah chen") &&
      item.department === "Cardiology"
  );
  assert.ok(matches.length > 0);
  assert.ok(matches.every((item) => item.doctor === "Dr. Sarah Chen"));
  assert.equal(
    appointmentSamples.filter((item) =>
      state.matchesAppointment(item, "nonexistent doctor")
    ).length,
    0
  );
});

test("appointment drawer local edits replace only the selected row", () => {
  const original = appointmentSamples;
  const updated = { ...original[1], status: "Confirmed" };
  const next = state.replacePreviewAppointment(original, updated);
  assert.equal(next[1].status, "Confirmed");
  assert.equal(original[1].status, "Pending");
  assert.equal(next[0], original[0]);
  assert.notEqual(next, original);
});

test("mark-as-read action is idempotent and never mutates the previous state", () => {
  const original = ["previous"];
  const next = state.markPreviewNotificationRead(original, "new-appointment");
  assert.deepEqual(next, ["previous", "new-appointment"]);
  assert.deepEqual(original, ["previous"]);
  assert.equal(
    state.markPreviewNotificationRead(next, "new-appointment"),
    next
  );
});

test("every notification sample category is available as a filter", () => {
  const categories = new Set(hospitalNotificationFilters);
  assert.ok(categories.has("Prescriptions"));
  assert.ok(categories.has("Patients"));
  assert.ok(
    hospitalNotificationSamples.every((item) => categories.has(item.category))
  );
});

test("registration steps advance in order without submitting to a backend", () => {
  assert.equal(auth.nextRegistrationStep(1), 2);
  assert.equal(auth.nextRegistrationStep(2), 3);
  assert.equal(auth.nextRegistrationStep(3), "review");
});

test("administrator password validation rejects short and mismatched passwords", () => {
  assert.equal(
    auth.validatePreviewAdministrator({
      password: "123",
      confirmPassword: "123",
    }),
    "Use at least 8 characters for the password."
  );
  assert.match(
    auth.validatePreviewAdministrator({
      password: "longsecure",
      confirmPassword: "different",
    }),
    /do not match/
  );
  assert.equal(
    auth.validatePreviewAdministrator({
      password: "longsecure",
      confirmPassword: "longsecure",
    }),
    null
  );
  assert.equal(
    auth.validatePreviewAdministrator({ password: "", confirmPassword: "" }),
    null
  );
});

test("patient preview chronology keeps the last visit before the next appointment", () => {
  const john = hospitalPatientRecords.find((item) => item.id === "john-doe");
  assert.ok(john);
  assert.ok(john.lastAppointment < john.nextAppointment);
});

test("notification category filters survive refresh and reset across sections", () => {
  const initial = new URLSearchParams("section=Notifications");
  const filtered = state.hospitalFilterParams(
    initial,
    "category",
    "Patients",
    "All"
  );
  assert.equal(
    new URLSearchParams(filtered.toString()).get("category"),
    "Patients"
  );
  assert.equal(initial.has("category"), false);
  assert.equal(
    state
      .hospitalFilterParams(filtered, "category", "All", "All")
      .has("category"),
    false
  );
  assert.equal(
    state.hospitalNavigationParams(filtered, "Appointments").has("category"),
    false
  );
});

test("hospital Compose build argument uses an accepted VITE_ROUTE", () => {
  const compose = readFileSync(
    new URL("../../docker-compose.prod.yml", import.meta.url),
    "utf8"
  );
  const router = readFileSync(new URL("../../app/routes.ts", import.meta.url), "utf8");
  assert.match(
    compose,
    /hs-dashboard:\\s*\\n(?:.|\\n)*?VITE_ROUTE: hospital-dashboard/
  );
  assert.match(router, /"hospital-dashboard"/);
  assert.doesNotMatch(compose, /VITE_ROUTE: hs-dashboard/);
});

test("laboratory search and status filters round-trip through the URL", () => {
  const initial = new URLSearchParams("section=Laboratory");
  const searched = state.hospitalFilterParams(initial, "q", "blood");
  const filtered = state.hospitalFilterParams(searched, "status", "Processing", "All");
  const restored = new URLSearchParams(filtered.toString());
  assert.equal(restored.get("q"), "blood");
  assert.equal(restored.get("status"), "Processing");
  assert.equal(
    state.hospitalFilterParams(restored, "status", "All", "All").has("status"),
    false
  );
  const navigated = state.hospitalNavigationParams(restored, "Prescriptions");
  assert.equal(navigated.has("q"), false);
  assert.equal(navigated.has("status"), false);
});

test("prescription search survives a URL refresh but clears on section change", () => {
  const query = state.hospitalFilterParams(
    new URLSearchParams("section=Prescriptions"),
    "q",
    "amoxicillin"
  );
  assert.equal(new URLSearchParams(query.toString()).get("q"), "amoxicillin");
  assert.equal(
    state.hospitalFilterParams(query, "q", "").has("q"),
    false
  );
  assert.equal(state.hospitalNavigationParams(query, "Laboratory").has("q"), false);
});
