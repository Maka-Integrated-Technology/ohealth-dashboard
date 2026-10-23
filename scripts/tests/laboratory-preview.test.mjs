import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import test from "node:test";
import { URL, URLSearchParams } from "node:url";
import ts from "typescript";

// Execute the same pure TypeScript modules imported by the laboratory UI.
// This runs in Node 20 without altering the frontend's production dependency tree.
async function loadTs(path) {
  const file = new URL("../../app/features/laboratory-dashboard/" + path, import.meta.url);
  const output = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return import("data:text/javascript;base64," + Buffer.from(output).toString("base64"));
}

const [state, staff, catalogue, bookings, results] = await Promise.all([
  loadTs("laboratory-list-state.ts"),
  loadTs("laboratory-staff-data.ts"),
  loadTs("laboratory-catalogue-data.ts"),
  loadTs("laboratory-bookings-data.ts"),
  loadTs("laboratory-results-data.ts"),
]);

test("laboratory searches survive refresh and remove empty/default params", () => {
  const initial = new URLSearchParams("tab=Upcoming&page=3");
  const searched = state.labListParams(initial, "q", "Adeyemi");
  assert.equal(new URLSearchParams(searched.toString()).get("q"), "Adeyemi");
  assert.equal(searched.has("page"), false);
  assert.equal(initial.has("q"), false);
  assert.equal(state.labListParams(searched, "q", "").has("q"), false);
});

test("lab section filters preserve tabs and validate untrusted params", () => {
  const initial = new URLSearchParams("tab=Pending&category=Imaging");
  const after = state.labListParams(initial, "category", "Blood Tests");
  assert.equal(after.get("tab"), "Pending");
  assert.equal(after.get("category"), "Blood Tests");
  assert.equal(state.labParam(after, "tab", ["All", "Pending"], "All"), "Pending");
  assert.equal(state.labParam(new URLSearchParams("tab=unknown"), "tab", ["All", "Pending"], "All"), "All");
  assert.equal(state.labListParams(after, "tab", "All", "All").has("tab"), false);
});

test("staff preview searches role, email and last active without case sensitivity", () => {
  assert.equal(staff.INITIAL_LAB_STAFF.length, 6);
  assert.equal(staff.INITIAL_LAB_STAFF.filter((item) => state.labStaffMatch(item, "chiamaka")).length, 1);
  assert.equal(staff.INITIAL_LAB_STAFF.filter((item) => state.labStaffMatch(item, "quality assurance")).length, 1);
  assert.equal(staff.INITIAL_LAB_STAFF.filter((item) => state.labStaffMatch(item, "unknown person")).length, 0);
});

test("staff invitation and edit checks prevent duplicate email except for same member", () => {
  const first = staff.INITIAL_LAB_STAFF[0];
  assert.equal(state.labUniqueEmail(staff.INITIAL_LAB_STAFF, first.email.toUpperCase(), null), false);
  assert.equal(state.labUniqueEmail(staff.INITIAL_LAB_STAFF, first.email, first.id), true);
  assert.equal(state.labUniqueEmail(staff.INITIAL_LAB_STAFF, "new@ohealthplus.ng", null), true);
});

test("staff status, role and permissions edits affect only the selected preview row", () => {
  const original = staff.INITIAL_LAB_STAFF;
  const updated = { ...original[0], status: "Inactive", permissions: [] };
  const next = state.labReplaceById(original, updated);
  assert.equal(next[0].status, "Inactive");
  assert.equal(next[0].permissions.length, 0);
  assert.equal(original[0].status, "Active");
  assert.strictEqual(next[1], original[1]);
});

test("catalogue search recognizes tests and safely preserves nonedited rows", () => {
  assert.ok(catalogue.INITIAL_CATALOGUE_TESTS.length > 4);
  const target = catalogue.INITIAL_CATALOGUE_TESTS[0];
  assert.equal(state.labTextMatch([target.name, target.category, target.id], "cbc"), true);
  const result = state.labReplaceById(catalogue.INITIAL_CATALOGUE_TESTS, { ...target, active: false });
  assert.equal(result[0].active, false);
  assert.equal(catalogue.INITIAL_CATALOGUE_TESTS[0].active, true);
});

test("booking transitions replace one booking and preserve other patients", () => {
  const original = bookings.INITIAL_BOOKINGS;
  const target = original[0];
  const next = state.labReplaceById(original, { ...target, status: "Cancelled" });
  assert.equal(next[0].status, "Cancelled");
  assert.notEqual(next[0], target);
  assert.strictEqual(next[1], original[1]);
  assert.equal(bookings.lifecycleIndex("Completed") >= bookings.lifecycleIndex("Confirmed"), true);
});

test("results publish preview transition doesn't mutate another result", () => {
  const original = results.INITIAL_LAB_RESULTS;
  const updated = { ...original[0], status: "Published", approved: true };
  const next = state.labReplaceById(original, updated);
  assert.equal(next[0].status, "Published");
  assert.equal(original[0].status, "Under Review");
  assert.strictEqual(next[1], original[1]);
});

test("notification read helper is idempotent and doesn't mutate original list", () => {
  const list = [{ id: "n1", unread: true }, { id: "n2", unread: true }];
  const next = state.labWithNotificationRead(list, "n1");
  assert.deepEqual(next.map((item) => item.unread), [false, true]);
  assert.deepEqual(list.map((item) => item.unread), [true, true]);
  assert.equal(state.labWithNotificationRead(next, "n1")[0].unread, false);
});
