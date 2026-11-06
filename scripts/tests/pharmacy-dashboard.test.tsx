import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { JSDOM } from "jsdom";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});

Object.defineProperty(dom.window, "PointerEvent", {
  configurable: true,
  value: dom.window.MouseEvent,
});

for (const name of [
  "window",
  "document",
  "navigator",
  "Element",
  "HTMLElement",
  "HTMLButtonElement",
  "HTMLFormElement",
  "Event",
  "CustomEvent",
  "MouseEvent",
  "PointerEvent",
  "MutationObserver",
  "Node",
  "NodeFilter",
  "getComputedStyle",
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

const { cleanup, fireEvent, render, screen, within, waitFor } =
  await import("@testing-library/react");

const [
  { default: MainNavbar },
  { default: PharmacyDashboard },
  { default: PhDashboardLayout },
  { UserMenu },
] = await Promise.all([
  import("../../app/components/shared/navbar"),
  import("../../app/routes/ph-dashboard/page"),
  import("../../app/routes/ph-dashboard/layout"),
  import("../../app/components/shared/user-menu"),
]);

afterEach(() => cleanup());

test("pharmacy dashboard renders the redesigned overview", () => {
  render(<PharmacyDashboard />);

  assert.ok(
    screen.getByRole("heading", {
      name: /Good (morning|afternoon|evening), MedPlus Pharmacy/,
    })
  );

  assert.ok(screen.getByText("Verified Account"));

  const statistics = screen.getByRole("region", {
    name: "Pharmacy statistics",
  });

  for (const label of [
    "New Orders",
    "Total Medicines",
    "Prescriptions Fulfilled",
    "Pending Orders",
  ]) {
    assert.ok(within(statistics).getByText(label));
  }

  assert.ok(screen.getByRole("heading", { name: "INVENTORY" }));
  assert.ok(screen.getByText("No Available Medicines"));

  assert.ok(screen.getByRole("heading", { name: "ORDERS" }));
  assert.ok(screen.getByText("No Orders yet"));

  assert.ok(screen.getByLabelText("Recent activity"));
  assert.ok(screen.getByText(/Verification is successful/));

  assert.ok(screen.getByText(/Awaiting Verification/));
});

test("pharmacy shell renders its navigation, notifications, profile and theme switch", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route element={<PhDashboardLayout />}>
          <Route index element={<PharmacyDashboard />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  for (const label of [
    "Dashboard",
    "Medicines",
    "Prescriptions",
    "Earnings",
    "Orders",
    "Pharmacy Profile",
    "Settings",
  ]) {
    assert.ok(
      screen.getAllByRole("link", { name: label }).length > 0,
      `Expected ${label} navigation link to be present`
    );
  }

  assert.ok(screen.getByRole("button", { name: "Open notifications" }));

  assert.ok(
    screen.getByRole("button", {
      name: /Jane Doe.*Medical Doctor/,
    })
  );

  assert.ok(screen.getByRole("switch"));
});

test("default navbar behavior retains the theme switch", () => {
  render(
    <MemoryRouter>
      <MainNavbar portal="Dashboard" />
    </MemoryRouter>
  );

  assert.ok(screen.getByRole("switch"));
});

test("pharmacy notifications trigger opens the notifications panel", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route element={<PhDashboardLayout />}>
          <Route index element={<PharmacyDashboard />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  const trigger = screen.getByRole("button", {
    name: "Open notifications",
  });

  assert.equal(trigger.getAttribute("data-state"), "closed");

  fireEvent.click(trigger);

  await waitFor(() => {
    assert.equal(trigger.getAttribute("data-state"), "open");
  });

  assert.ok(screen.getByText("NOTIFICATIONS"));
});

test("pharmacy profile trigger opens the profile menu and logout confirmation", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route element={<PhDashboardLayout />}>
          <Route index element={<PharmacyDashboard />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  const trigger = screen.getByRole("button", {
    name: /Jane Doe.*Medical Doctor/,
  });

  fireEvent.pointerDown(trigger, {
    button: 0,
    ctrlKey: false,
    pointerType: "mouse",
  });

  await waitFor(() => {
    assert.ok(screen.getByRole("menuitem", { name: "Profile" }));
  });

  fireEvent.click(screen.getByRole("menuitem", { name: "Logout" }));

  await waitFor(() => {
    assert.ok(screen.getByRole("heading", { name: "Log out?" }));
  });

  assert.ok(screen.getByRole("button", { name: "Stay signed in" }));
  assert.ok(screen.getByRole("button", { name: "Log out" }));
});

test("default UserMenu variant retains initials and logout confirmation", async () => {
  render(
    <UserMenu name="John Doe" role="Medical Professional" initials="JD" />
  );

  const trigger = screen.getByRole("button", {
    name: /John Doe.*Medical Professional/,
  });

  assert.ok(within(trigger).getByText("JD"));

  fireEvent.pointerDown(trigger, {
    button: 0,
    ctrlKey: false,
    pointerType: "mouse",
  });
  await waitFor(() => {
    assert.ok(screen.getByRole("menuitem", { name: "Profile" }));
  });

  fireEvent.click(screen.getByRole("menuitem", { name: "Logout" }));

  await waitFor(() => {
    assert.ok(screen.getByRole("heading", { name: "Log out?" }));
  });
});
