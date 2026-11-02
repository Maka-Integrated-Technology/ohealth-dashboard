import assert from "node:assert/strict";
import test from "node:test";

import {
  acceptedAdvisories,
  evaluateAudit,
} from "./dependency-audit-policy.mjs";

const beforeDeadline = new Date("2026-11-02T00:00:00Z");

function emptyAudit() {
  return {
    metadata: { vulnerabilities: { total: 0 } },
    vulnerabilities: {},
  };
}

function auditFor(packageName, url) {
  return {
    metadata: { vulnerabilities: { total: 1 } },
    vulnerabilities: {
      [packageName]: {
        via: [{ title: "test advisory", url }],
      },
    },
  };
}

test("accepts an audit with no vulnerabilities", () => {
  assert.deepEqual(evaluateAudit(emptyAudit()), []);
});

test("accepts the reviewed minimatch advisory before its deadline", () => {
  const audit = auditFor(
    "minimatch",
    "https://github.com/advisories/GHSA-g3hv-75wg-m249"
  );

  assert.equal(evaluateAudit(audit, beforeDeadline).length, 1);
});

test("requires ownership, tracking, and an expiry date", () => {
  const exception = acceptedAdvisories.get("GHSA-g3hv-75wg-m249");

  assert.equal(exception.packageName, "minimatch");
  assert.equal(exception.reviewBy, "2026-11-16");
  assert.match(exception.reason, /ohealth-dashboard\/issues\/66/);
});

test("accepts transitive findings only when they reach the reviewed root", () => {
  const audit = auditFor(
    "minimatch",
    "https://github.com/advisories/GHSA-g3hv-75wg-m249"
  );
  audit.vulnerabilities.eslint = { via: ["minimatch"] };
  audit.metadata.vulnerabilities.total = 2;

  assert.equal(evaluateAudit(audit, beforeDeadline).length, 1);
});

test("rejects an unreviewed advisory", () => {
  const audit = auditFor(
    "example-package",
    "https://github.com/advisories/GHSA-aaaa-bbbb-cccc"
  );

  assert.throws(
    () => evaluateAudit(audit, beforeDeadline),
    /Unapproved dependency advisories/
  );
});

test("rejects a different advisory reported against minimatch", () => {
  const audit = auditFor(
    "minimatch",
    "https://github.com/advisories/GHSA-aaaa-bbbb-cccc"
  );

  assert.throws(
    () => evaluateAudit(audit, beforeDeadline),
    /Unapproved dependency advisories/
  );
});

test("rejects a reviewed advisory reported against another package", () => {
  const audit = auditFor(
    "example-package",
    "https://github.com/advisories/GHSA-g3hv-75wg-m249"
  );

  assert.throws(
    () => evaluateAudit(audit, beforeDeadline),
    /Unapproved dependency advisories/
  );
});

test("rejects a transitive finding without its advisory root", () => {
  const audit = emptyAudit();
  audit.vulnerabilities.eslint = { via: ["minimatch"] };
  audit.metadata.vulnerabilities.total = 1;

  assert.throws(
    () => evaluateAudit(audit, beforeDeadline),
    /missing advisory dependency/
  );
});

test("rejects the exception after its deadline", () => {
  const audit = auditFor(
    "minimatch",
    "https://github.com/advisories/GHSA-g3hv-75wg-m249"
  );

  assert.throws(
    () => evaluateAudit(audit, new Date("2026-11-17T00:00:00Z")),
    /exception expired/
  );
});

test("rejects malformed audit metadata", () => {
  const audit = emptyAudit();
  audit.metadata.vulnerabilities.total = 1;

  assert.throws(
    () => evaluateAudit(audit),
    /inconsistent vulnerability metadata/
  );
});

test("rejects unsupported audit output", () => {
  assert.throws(
    () => evaluateAudit({}),
    /npm audit returned an unsupported result/
  );
});
