# Dependency Modernization & Config Consolidation Plan

_Last updated: 2026-07-05_

This plan covers two workstreams:

1. **Dependencies** — review both `package-lock.json` files, then upgrade every dependency to a current, non-deprecated version with no known vulnerabilities.
2. **Config** — move all important configuration into `config.json` (frontend) or `aws-config.json` (backend) as appropriate, so nothing sensitive or environment-specific is hardcoded in source.

The project has **two** independent Node packages, each with its own lockfile:

- **Frontend** — `/package.json` + `/package-lock.json` (Create React App / `react-scripts`).
- **Backend API** — `/api/package.json` + `/api/package-lock.json` (Express server).

Both must be handled.

---

## Guiding principles

- **One major version at a time.** Several of these are multi-major jumps with breaking API changes (React, Amplify, react-router, AWS SDK). Bumping them all blindly will break the build. Upgrade, verify, commit; repeat.
- **Branch per workstream.** Do this on a feature branch, not `master`.
- **Verify after every meaningful step** — `npm run build` (frontend), start the API and hit an endpoint (backend), and click through the app.
- **Lockfile is the source of truth for what's actually installed.** Update `package.json` ranges *and* regenerate the lockfile (`npm install`), then re-run `npm audit`.

---

## Part 1 — Dependency audit & upgrade

### Step 1.1 — Baseline the current state

For each package (root and `/api`):

```bash
# root
npm ci            # install exactly what the lockfile pins
npm audit         # record current vulnerabilities
npm outdated      # record how far behind each dep is

# api
cd api
npm ci
npm audit
npm outdated
```

Save the `npm audit` and `npm outdated` output as the "before" snapshot so progress is measurable.

### Step 1.2 — Frontend dependency targets (`/package.json`)

Current versions are from ~2019 and carry the bulk of the vulnerability surface (almost all of it flows through the very old `react-scripts` toolchain).

| Package | Current | Target | Notes / breaking changes |
|---|---|---|---|
| `react-scripts` | `3.0.1` | `5.0.1` (or migrate to **Vite**) | Biggest single source of deprecated/vulnerable transitive deps. CRA is effectively unmaintained — **strongly consider migrating to Vite** instead of upgrading CRA. See Step 1.4. |
| `react` | `16.8.6` | `18.x` (or `19.x`) | React 18 changes the root API (`createRoot` in `src/index.js`). React 19 has further changes; 18 is the safer first stop. |
| `react-dom` | `16.8.6` | match `react` | Update `ReactDOM.render` → `createRoot(...).render` in `src/index.js`. |
| `aws-amplify` | `1.1.29` | `6.x` | **Major breaking API change.** `Amplify.configure(...)` shape changed; `Auth` moved to `aws-amplify/auth` modular imports. Affects `src/index.js` and every component that calls `Auth`. Largest single migration in this list. |
| `react-router-dom` | `5.0.1` | `6.x` (or `7.x`) | Breaking: `Switch` → `Routes`, `component=`/`render=` → `element=`, hooks changes. Audit all router usage. |
| `bootstrap` | `4.3.1` | `5.x` | Breaking CSS/JS: dropped jQuery, renamed utility classes (`ml-`/`mr-` → `ms-`/`me-`, etc.). Audit markup/classNames. |
| `react-datepicker` | `2.7.0` | latest `8.x` | Props and styling changed across majors; check `react-datepicker-override.css`. |
| `react-overlays` | `1.2.0` | latest `5.x` | API changed significantly; confirm it's still used, drop if not. |
| `styled-components` | `4.3.1` | `6.x` | Mostly compatible; check for deprecated APIs and SSR/babel-plugin usage. |
| `uuid` | `3.3.2` | `11.x` | Import style changed: `import { v4 as uuidv4 } from 'uuid'`. Update call sites. |

### Step 1.3 — Backend API dependency targets (`/api/package.json`)

| Package | Current | Target | Notes / breaking changes |
|---|---|---|---|
| `aws-sdk` | `2.488.0` | **`@aws-sdk/client-dynamodb` v3** | AWS SDK v2 is in maintenance mode. v3 is modular + promise-native. `aws.config.update(...)` and `new aws.DynamoDB(...)` in `api/index.js` must be rewritten. Alternatively bump v2 to latest `2.x` as a low-effort interim, but v3 is the real fix. |
| `express` | `4.17.1` | `4.21.x` (latest 4) or `5.x` | 4.x latest is a safe upgrade; 5.x is breaking. Recommend latest 4.x first. |
| `body-parser` | `1.19.0` | **remove** | `express.json()` / `express.urlencoded()` are built into modern Express. Drop the dependency and use the built-ins in `api/index.js`. |
| `helmet` | `3.18.0` | `8.x` | Defaults changed across majors; re-verify CSP/header config after upgrade. |
| `jsonwebtoken` | `8.5.1` | `9.x` | v9 fixes known security issues (CVE) in v8. Verify `verify()` options still valid. |
| `jwk-to-pem` | `2.0.1` | latest `2.x` | Patch/minor security updates. |
| `nodemon` | `1.19.1` | `3.x` | Dev-only; low risk. |
| `cors` | `2.8.5` | latest `2.x` | Minor. |
| `path` | `0.12.7` | **remove** | This is a userland polyfill of Node's built-in `path`. Delete it and rely on the built-in `require('path')`. |

### Step 1.4 — Decision point: CRA upgrade vs. Vite migration

`react-scripts@3` is the root cause of most deprecated/vulnerable transitive packages. Two paths:

- **A) Upgrade to `react-scripts@5`** — lower effort, keeps the CRA workflow, but CRA is unmaintained and will drift out of date again.
- **B) Migrate to Vite** — more upfront work (new dev/build config, `index.html` moves to root, env-var prefix becomes `VITE_`, `src/serviceWorker.js` handling changes), but a modern, maintained, fast toolchain with a clean dependency tree.

**Recommendation:** Do the dependency upgrades on CRA 5 first to get to a green `npm audit`, then evaluate a Vite migration as a separate follow-up if desired. _Confirm this choice before starting — it changes the shape of the rest of the work._

### Step 1.5 — Execute upgrades (order matters)

Suggested sequence, verifying (`npm run build` / API smoke test) and committing after each:

**Frontend**
1. `react-scripts` 3 → 5 (or Vite migration). Get a clean build first.
2. `react` + `react-dom` 16 → 18, update `src/index.js` root API.
3. `react-router-dom` 5 → 6.
4. `bootstrap` 4 → 5 (audit classNames).
5. `react-datepicker`, `react-overlays`, `styled-components`, `uuid` — one at a time.
6. `aws-amplify` 1 → 6 **last**, since it touches auth across the whole app.

**Backend**
1. Remove `path` and `body-parser`; switch to built-ins.
2. `jsonwebtoken` 8 → 9, `helmet` 3 → 8, `express` → latest 4, `nodemon`, `cors`, `jwk-to-pem`.
3. `aws-sdk` v2 → `@aws-sdk/client-dynamodb` v3, rewrite DynamoDB calls in `api/index.js`.

### Step 1.6 — Close out

```bash
# both packages
npm audit --production      # target: 0 known vulnerabilities
npm audit fix               # only for anything safe/remaining
npm outdated                # confirm nothing left deprecated
```

- Regenerate and commit both `package-lock.json` files.
- Confirm `npm run build` (frontend) and the API server both start clean.
- Document any dependency intentionally left back-level and why.

---

## Part 2 — Config consolidation

### Current state

Config is **already partially externalized**, but not fully consolidated, and one file references the other across package boundaries.

- **Frontend:** `src/index.js` and components import `from './config'`, which resolves to `src/config.json` (gitignored). The committed template is `src/config-model.json` and holds:
  - `cognito.REGION`, `cognito.USER_POOL_ID`, `cognito.APP_CLIENT_ID`
  - `cognito-pub-keys` (JWKS)
  - `dynamo.TABLE`
- **Backend:** `api/index.js` imports **both** `../src/config` (reaching into the frontend tree) **and** `./aws-config.json` (gitignored; template `api/aws-config-model.json`) which holds `region`, `endpoint`, `table`, `accessKeyId`, `secretAccessKey`.
- Both `config.json` and `aws-config.json` are correctly listed in `.gitignore`.

### Problems to fix

1. **Cross-package import** — the backend reaches into `../src/config` (frontend source) for `dynamo.TABLE` and `cognito-pub-keys`. Backend config should live entirely in `api/aws-config.json`.
2. **Duplicated / derivable values** — `region` appears in both files; `endpoint` (`https://dynamodb.${region}.amazonaws.com`) and `table` duplicate what's in the frontend config. Pick one authoritative home per concern.
3. **Any remaining hardcoded config** — audit source for literal regions, table names, endpoints, URLs, or IDs and move them into the appropriate JSON file.
4. **Long-lived AWS keys in `aws-config.json`** — `accessKeyId`/`secretAccessKey` are static credentials. Keep them out of source (already gitignored), but prefer an IAM role / instance profile / environment variables in deployed environments. Note this as a security follow-up (see Part 3).

### Target layout

- **`src/config.json`** = **frontend-only** config (what the browser bundle legitimately needs):
  - `cognito.REGION`, `cognito.USER_POOL_ID`, `cognito.APP_CLIENT_ID`
  - _(Note: anything in the frontend config.json ships to the browser — it must contain **only** non-secret, publishable values. Cognito pool/client IDs are fine; secrets are not.)_
- **`api/aws-config.json`** = **backend-only** config and secrets:
  - `region`, `endpoint` (or derive from region at runtime), `table`
  - `accessKeyId`, `secretAccessKey` (or IAM role — see Part 3)
  - `cognito` values the API needs to verify JWTs (`REGION`, `USER_POOL_ID`) and/or the `cognito-pub-keys` JWKS
- Keep both `*-model.json` templates in sync with the real shape so a fresh clone can be configured. (Also fix the invalid JSON in the current `src/config-model.json` — it uses `/* ... */` comments and is missing a comma, so it can't be parsed as-is; make the template valid JSON with placeholder string values.)

### Steps

1. **Inventory** every config value read in `src/` and `api/` (grep for `config.`, `awsConfig`, regions, table names, endpoints, URLs, IDs).
2. **Assign each value a single home** — frontend → `src/config.json`, backend → `api/aws-config.json` — per the target layout above.
3. **Remove the cross-package import** in `api/index.js`: replace `require('../src/config')` usages with values from `api/aws-config.json`.
4. **Move any hardcoded config** found in step 1 into the correct JSON file and read it from there.
5. **Update both `-model.json` templates** to match, using valid JSON with clearly-labeled placeholder values, and make sure `README.md` / `NEW_SERVER_SETUP.md` document how to create the real files from the templates.
6. **Confirm `.gitignore`** still excludes `config.json` and `aws-config.json` (it does) and that neither real file is tracked (`git ls-files | grep -E 'config.json|aws-config.json'` should return nothing but the `-model` templates).

---

## Part 3 — Security follow-ups (recommended, out of scope for the mechanical upgrade)

- Replace static `accessKeyId`/`secretAccessKey` in `aws-config.json` with an **IAM role / instance profile** (EC2/ECS) or environment variables, so no long-lived keys sit on disk.
- After upgrades, re-run `npm audit` in CI so regressions are caught automatically.
- Consider `.env` files (already gitignored) for the frontend as an alternative to `config.json` if migrating to Vite (`VITE_`-prefixed vars).

---

## Verification checklist

- [ ] `npm audit` reports **0 known vulnerabilities** in both root and `/api`.
- [ ] `npm outdated` shows no deprecated/unmaintained packages left (or each exception is documented).
- [ ] `npm run build` succeeds for the frontend.
- [ ] API server starts and DynamoDB + JWT auth endpoints work end-to-end.
- [ ] App runs and core flows (login, itinerary CRUD) work in the browser.
- [ ] No config value is hardcoded in source — all live in `src/config.json` or `api/aws-config.json`.
- [ ] `api/index.js` no longer imports `../src/config`.
- [ ] Both `-model.json` templates are valid JSON and match the real file shapes.
- [ ] Neither real config file is tracked by git.
- [ ] Both `package-lock.json` files regenerated and committed.
