# WebUntis API (monorepo)

This Nx monorepo hosts the `webuntis-api` library, examples, and docs. It is a Node.js wrapper for the WebUntis JSON RPC API.

- [Online docs](_media/index.html)
- Upstream inspiration: built on top of the work in [SchoolUtils/WebUntis](https://github.com/SchoolUtils/WebUntis).

In case you need the official Untis API spec (PDF), you must request it directly from Untis. It cannot be redistributed here.

## Monorepo layout

- `packages/webuntis-api` — core library source, Rollup build, Jest tests.
  - Build: `yarn nx run webuntis-api:build`
  - Test: `yarn nx run webuntis-api:test`
- `apps/examples` — TypeScript usage demos; bundle with `yarn nx run examples:build`.
- `apps/docs` — generated API reference (Typedoc) output.

Shared tooling lives at the workspace root. If Nx shows stale project graph errors, run `NX_DAEMON=false nx reset`.

## Install (library consumers)

```bash
yarn add webuntis-api
# or
npm i webuntis-api
# or
pnpm i webuntis-api
```

The package ships CJS and ESM builds. Primary target is Node.js; browser support is not guaranteed.

## Examples

### User/Password Login

```javascript
import { WebUntis } from "webuntis-api";

const untis = new WebUntis("school", "username", "password", "school.webuntis.com");

await untis.login();
const timetable = await untis.getOwnTimetableForToday();

// profit
```

### QR Code Login

```javascript
import { WebUntisQR } from "webuntis-api";
import { URL } from "url";
import { authenticator as Authenticator } from "otplib";

// The result of the scanned QR Code
const QRCodeData = "untis://setschool?url=[...]&school=[...]&user=[...]&key=[...]&schoolNumber=[...]";

const untis = new WebUntisQR(QRCodeData, "custom-identity", Authenticator, URL);

await untis.login();
const timetable = await untis.getOwnTimetableForToday();

// profit
```

### User/Secret Login

```javascript
import { WebUntisSecretAuth } from "webuntis-api";
import { authenticator as Authenticator } from "otplib";

const secret = "NL04FGY4FSY5";

const untis = new WebUntisSecretAuth(
  "school",
  "username",
  secret,
  "school.webuntis.com",
  "custom-identity",
  Authenticator,
);

await untis.login();
const timetable = await untis.getOwnTimetableForToday();

// profit
```

### Anonymous Login

Only if your school supports public access.

```javascript
import { WebUntisAnonymousAuth, WebUntisElementType } from "webuntis-api";

const untis = new WebUntisAnonymousAuth("school", "school.webuntis.com");

await untis.login();
const classes = await untis.getClasses();
const timetable = await untis.getTimetableForToday(classes[0].id, WebUntisElementType.CLASS);

// profit
```

### ESM note:

If you use the esm version of this package, you need to provide `Authenticator` and `URL` if necessary. For more information, look at the `User/Secret Login` or `QR Code Login` example. This is not needed for `username/password` or `anonymous` login.

### Notice

I am not affiliated with Untis GmbH. Use this at your own risk.
