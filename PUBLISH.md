# Publishing packages/webuntis-api

This project publishes `packages/webuntis-api` to the GitHub npm registry with release channels (`latest`, `beta`, `canary`). Use Nx release commands for versioning and publishing.

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
- Optional: `cd packages/webuntis-api && yarn npm pack` to inspect the tarball.

## 3) Release channels and versioning (Nx)

- Versions are kept in sync (fixed) across `packages/*` via Nx release.
- `yarn release:dry` runs `nx release version --dry-run` to preview the bump.
- `yarn release` runs `nx release version` to bump/tag/commit (per `nx.json`).
- `yarn release:publish:dry` runs `nx release publish --dry-run` to preview publish.
- `yarn release:publish` runs `nx release publish` (uses registry/tag from `nx.json` targetDefaults).

Channels/dist-tags:

- Default tag is `latest` (configured in `nx.json` targetDefaults for `nx-release-publish`).
- Override with `nx release publish --tag beta` (or other tag).

## 5) Post-publish checks

- Verify install from GitHub Packages in a clean project (using Yarn):
  ```
  yarn add @0m4r/webuntis-api --registry=https://npm.pkg.github.com
  ```
- Confirm the dist-tag points to the expected version:
  ```
  yarn npm info @0m4r/webuntis-api --registry=https://npm.pkg.github.com
  ```
