# Environment and portal selection

The frontend chooses **one portal per build** using `VITE_ROUTE`. The hospital
frontend is now a supported target alongside the medical professional,
pharmacy, and laboratory targets.

| Portal | Canonical `VITE_ROUTE` | Alias | Local script | Dev port | Production Compose service | Default host port |
| --- | --- | --- | --- | --- | --- | --- |
| Medical professional | `mp-dashboard` | `mp` | `npm run dev:mp` | 5100 | `mp-dashboard` | 3000 |
| Pharmacy | `ph-dashboard` | `ph` | `npm run dev:ph` | 5101 | `ph-dashboard` | 3001 |
| Laboratory | `lb-dashboard` | `lb` | `npm run dev:lb` | 5102 | `lb-dashboard` | 3002 |
| Hospital | `hs-dashboard` | `hs` | `npm run dev:hs` | 5103 | `hs-dashboard` | 3003 |

## Local development

Copy `.env.example` to `.env.local` and set `VITE_ROUTE=hs`, or run
`npm run dev:hs`. Use `npm run build:hs` to build the hospital frontend.
Without `VITE_ROUTE`, the medical professional portal is the default.

`VITE_API_BASE_URL` is an **origin**, not an `/api` prefix. `VITE_ENABLE_MSW`
enables the existing mock service worker in development. `VITE_GOOGLE_CLIENT_ID`
is the OAuth client ID for environments where real authentication is wired
up; the hospital preview screens still do not authenticate or mutate accounts.

## Deployment configuration (not a deployment)

`docker-compose.prod.yml` describes all four independently built frontend
services. Each receives `VITE_API_BASE_URL` as a build arg and fixes its own
`VITE_ROUTE` build arg. In the server-only `.env.prod`, `HS_PORT` optionally
overrides the hospital host port (default `3003`), alongside
`MP_PORT`, `PH_PORT` and `LB_PORT`.

The production Docker Compose configuration is **configuration only**.
Adding the hospital service does not publish it or configure a domain.
Review reverse-proxy/TLS settings, environment secrets and the hospital
preview before authorizing a staging or production deployment.

See [setup](./setup.md), [architecture](./architecture.md) and
[deployment](./deployment.md) for details.
