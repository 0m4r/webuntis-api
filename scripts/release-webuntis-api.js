#!/usr/bin/env node
/**
 * Release helper for packages/webuntis-api.
 *
 * Usage examples:
 *   node scripts/release-webuntis-api.js --version 3.1.0 --channel latest --execute --push-tag
 *   node scripts/release-webuntis-api.js --version 3.1.0-beta.1 --channel beta --execute
 *
 * Defaults to dry-run (prints commands). Use --execute to actually run them.
 */
const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");
const { execSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const rootPackageJsonPath = path.join(repoRoot, "package.json");
const packageDir = path.join(repoRoot, "packages", "webuntis-api");
const packageJsonPath = path.join(packageDir, "package.json");
const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const pkgName = pkgJson.name;
const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, "utf8"));
const packageManager = detectPackageManager(rootPackageJson, { repoRoot });

(async function main() {
  const allowedChannels = new Set(["latest", "beta", "canary"]);
  const args = parseArgs(process.argv.slice(2));

  const version = args.version || args.v;
  const channel = args.channel || args.c || "latest";
  const execute = Boolean(args.execute);
  const pushTag = Boolean(args["push-tag"]);
  const allowDirty = Boolean(args["allow-dirty"]);
  const autoYes = Boolean(args.yes || args.y);
  const registry = args.registry || "https://npm.pkg.github.com";

  if (!allowedChannels.has(channel)) {
    fail(`Invalid --channel "${channel}". Use one of: ${Array.from(allowedChannels).join(", ")}`);
  }

  ensureWorkingTreeClean({ allowDirty });

  const branch = getCurrentBranch();
  const latestTaggedVersion = getLatestTaggedVersion(pkgName);
  const resolvedVersion =
    version ||
    suggestVersion({
      branch,
      packageVersion: pkgJson.version,
      latestTaggedVersion,
    });
  const versionCommand = getVersionCommand({ packageManager, version: resolvedVersion, packageDir });
  run(versionCommand, { execute });

  const refreshedPackageJson = execute ? JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) : pkgJson;
  ensureVersionMatchesPackage(resolvedVersion, refreshedPackageJson, { skip: !execute });

  const filesToCommit = collectVersionArtifacts({ packageDir, packageJsonPath });
  const commitMessage = `release: ${pkgName}@${resolvedVersion}`;
  stageAndCommit(filesToCommit, commitMessage, { execute });

  const gitTag = `${pkgName}@${resolvedVersion}`;
  const commands = [
    `git tag ${gitTag}`,
    ...(pushTag ? [`git push origin ${gitTag}`] : []),
    `cd ${packageDir} && npm publish --tag ${channel} --registry=${registry}`,
  ];

  log(`
Preparing release:
- package: ${pkgName}
- version: ${resolvedVersion}${version ? "" : " (suggested)"}
- channel: ${channel}
- registry: ${registry}
 - git tag: ${gitTag}
 - mode: ${execute ? "execute" : "dry-run"}
 - push git tag: ${pushTag ? "yes" : "no"}
`);

  if (execute && !autoYes) {
    await confirmTag({ gitTag });
  }

  for (const cmd of commands) {
    run(cmd, { execute });
  }
})().catch((err) => {
  fail(err.message || String(err));
});

function run(cmd, { execute }) {
  if (!execute) {
    console.log(`[dry-run] ${cmd}`);
    return;
  }
  console.log(cmd);
  execSync(cmd, { stdio: "inherit" });
}

function ensureWorkingTreeClean({ allowDirty }) {
  if (allowDirty) return;
  const status = execSync("git status --porcelain", { cwd: repoRoot }).toString().trim();
  if (status) {
    fail("Working tree is dirty. Commit or stash changes, or re-run with --allow-dirty.");
  }
}

function ensureVersionMatchesPackage(requestedVersion, pkg, { skip } = {}) {
  if (skip) return;
  if (pkg.version !== requestedVersion) {
    log(
      `Warning: package.json version (${pkg.version}) differs from --version (${requestedVersion}). ` +
        "Make sure package.json is updated before publishing.",
    );
  }
}

function collectVersionArtifacts({ packageDir, packageJsonPath }) {
  const files = [packageJsonPath];
  const lockfiles = ["yarn.lock", "package-lock.json", "pnpm-lock.yaml"];
  for (const lock of lockfiles) {
    const candidate = path.join(packageDir, lock);
    if (fs.existsSync(candidate)) files.push(candidate);
  }
  return files;
}

function stageAndCommit(files, message, { execute }) {
  if (!execute) {
    console.log(`[dry-run] git add ${files.map((f) => path.relative(repoRoot, f)).join(" ")}`);
    console.log(`[dry-run] git commit -m "${message}"`);
    return;
  }
  const relative = files.map((f) => path.relative(repoRoot, f));
  run(`git add ${relative.join(" ")}`, { execute });
  const diff = execSync("git diff --cached --name-only", { cwd: repoRoot }).toString().trim();
  if (!diff) {
    log("No changes to commit after version bump; skipping commit.");
    return;
  }
  run(`git commit -m "${message}"`, { execute });
}

function detectPackageManager(rootPkg, { repoRoot }) {
  /** Decide npm vs yarn using packageManager or lockfile fallback. */
  const declared = rootPkg.packageManager;
  if (typeof declared === "string") {
    const [name, version] = declared.split("@");
    return { name, major: version ? Number(version.split(".")[0]) || null : null };
  }
  if (fs.existsSync(path.join(repoRoot, "yarn.lock"))) return { name: "yarn", major: 1 };
  return { name: "npm", major: null };
}

function getVersionCommand({ packageManager, version, packageDir }) {
  if (packageManager.name === "yarn") {
    // Yarn Classic supports --new-version; Berry uses `yarn version <semver> --immediate`.
    if ((packageManager.major || 1) >= 2) {
      return `cd ${packageDir} && yarn version ${version} --immediate`;
    }
    return `cd ${packageDir} && yarn version --new-version ${version} --no-git-tag-version`;
  }
  return `cd ${packageDir} && npm version ${version} --no-git-tag-version`;
}

function getCurrentBranch() {
  return execSync("git rev-parse --abbrev-ref HEAD", { cwd: repoRoot }).toString().trim();
}

async function confirmTag({ gitTag }) {
  const answer = await askQuestion(`Create git tag ${gitTag}? [y/N]: `);
  if (!/^y(?:es)?$/i.test(answer.trim())) {
    fail("Aborted by user.");
  }
}

function getLatestTaggedVersion(packageName) {
  const raw = execSync(`git tag --list "${packageName}@*"`, { cwd: repoRoot }).toString().trim();
  if (!raw) return null;
  const tags = raw
    .split("\n")
    .map((tag) => tag.replace(`${packageName}@`, ""))
    .filter(Boolean);
  const parsed = tags.map(parseSemver).filter(Boolean);
  return parsed.length ? formatSemver(parsed.reduce(maxSemver)) : null;
}

function suggestVersion({ branch, packageVersion, latestTaggedVersion }) {
  /**
   * Suggest the next version:
   * - main/master: bump patch release
   * - beta/canary branches: prerelease with matching preid
   * - other branches: prerelease tagged as test-<branch>
   * Uses the higher of package.json and latest tag as the base.
   */
  const parsedPackage = parseSemver(packageVersion);
  if (!parsedPackage) {
    fail(`package.json version "${packageVersion}" is not a valid semver.`);
  }
  const candidates = [parsedPackage];
  const parsedTag = latestTaggedVersion ? parseSemver(latestTaggedVersion) : null;
  if (parsedTag) candidates.push(parsedTag);
  const latest = candidates.reduce(maxSemver);
  const releaseBase = stripPrerelease(latest);

  if (branch === "main" || branch === "master") {
    return formatSemver(incrementPatch(releaseBase));
  }

  const preid = inferPreid(branch);
  const prereleaseBase = latest.prerelease ? releaseBase : incrementPatch(releaseBase);
  const nextNumber = nextPrereleaseNumber({ candidates, preid, releaseBase: prereleaseBase }) + 1;

  return formatSemver({
    ...prereleaseBase,
    prerelease: [preid, String(nextNumber)],
  });
}

function inferPreid(branch) {
  const lower = branch.toLowerCase();
  if (lower.includes("beta")) return "beta";
  if (lower.includes("canary")) return "canary";
  const clean = sanitizePrereleaseIdent(branch) || "adhoc";
  return `test-${clean}`;
}

function sanitizePrereleaseIdent(value) {
  /** Make a prerelease identifier safe for semver (alnum and hyphen only). */
  return value.replace(/[^0-9a-zA-Z-]/g, "-");
}

function nextPrereleaseNumber({ candidates, preid, releaseBase }) {
  let maxNumber = -1;
  for (const cand of candidates) {
    if (!cand.prerelease) continue;
    if (cand.major !== releaseBase.major || cand.minor !== releaseBase.minor || cand.patch !== releaseBase.patch) {
      continue;
    }
    if (cand.prerelease[0] !== preid) continue;
    const tail = cand.prerelease[cand.prerelease.length - 1];
    if (typeof tail === "number") {
      maxNumber = Math.max(maxNumber, tail);
    }
  }
  return maxNumber;
}

function stripPrerelease(semver) {
  return { major: semver.major, minor: semver.minor, patch: semver.patch, prerelease: null };
}

function incrementPatch(semver) {
  return { major: semver.major, minor: semver.minor, patch: semver.patch + 1, prerelease: null };
}

function parseSemver(input) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.exec(input);
  if (!match) return null;
  const [, major, minor, patch, pre] = match;
  const prerelease = pre
    ? pre.split(".").map((part) => {
        const num = Number(part);
        return Number.isInteger(num) && String(num) === part ? num : part;
      })
    : null;
  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    prerelease,
  };
}

function formatSemver({ major, minor, patch, prerelease }) {
  const base = `${major}.${minor}.${patch}`;
  if (!prerelease || prerelease.length === 0) return base;
  return `${base}-${prerelease.join(".")}`;
}

function maxSemver(left, right) {
  const result = compareSemver(left, right);
  return result >= 0 ? left : right;
}

function compareSemver(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  if (a.patch !== b.patch) return a.patch - b.patch;
  return comparePrerelease(a.prerelease, b.prerelease);
}

function comparePrerelease(a, b) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i += 1) {
    const left = a[i];
    const right = b[i];
    if (left === undefined) return -1;
    if (right === undefined) return 1;
    if (typeof left === "number" && typeof right === "number") {
      if (left !== right) return left - right;
    } else if (typeof left === "number") {
      return -1;
    } else if (typeof right === "number") {
      return 1;
    } else if (left !== right) {
      return left < right ? -1 : 1;
    }
  }
  return 0;
}

function askQuestion(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (current.startsWith("--")) {
      const [key, rawVal] = current.slice(2).split("=");
      if (rawVal !== undefined) {
        out[key] = rawVal;
      } else {
        const next = argv[i + 1];
        if (next && !next.startsWith("-")) {
          out[key] = next;
          i += 1;
        } else {
          out[key] = true;
        }
      }
    } else if (current.startsWith("-")) {
      const key = current.slice(1);
      const next = argv[i + 1];
      if (next && !next.startsWith("-")) {
        out[key] = next;
        i += 1;
      } else {
        out[key] = true;
      }
    }
  }
  return out;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function log(message) {
  console.log(message);
}
