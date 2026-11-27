import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { JSDOM } from "jsdom";
import React from "react";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/verify-email",
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
const { ChallengeCodeForm } =
  await import("../../app/features/auth/challenge-code-form");

afterEach(() => cleanup());

const baseProps = {
  heading: "Check your email",
  description: "Enter the code",
  isVerifying: false,
  isResending: false,
  resendCooldownSeconds: 0,
  error: null,
  onRestart: () => {},
  restartLabel: "Start over",
};

test("verify submits the trimmed code", () => {
  const codes: string[] = [];
  render(
    <ChallengeCodeForm
      {...baseProps}
      onVerify={(c) => codes.push(c)}
      onResend={() => {}}
    />
  );
  fireEvent.change(screen.getByPlaceholderText("Enter code"), {
    target: { value: "  123456 " },
  });
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  assert.deepEqual(codes, ["123456"]);
});

test("continue is disabled until a code is entered", () => {
  render(
    <ChallengeCodeForm {...baseProps} onVerify={() => {}} onResend={() => {}} />
  );
  const button = screen.getByRole("button", { name: "Continue" });
  assert.equal((button as HTMLButtonElement).disabled, true);
});

test("resend is disabled and counts down during cooldown", () => {
  render(
    <ChallengeCodeForm
      {...baseProps}
      resendCooldownSeconds={30}
      onVerify={() => {}}
      onResend={() => {}}
    />
  );
  const resend = screen.getByRole("button", { name: "Resend code in 30s" });
  assert.equal((resend as HTMLButtonElement).disabled, true);
});

test("a dead challenge replaces the form with a restart action and blocks verification", () => {
  let verified = false;
  let restarted = false;
  render(
    <ChallengeCodeForm
      {...baseProps}
      onVerify={() => {
        verified = true;
      }}
      onResend={() => {}}
      onRestart={() => {
        restarted = true;
      }}
      error={{
        code: "AUTH_CHALLENGE_EXPIRED",
        recovery: "restart",
        retryAfterSeconds: null,
        message: "That code has expired. Please start again.",
      }}
    />
  );
  // No code input is offered once the challenge is dead.
  assert.equal(screen.queryByPlaceholderText("Enter code"), null);
  fireEvent.click(screen.getByRole("button", { name: "Start over" }));
  assert.equal(restarted, true);
  assert.equal(verified, false);
});

test("a wrong code keeps the form and shows an inline error", () => {
  render(
    <ChallengeCodeForm
      {...baseProps}
      onVerify={() => {}}
      onResend={() => {}}
      error={{
        code: "AUTH_CHALLENGE_CODE_INVALID",
        recovery: "retry-code",
        retryAfterSeconds: null,
        message: "That code isn't right. Please try again.",
      }}
    />
  );
  assert.ok(screen.getByPlaceholderText("Enter code"));
  assert.ok(screen.getByText("That code isn't right. Please try again."));
});

test("resend control is hidden when no resend handler is provided (MFA)", () => {
  render(<ChallengeCodeForm {...baseProps} onVerify={() => {}} />);
  assert.equal(screen.queryByText(/Resend code/), null);
});
