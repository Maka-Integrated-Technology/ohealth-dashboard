import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const acceptedAdvisories = new Map([
  [
    "GHSA-vfj7-8cjw-p6xm",
    {
      packageName: "braces",
      reviewBy: "2026-11-03",
      reason:
        "No patched release exists; exposure is limited to shadcn build tooling.",
    },
  ],
]);

function advisoryId(url) {
  const match = /\/advisories\/(GHSA-[a-z0-9-]+)$/i.exec(url ?? "");
  return match?.[1];
}

export function evaluateAudit(audit, now = new Date()) {
  if (!audit || typeof audit !== "object" || !audit.vulnerabilities) {
    throw new Error("npm audit returned an unsupported result.");
  }

  const vulnerabilityNames = Object.keys(audit.vulnerabilities);
  if (audit.metadata?.vulnerabilities?.total !== vulnerabilityNames.length) {
    throw new Error("npm audit returned inconsistent vulnerability metadata.");
  }

  const accepted = new Map();
  const rejected = [];
  const dependencies = new Map();
  const directRoots = new Set();

  for (const [packageName, vulnerability] of Object.entries(
    audit.vulnerabilities
  )) {
    if (!Array.isArray(vulnerability.via) || vulnerability.via.length === 0) {
      rejected.push(`${packageName}: missing npm audit advisory chain`);
      continue;
    }

    const dependencyNames = [];
    for (const advisory of vulnerability.via) {
      if (typeof advisory === "string") {
        dependencyNames.push(advisory);
        if (!audit.vulnerabilities[advisory]) {
          rejected.push(
            `${packageName}: missing advisory dependency ${advisory}`
          );
        }
        continue;
      }

      if (!advisory || typeof advisory !== "object") {
        rejected.push(`${packageName}: malformed npm audit advisory`);
        continue;
      }

      const id = advisoryId(advisory.url);
      const exception = id ? acceptedAdvisories.get(id) : undefined;
      if (!id || !exception || exception.packageName !== packageName) {
        rejected.push(
          `${packageName}: ${id ?? advisory.title ?? "unknown advisory"}`
        );
        continue;
      }

      const reviewDeadline = new Date(`${exception.reviewBy}T23:59:59Z`);
      if (Number.isNaN(reviewDeadline.getTime()) || now > reviewDeadline) {
        rejected.push(
          `${packageName}: ${id} exception expired on ${exception.reviewBy}`
        );
        continue;
      }

      accepted.set(id, { id, packageName, ...exception });
      directRoots.add(packageName);
    }

    dependencies.set(packageName, dependencyNames);
  }

  function reachesApprovedRoot(packageName, visited = new Set()) {
    if (directRoots.has(packageName)) return true;
    if (visited.has(packageName)) return false;

    const nextVisited = new Set(visited).add(packageName);
    return (dependencies.get(packageName) ?? []).some((dependencyName) =>
      reachesApprovedRoot(dependencyName, nextVisited)
    );
  }

  for (const packageName of dependencies.keys()) {
    if (!reachesApprovedRoot(packageName)) {
      rejected.push(`${packageName}: advisory chain has no approved root`);
    }
  }

  if (rejected.length > 0) {
    throw new Error(
      `Unapproved dependency advisories:\n${rejected.join("\n")}`
    );
  }

  return [...accepted.values()];
}

function readAudit() {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const result = spawnSync(npm, ["audit", "--json"], {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
      stdio: ["ignore", "pipe", "inherit"],
    });

    try {
      if (result.error || (result.status !== 0 && result.status !== 1)) {
        throw (
          result.error ??
          new Error(`npm audit failed with status ${result.status}.`)
        );
      }

      const audit = JSON.parse(result.stdout);
      if (!audit.vulnerabilities) {
        throw new Error(
          audit.error?.summary ||
            audit.message ||
            "unsupported npm audit result"
        );
      }

      return audit;
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        Atomics.wait(
          new Int32Array(new SharedArrayBuffer(4)),
          0,
          0,
          attempt * 1_000
        );
      }
    }
  }

  throw new Error(
    `npm audit failed after 3 attempts: ${lastError instanceof Error ? lastError.message : lastError}`
  );
}

function main() {
  const accepted = evaluateAudit(readAudit());

  if (accepted.length === 0) {
    console.log("Dependency audit passed with no vulnerabilities.");
    return;
  }

  console.log("Dependency audit passed with reviewed temporary exceptions:");
  for (const advisory of accepted) {
    console.log(
      `- ${advisory.id} (${advisory.packageName}), review by ${advisory.reviewBy}: ${advisory.reason}`
    );
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
