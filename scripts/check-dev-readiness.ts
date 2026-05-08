#!/usr/bin/env bun

import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  packageManager?: string;
};

const repoRoot = path.resolve(import.meta.dirname, "..");

async function readPackageJson(): Promise<PackageJson> {
  return Bun.file(path.join(repoRoot, "package.json")).json();
}

function packageDir(packageName: string): string {
  return path.join(repoRoot, "node_modules", ...packageName.split("/"));
}

async function collectSourceFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      files.push(...(await collectSourceFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function ensureDeclaredPackagesInstalled(packageJson: PackageJson) {
  const declared = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const missing = Object.keys(declared).filter(
    (packageName) => !existsSync(packageDir(packageName))
  );

  if (missing.length === 0) return;

  console.warn(
    `[dev-check] Missing ${missing.length} declared package(s): ${missing
      .slice(0, 8)
      .join(", ")}${missing.length > 8 ? ", ..." : ""}`
  );
  console.warn("[dev-check] Running bun install before starting dev...");

  const install = Bun.spawnSync(["bun", "install"], {
    cwd: repoRoot,
    stdout: "inherit",
    stderr: "inherit",
  });

  if (install.exitCode !== 0) {
    throw new Error("[dev-check] bun install failed; dev server was not started.");
  }
}

async function ensureGeneratedVariantMarkersAreNotCommitted() {
  const sourceFiles = await collectSourceFiles(path.join(repoRoot, "src"));
  const offenders: Array<{ file: string; line: number; text: string }> = [];

  for (const file of sourceFiles) {
    const text = await readFile(file, "utf8");
    const lines = text.split("\n");

    lines.forEach((line, index) => {
      if (
        line.includes("data-impeccable-variants") ||
        line.includes("impeccable-variants-")
      ) {
        offenders.push({
          file: path.relative(repoRoot, file),
          line: index + 1,
          text: line.trim(),
        });
      }
    });
  }

  if (offenders.length === 0) return;

  const details = offenders
    .slice(0, 10)
    .map((offender) => `  - ${offender.file}:${offender.line} ${offender.text}`)
    .join("\n");

  throw new Error(
    [
      "[dev-check] Generated variant markers were found in src/.",
      "These have broken Vite dependency scanning before; remove them before starting dev.",
      details,
    ].join("\n")
  );
}

function warnIfBunVersionLooksOld(packageJson: PackageJson) {
  const required = packageJson.packageManager?.match(/^bun@(.+)$/)?.[1];
  if (!required || !Bun.version) return;

  if (Bun.version !== required) {
    console.warn(
      `[dev-check] package.json declares bun@${required}; current Bun is ${Bun.version}. Continuing, but upgrade Bun if dev/build behavior looks odd.`
    );
  }
}

export async function runDevReadinessCheck() {
  if (process.env.SKIP_DEV_READINESS === "1") {
    console.warn("[dev-check] Skipped because SKIP_DEV_READINESS=1.");
    return;
  }

  const packageJson = await readPackageJson();
  warnIfBunVersionLooksOld(packageJson);
  await ensureDeclaredPackagesInstalled(packageJson);
  await ensureGeneratedVariantMarkersAreNotCommitted();
}

if (import.meta.main) {
  try {
    await runDevReadinessCheck();
    console.log("[dev-check] OK");
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
