# WebUntis API (monorepo)

This Nx monorepo hosts the `webuntis-api` library, examples, and docs. It is a Node.js wrapper for the WebUntis JSON RPC API.

- [Online docs](/)
- Upstream inspiration: built on top of the work in [SchoolUtils/WebUntis](https://github.com/SchoolUtils/WebUntis).

## Monorepo layout

- `packages/webuntis-api` — core library source, Rollup build, Jest tests.
  - Build: `yarn nx run webuntis-api:build`
  - Test: `yarn nx run webuntis-api:test`
- `apps/examples` — TypeScript usage demos; bundle with `yarn nx run examples:build`.
- `apps/docusaurus/docs/api` — generated API reference (TypeDoc) output for the docs site.

Shared tooling lives at the workspace root. If Nx shows stale project graph errors, run `NX_DAEMON=false nx reset`.

---

## Notice

There is no affiliation with Untis GmbH. This material is provided without any endorsement or warranty, and its use is entirely at the user’s own risk.

---
