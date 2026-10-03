import assert from "node:assert/strict";
import test from "node:test";

import { evaluateAudit } from "./dependency-audit-policy.mjs";

const advisoryUrl = "https://github.com/advisories/GHSA-vfj7-8cjw-p6xm";
const beforeDeadline = new Date("2026-10-03T00:00:00Z");

function auditFor(packageName = "braces", url = advisoryUrl) {
  return {
    metadata: { vulnerabilities: { total: 1 } },
    vulnerabilities: {
      [packageName]: { via: [{ title: "test advisory", url }] },
    },
  };
}

test("accepts the reviewed braces advisory", () => {
  assert.equal(evaluateAudit(auditFor(), beforeDeadline).length, 1);
});

test("rejects an unreviewed advisory", () => {
  assert.throws(
    () =>
      evaluateAudit(
        auditFor(
          "example",
          "https://github.com/advisories/GHSA-aaaa-bbbb-cccc"
        ),
        beforeDeadline
      ),
    /Unapproved dependency advisories/
  );
});

test("rejects the reviewed advisory for the wrong package", () => {
  assert.throws(
    () => evaluateAudit(auditFor("example"), beforeDeadline),
    /Unapproved dependency advisories/
  );
});

test("accepts transitive entries that reach the reviewed root", () => {
  const audit = auditFor();
  audit.vulnerabilities.micromatch = { via: ["braces"] };
  audit.metadata.vulnerabilities.total = 2;

  assert.equal(evaluateAudit(audit, beforeDeadline).length, 1);
});

test("rejects an orphaned transitive entry", () => {
  const audit = {
    metadata: { vulnerabilities: { total: 1 } },
    vulnerabilities: { micromatch: { via: ["braces"] } },
  };

  assert.throws(
    () => evaluateAudit(audit, beforeDeadline),
    /missing advisory dependency/
  );
});

test("rejects an expired exception", () => {
  assert.throws(
    () => evaluateAudit(auditFor(), new Date("2026-11-04T00:00:00Z")),
    /exception expired/
  );
});

test("rejects malformed audit metadata", () => {
  const audit = auditFor();
  audit.metadata.vulnerabilities.total = 0;

  assert.throws(
    () => evaluateAudit(audit),
    /inconsistent vulnerability metadata/
  );
});
