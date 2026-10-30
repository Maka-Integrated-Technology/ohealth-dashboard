import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export function evaluateAudit(audit) {
  if (!audit || typeof audit !== "object" || !audit.vulnerabilities) {
    throw new Error("npm audit returned an unsupported result.");
  }

  const vulnerabilityNames = Object.keys(audit.vulnerabilities);
  if (audit.metadata?.vulnerabilities?.total !== vulnerabilityNames.length) {
    throw new Error("npm audit returned inconsistent vulnerability metadata.");
  }

  if (vulnerabilityNames.length > 0) {
    throw new Error(
      `Dependency vulnerabilities detected:\n${vulnerabilityNames.join("\n")}`
    );
  }

  return [];
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
  evaluateAudit(readAudit());
  console.log("Dependency audit passed with no vulnerabilities.");
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
