#!/usr/bin/env node
/**
 * Regenerates Docusaurus versioned docs for all semver tags (most recent first).
 * Falls back to packages/webuntis-api/package.json stableVersion/version if no tags.
 * Skips if no valid semver can be determined.
 */
const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "../../..");
const docsRoot = path.resolve(__dirname, "..");
const versionsFile = path.join(docsRoot, "versions.json");
const versionedDocsDir = path.join(docsRoot, "versioned_docs");
const versionedSidebarsDir = path.join(docsRoot, "versioned_sidebars");

function tryGit(cmd) {
  try {
    return execSync(cmd, {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
  } catch {
    return "";
  }
}

function ensureTagsAvailable() {
  // GitHub Actions often checks out without tags unless fetch-depth is 0. Try to
  // fetch tags automatically when running in CI and none are present.
  const isCI = process.env.GITHUB_ACTIONS === "true" || process.env.CI === "true";
  if (!isCI) return;

  const tagCount = Number(tryGit(`git tag --list | wc -l`)) || 0;
  if (tagCount > 0) return;

  console.log("[prepare:versions] No tags found; fetching tags from origin...");
  try {
    execSync(`git fetch --force --tags --prune --update-shallow origin`, {
      cwd: repoRoot,
      stdio: "inherit",
    });
    const tagCountAfter = Number(tryGit(`git tag --list | wc -l`)) || 0;
    if (tagCountAfter === 0) {
      console.warn("[prepare:versions] Still no tags after fetch; will fall back to package version.");
    }
  } catch (err) {
    console.warn("[prepare:versions] Failed to fetch tags:", err.message);
  }
}

function normalizeSemver(value) {
  if (typeof value !== "string") return null;
  const match = value.trim().match(/^v?([0-9]+\.[0-9]+\.[0-9]+(?:-[A-Za-z0-9.-]+)?)$/);
  return match ? match[1] : null;
}

function collectSemverVersions() {
  ensureTagsAvailable();
  const tags = [];

  // Scoped tags like @scope/pkg@1.2.3 -> 1.2.3
  const scopedTags = tryGit(`git tag --list "*@*" --sort=-creatordate`)
    .split("\n")
    .filter(Boolean)
    .map((t) => t.replace(/^.*@/, ""));
  tags.push(...scopedTags);

  // Unscoped tags
  const plainTags = tryGit(`git tag --list --sort=-creatordate`).split("\n").filter(Boolean);
  tags.push(...plainTags);

  const seen = new Set();
  const semverTags = [];
  for (const t of tags) {
    const normalized = normalizeSemver(t);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    semverTags.push(normalized);
  }
  return semverTags;
}

function fallbackVersion() {
  try {
    const pkg = require(path.join(repoRoot, "packages/webuntis-api/package.json"));
    const v = normalizeSemver(pkg.stableVersion || pkg.version);
    if (v) return [v];
  } catch {
    // ignore
  }
  return [];
}

function versionAlreadyGenerated(version) {
  try {
    if (fs.existsSync(versionsFile)) {
      const versions = JSON.parse(fs.readFileSync(versionsFile, "utf8"));
      if (Array.isArray(versions) && versions.includes(version)) {
        return true;
      }
    }
    const versionedDocsPath = path.join(docsRoot, "versioned_docs", `version-${version}`);
    return fs.existsSync(versionedDocsPath);
  } catch {
    return false;
  }
}

function removeExistingVersionArtifacts(version) {
  let removed = false;
  // Remove the version from versions.json if present.
  if (fs.existsSync(versionsFile)) {
    try {
      const versions = JSON.parse(fs.readFileSync(versionsFile, "utf8"));
      if (Array.isArray(versions)) {
        const filtered = versions.filter((v) => v !== version);
        if (filtered.length !== versions.length) {
          fs.writeFileSync(versionsFile, JSON.stringify(filtered, null, 2));
          removed = true;
        }
      }
    } catch {
      // ignore JSON issues; fall through to removing folders
    }
  }

  // Remove versioned docs folder and sidebars file if they exist.
  const docsPath = path.join(versionedDocsDir, `version-${version}`);
  const sidebarsPath = path.join(versionedSidebarsDir, `version-${version}-sidebars.json`);
  if (fs.existsSync(docsPath)) {
    fs.rmSync(docsPath, { recursive: true, force: true });
    removed = true;
  }
  if (fs.existsSync(sidebarsPath)) {
    fs.rmSync(sidebarsPath, { force: true });
    removed = true;
  }

  return removed;
}

function cleanVersionedArtifacts() {
  const targets = ["versioned_docs", "versioned_sidebars", "versions.json"];
  for (const target of targets) {
    const p = path.join(docsRoot, target);
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
    }
  }
}

function main() {
  const versions = collectSemverVersions();
  const allVersions = versions.length ? versions : fallbackVersion();

  if (!allVersions.length) {
    console.log("[prepare:versions] No valid semver tags found; skipping docs versioning.");
    return;
  }

  cleanVersionedArtifacts();
  for (const v of allVersions) {
    // Ensure any stale artifacts for this version are removed so Docusaurus won't error.
    const removed = removeExistingVersionArtifacts(v);
    if (versionAlreadyGenerated(v)) {
      console.log(`[prepare:versions] Skipping ${v}; version already exists.`);
      continue;
    }
    if (removed) {
      console.log(`[prepare:versions] Removed stale artifacts for ${v}.`);
    }
    console.log(`[prepare:versions] Generating docs version ${v}`);
    execSync(`yarn docusaurus docs:version ${v}`, {
      cwd: docsRoot,
      stdio: "inherit",
    });
  }
}

main();
