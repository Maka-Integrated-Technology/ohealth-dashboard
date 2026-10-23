import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { JSDOM } from "jsdom";
import React from "react";
import { MemoryRouter } from "react-router";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/dashboard",
  pretendToBeVisual: true,
});
for (const name of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "HTMLInputElement",
  "HTMLButtonElement",
  "HTMLFormElement",
  "Event",
  "MouseEvent",
  "MutationObserver",
  "Node",
  "File",
  "FileList",
]) {
  Object.defineProperty(globalThis, name, {
    configurable: true,
    value: name === "window" ? dom.window : dom.window[name as keyof Window],
  });
}
Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", {
  configurable: true,
  value: true,
  writable: true,
});

const { render, screen, fireEvent, cleanup, waitFor, within } =
  await import("@testing-library/react");
const [
  { default: LaboratoryAuthPage },
  { default: LaboratoryTestCatalogue },
  { default: LaboratoryStaffManagement },
  { default: LaboratoryBookings },
  { default: LaboratoryResults },
] = await Promise.all([
  import("../../app/features/laboratory-auth/page.tsx"),
  import("../../app/features/laboratory-dashboard/laboratory-catalogue.tsx"),
  import("../../app/features/laboratory-dashboard/laboratory-staff.tsx"),
  import("../../app/features/laboratory-dashboard/laboratory-bookings.tsx"),
  import("../../app/features/laboratory-dashboard/laboratory-results.tsx"),
]);

afterEach(() => cleanup());

function renderPage(component: React.ReactElement, initial = "/dashboard") {
  return render(
    <MemoryRouter initialEntries={[initial]}>{component}</MemoryRouter>
  );
}

test("onboarding registration button opens a rendered step and advances through a real submit", async () => {
  renderPage(<LaboratoryAuthPage />, "/");
  fireEvent.click(
    screen.getByRole("button", { name: /Register your laboratory/i })
  );
  assert.ok(screen.getByRole("heading", { name: /Laboratory details/i }));
  const form = screen
    .getByRole("heading", { name: /Laboratory details/i })
    .closest("form");
  assert.ok(form);
  fireEvent.submit(form);
  await waitFor(() =>
    assert.ok(screen.getByRole("heading", { name: /Administrator account/i }))
  );
});

test("catalogue Add Test dialog validates and submits a new preview test", async () => {
  renderPage(<LaboratoryTestCatalogue />, "/test-catalogue");
  fireEvent.click(screen.getByRole("button", { name: /Add Test/i }));
  const dialog = screen.getByRole("dialog", { name: "Add Test" });
  const form = within(dialog).getByLabelText("Test Name").closest("form");
  assert.ok(form);
  fireEvent.submit(form);
  await waitFor(() => assert.ok(within(dialog).getByRole("alert")));
  fireEvent.change(within(dialog).getByLabelText("Test Name"), {
    target: { value: "Preview Electrolyte Panel" },
  });
  fireEvent.change(within(dialog).getByLabelText("Price (₦)"), {
    target: { value: "5900" },
  });
  fireEvent.change(within(dialog).getByLabelText("Turnaround Time"), {
    target: { value: "3 hours" },
  });
  fireEvent.submit(form);
  await waitFor(() =>
    assert.equal(screen.queryByRole("dialog", { name: "Add Test" }), null)
  );
  assert.ok(screen.getByText("Preview Electrolyte Panel"));
});

test("staff Invite Staff modal submits a new local record and prevents duplicates", async () => {
  renderPage(<LaboratoryStaffManagement />, "/staff-management");
  fireEvent.click(screen.getByRole("button", { name: /Invite Staff/i }));
  const dialog = screen.getByRole("dialog", { name: "Invite Staff Member" });
  const form = within(dialog)
    .getByLabelText(/Full Name/i)
    .closest("form");
  assert.ok(form);
  fireEvent.change(within(dialog).getByLabelText(/Full Name/i), {
    target: { value: "Dr. Ngozi Adeyemi" },
  });
  fireEvent.change(within(dialog).getByLabelText(/Email Address/i), {
    target: { value: "ngozi.preview@ohealthplus.ng" },
  });
  fireEvent.submit(form);
  await waitFor(() =>
    assert.equal(
      screen.queryByRole("dialog", { name: "Invite Staff Member" }),
      null
    )
  );
  assert.ok(screen.getByText("Dr. Ngozi Adeyemi"));
  fireEvent.click(screen.getByRole("button", { name: /Invite Staff/i }));
  const duplicate = screen.getByRole("dialog", { name: "Invite Staff Member" });
  const newForm = within(duplicate)
    .getByLabelText(/Full Name/i)
    .closest("form");
  assert.ok(newForm);
  fireEvent.change(within(duplicate).getByLabelText(/Full Name/i), {
    target: { value: "A Different Staff" },
  });
  fireEvent.change(within(duplicate).getByLabelText(/Email Address/i), {
    target: { value: "ngozi.preview@ohealthplus.ng" },
  });
  fireEvent.submit(newForm);
  await waitFor(() =>
    assert.match(
      within(duplicate).getByRole("alert").textContent ?? "",
      /already exists/i
    )
  );
});

test("booking row opens the drawer, then a preview lifecycle button updates the same booking", async () => {
  renderPage(<LaboratoryBookings />, "/test-bookings");
  fireEvent.click(
    screen.getByRole("button", { name: /View booking BK-2025-0841/i })
  );
  assert.ok(screen.getByRole("button", { name: "Close booking details" }));
  fireEvent.click(screen.getByRole("button", { name: "Check In Patient" }));
  await waitFor(() =>
    assert.ok(screen.getByRole("button", { name: "Mark Sample Collected" }))
  );
  assert.ok(screen.getByText(/updated to: Checked In/i));
});

test("result review and publish buttons open a real confirmation, then update the row", async () => {
  renderPage(<LaboratoryResults />, "/results");
  fireEvent.click(
    screen.getByRole("button", { name: /View result RES-2025-0391/i })
  );
  assert.ok(screen.getByRole("button", { name: "Review & Approve" }));
  fireEvent.click(screen.getByRole("button", { name: "Review & Approve" }));
  await waitFor(() =>
    assert.ok(screen.getByRole("button", { name: "Publish Result" }))
  );
  fireEvent.click(screen.getByRole("button", { name: "Publish Result" }));
  assert.ok(screen.getByRole("alertdialog", { name: "Publish Result" }));
  fireEvent.click(
    within(
      screen.getByRole("alertdialog", { name: "Publish Result" })
    ).getByRole("button", { name: "Publish Result" })
  );
  await waitFor(() =>
    assert.equal(
      screen.queryByRole("alertdialog", { name: "Publish Result" }),
      null
    )
  );
  assert.ok(screen.getByText(/Published in this preview session/i));
});
