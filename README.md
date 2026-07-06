# travelator
A web app to simplify trip and itinerary planning

## Project layout
This repo contains two separately-run pieces:
- Root (`/`) — a Vite + React frontend (migrated off Create React App).
- `api/` — an Express API server that talks to AWS Cognito (auth) and DynamoDB (storage).

## Environment / config setup
Neither piece ships with real config, since it contains secrets/account-specific IDs. Each has a `*-model.*` template you copy and fill in:

1. **Frontend config** — copy `src/config-model.json` to `src/config.json` and fill in real values. This file ships to the browser, so it holds **only** non-secret, publishable Cognito identifiers:
   - `cognito.REGION` — AWS region of your Cognito user pool.
   - `cognito.USER_POOL_ID` — Cognito user pool ID.
   - `cognito.APP_CLIENT_ID` — Cognito app client ID.

   Both `src/config-model.json` and the real `src/config.json` are valid JSON. The API server no longer reads this file — backend config lives entirely in `api/aws-config.json` (below).

2. **API AWS config** — copy `api/aws-config-model.json` to `api/aws-config.json` and fill in:
   - `region` — AWS region for DynamoDB.
   - `endpoint` — leave as `https://dynamodb.<region>.amazonaws.com` with your region substituted (optional; the SDK derives it from `region` if omitted).
   - `table` — name of the DynamoDB table storing itineraries.
   - `accessKeyId` / `secretAccessKey` — AWS credentials with DynamoDB access. **Omit both** to use an IAM role / instance profile instead (recommended in deployed environments).
   - `cognito-pub-keys` — paste the JSON from `https://cognito-idp.<region>.amazonaws.com/<USER_POOL_ID>/.well-known/jwks.json`. The API uses these public keys to verify Cognito JWTs.

3. **TLS certificates for the API** — `api/index.js` starts an HTTPS server and hardcodes certificate paths:
   ```
   /etc/letsencrypt/live/api.travelator.pro/privkey.pem
   /etc/letsencrypt/live/api.travelator.pro/fullchain.pem
   /etc/letsencrypt/live/api.travelator.pro/chain.pem
   ```
   These files must exist on the box the API runs on (e.g. via `certbot` for that domain) or the server will fail to start. For local inspection without real certs, you'd need to point these paths at a self-signed cert/key instead, but that also requires the frontend to be pointed at a matching host (see next point).

## Ports
- **Frontend (dev server)**: `3000` by default (Vite, configured in `vite.config.mjs`). Change it there or with `npm run dev -- --port 4000`.
- **API server**: hardcoded to `8080` in `api/index.js` (`httpsServer.listen(8080, ...)`).
- The frontend calls the API at a **hardcoded absolute URL**, not a configurable env var: `https://api.travelator.pro:8080/...` (see `src/components/Body.js` and `src/components/LoadItinerary.js`). To point the frontend at a different API host/port, these URLs must be edited directly in source.

## Build & run

### Frontend
```
npm install
npm run dev       # Vite dev server on port 3000 (see Ports above); `npm start` also works
# or, for a production build:
npm run build     # outputs static assets to build/
npm run preview   # serve the production build locally to sanity-check it
```

### API
```
cd api
npm install
npm start         # runs `nodemon index.js`, HTTPS on port 8080 (see Ports and cert requirements above)
```

## Goals
Allow users to create trip plans, including travel and activities, with details such as cost, scheduling, and custom notes.  Allow users to save a trip plan to file (currently targeting JSON).  Allow users to load a trip plan into the web app from a saved file.

Add a light/dark theme.

## Line item types
Want to include:

### Travel
(e.g. car, taxi, plane, boat, walk, etc)

#### Fields:
Line type title "Travel" | subtype icon | subtype title (e.g. "Air" or "Rental Car", editable if custom) | origin | depart | destination | arrive | cost | move up, move down, remove line buttons

### Lodging
(e.g. hotel, camp, airbnb, friend/fam house, etc)

#### Fields:
Line type title "Lodging" | subtype icon | subtype title (e.g. "hotel" or "camping", editable if custom) | location | arrive date | depart date | cost | move up, move down, remove line buttons

### Activity
(probably custom text)

#### Fields:
Line type title "Activity" | subtype title (always custom, editable) | date | start time | duration | cost | move up, move down, remove line buttons

### Food
(bar, restaurant, take-out, cooking, etc)

#### Fields:
Line type title "Food" | subtype icon | subtype title (e.g. "drinks" or "food", editable if custom) | venue name | date | time | cost(ish) | move up, move down, remove line buttons
