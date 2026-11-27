import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { JSDOM } from "jsdom";
import React from "react";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/onboarding",
  pretendToBeVisual: true,
});
for (const name of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "HTMLButtonElement",
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

const { render, screen, fireEvent, cleanup } =
  await import("@testing-library/react");
const { StepZeroAccountType } =
  await import("../../app/components/onboarding/step-zero-account-type");
const { SIGNUP_INTENTS, isSignupIntent } =
  await import("../../app/features/auth/intents");

afterEach(() => cleanup());

const CANONICAL = [
  "patient",
  "healthcare_professional",
  "pharmacy",
  "laboratory",
  "hospital",
];

const EXPECTED_LABELS = [
  "Patient",
  "Healthcare Professional",
  "Pharmacy",
  "Laboratory",
  "Hospital",
];

test("exposes exactly the five canonical signup intents", () => {
  assert.deepEqual([...SIGNUP_INTENTS], CANONICAL);
});

test("renders one radio per canonical intent with its canonical value", () => {
  render(
    <StepZeroAccountType
      selectedType="patient"
      onSelect={() => {}}
      onContinue={() => {}}
    />
  );

  const radios = screen.getAllByRole("radio");
  assert.equal(radios.length, 5);

  const intents = radios.map((r) => r.getAttribute("data-intent"));
  assert.deepEqual(intents, CANONICAL);

  for (const label of EXPECTED_LABELS) {
    assert.ok(screen.getByText(label), `missing label: ${label}`);
  }
});

test("keeps Laboratory and Hospital as distinct choices", () => {
  render(
    <StepZeroAccountType
      selectedType="patient"
      onSelect={() => {}}
      onContinue={() => {}}
    />
  );
  assert.ok(screen.getByText("Laboratory"));
  assert.ok(screen.getByText("Hospital"));
  assert.notEqual(screen.getByText("Laboratory"), screen.getByText("Hospital"));
});

test("exposes no generic organization/facility option", () => {
  render(
    <StepZeroAccountType
      selectedType="patient"
      onSelect={() => {}}
      onContinue={() => {}}
    />
  );
  const intents = screen
    .getAllByRole("radio")
    .map((r) => r.getAttribute("data-intent"));
  assert.ok(!intents.includes("organization"));
  assert.ok(!intents.includes("facility"));
});

test("selecting a card emits its canonical intent value", () => {
  const selected: string[] = [];
  render(
    <StepZeroAccountType
      selectedType="patient"
      onSelect={(t) => selected.push(t)}
      onContinue={() => {}}
    />
  );
  fireEvent.click(screen.getByText("Pharmacy"));
  fireEvent.click(screen.getByText("Hospital"));
  assert.deepEqual(selected, ["pharmacy", "hospital"]);
});

test("marks only the selected intent as checked", () => {
  render(
    <StepZeroAccountType
      selectedType="laboratory"
      onSelect={() => {}}
      onContinue={() => {}}
    />
  );
  const checked = screen
    .getAllByRole("radio")
    .filter((r) => r.getAttribute("aria-checked") === "true")
    .map((r) => r.getAttribute("data-intent"));
  assert.deepEqual(checked, ["laboratory"]);
});

test("isSignupIntent rejects unsupported values", () => {
  for (const v of CANONICAL) assert.ok(isSignupIntent(v));
  for (const v of ["organization", "facility", "DOCTOR", "", 1, null]) {
    assert.ok(!isSignupIntent(v));
  }
});
