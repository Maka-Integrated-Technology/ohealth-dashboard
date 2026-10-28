import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { JSDOM } from "jsdom";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});

for (const name of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "HTMLButtonElement",
  "HTMLFormElement",
  "Event",
  "MouseEvent",
  "MutationObserver",
  "Node",
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

const { cleanup, render, screen, within } =
  await import("@testing-library/react");
const [
  { default: MainNavbar },
  { default: PharmacyDashboard },
  { default: PhDashboardLayout },
] = await Promise.all([
  import("../../app/components/shared/navbar"),
  import("../../app/routes/ph-dashboard/page"),
  import("../../app/routes/ph-dashboard/layout"),
]);

afterEach(() => cleanup());

test("pharmacy dashboard renders the required overview and order data", () => {
  render(<PharmacyDashboard />);

  assert.ok(
    screen.getByRole("heading", {
      name: "Welcome back, MedPlus Pharmacy",
    })
  );
  assert.equal(
    within(
      screen.getByRole("region", { name: "Pharmacy overview" })
    ).getAllByRole("heading").length,
    4
  );
  assert.equal(screen.getAllByRole("row").length, 7);
  assert.ok(screen.getByText("ORD-8492"));
  assert.ok(screen.getByText("3 Low Stock"));
  assert.ok(screen.getByText("Pharmacy License Verified"));
});

test("compact pharmacy shell renders its navigation and omits the theme switch", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route element={<PhDashboardLayout />}>
          <Route index element={<PharmacyDashboard />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  assert.ok(screen.getAllByRole("link", { name: "Inventory" }).length > 0);
  assert.ok(screen.getByRole("button", { name: "Notifications" }));
  assert.ok(screen.getByRole("button", { name: "Sign out" }));
  assert.equal(screen.queryByRole("switch"), null);
});

test("default navbar behavior retains the theme switch", () => {
  render(
    <MemoryRouter>
      <MainNavbar portal="Dashboard" />
    </MemoryRouter>
  );

  assert.ok(screen.getByRole("switch"));
});
