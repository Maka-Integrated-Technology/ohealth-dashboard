import assert from "node:assert/strict";
import test from "node:test";

import { evaluateAudit } from "./dependency-audit-policy.mjs";

function emptyAudit() {
  return {
    metadata: { vulnerabilities: { total: 0 } },
    vulnerabilities: {},
  };
}

test("accepts an audit with no vulnerabilities", () => {
  assert.deepEqual(evaluateAudit(emptyAudit()), []);
});

test("rejects every reported vulnerability", () => {
  const audit = emptyAudit();
  audit.vulnerabilities.example = {
    via: [
      {
        title: "test advisory",
        url: "https://github.com/advisories/GHSA-aaaa-bbbb-cccc",
      },
    ],
  };
  audit.metadata.vulnerabilities.total = 1;

  assert.throws(
    () => evaluateAudit(audit),
    /Dependency vulnerabilities detected:\nexample/
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
