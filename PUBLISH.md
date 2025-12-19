# Publishing packages/webuntis-api

This project publishes `packages/webuntis-api` to the GitHub npm registry with release channels (`latest`, `beta`, `canary`). Use the release helper script plus the steps below.

## 1) One-time registry setup

- Create a PAT with `write:packages` (and `read:packages` for installs) and export `NODE_AUTH_TOKEN` when publishing.
- Add `.npmrc` (repo root or user-level) with:
  ```
  @0m4r:registry=https://npm.pkg.github.com
  always-auth=true
  //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
  ```
- Ensure the package name is correctly scoped for GitHub Packages (e.g. `@0m4r/webuntis-api` in `packages/webuntis-api/package.json`).

## 2) Build & verify

- `yarn build` (runs `nx run webuntis-api:build` with prebuild step).
- `yarn test` to validate before publishing.
- Optional: `cd packages/webuntis-api && npm pack` to inspect the tarball.

## 3) Release channels and versioning

- `latest`: stable releases (e.g. `3.1.0`).
- `beta`: prerelease testing (e.g. `3.1.0-beta.1`).
- `canary`: bleeding-edge prereleases (e.g. `3.1.0-canary.0`).
- The npm `--tag` flag controls which dist-tag is updated; the script handles this for you.

## 4) Use the release helper (defaults to dry-run)

- Dry-run preview (no commands executed):
  ```
  node scripts/release-webuntis-api.js --version 3.1.0-beta.1 --channel beta
  ```
- Execute publish and create git tag:
  ```
  NODE_AUTH_TOKEN=... node scripts/release-webuntis-api.js --version 3.1.0-beta.1 --channel beta --execute --push-tag
  ```
- Flags:
  - `--version`: required; must match the version in `packages/webuntis-api/package.json`.
  - `--channel`: `latest` | `beta` | `canary` (default `latest`).
  - `--execute`: run commands instead of printing them.
  - `--push-tag`: pushes the git tag after creation.
  - `--allow-dirty`: bypasses the clean working tree check (not recommended).
  - `--registry`: override registry URL (defaults to `https://npm.pkg.github.com`).

What the script does (when `--execute` is set):

1. Ensures a clean git tree (unless `--allow-dirty`).
2. Warns if the supplied version differs from package.json.
3. Creates git tag `<package-name>@<version>` and optionally pushes it.
4. Runs `npm publish --tag <channel> --registry=<registry>` from `packages/webuntis-api`.

## 5) Post-publish checks

- Verify install from GitHub Packages in a clean project:
  ```
  npm install @0m4r/webuntis-api --registry=https://npm.pkg.github.com
  ```
- Confirm the dist-tag points to the expected version:
  ```
  npm dist-tag ls @0m4r/webuntis-api --registry=https://npm.pkg.github.com
  ```
