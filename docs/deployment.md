# Deployment

The app is deployed to an AWS EC2 instance over SSH. Each environment runs **all
three dashboard surfaces** as separate Docker containers on one host, each built
with its own `VITE_ROUTE` and published on its own port. Put a reverse proxy in
front to map each container to a subdomain (e.g. `mp.`/`ph.`/`lb.<domain>`).

## Environments and branches

| Environment | Branch    | Server directory              | Compose project      |
| ----------- | --------- | ----------------------------- | -------------------- |
| Staging     | `staging` | `/var/www/ohealth/fe/staging` | `ohealth-fe-staging` |
| Production  | `prod`    | `/var/www/ohealth/fe/prod`    | `ohealth-fe-prod`    |

A push to `staging` deploys staging; a push to `prod` deploys production.
Nothing else triggers a deploy. (Pull requests still run `ci.yml` against
`main` — see [setup.md](./setup.md#ci).)

## Workflow

`.github/workflows/deploy.yml` runs on `push` to `staging` or `prod`. The two
jobs are guarded by `github.ref`, so only the matching environment deploys. A
`concurrency` group keyed on the branch prevents overlapping deploys of the same
environment (`cancel-in-progress: false` lets an in-flight deploy finish).

Each job SSHes into the server (via `appleboy/ssh-action`) and runs:

```bash
cd /var/www/ohealth/fe/<env>
git pull origin <branch>
docker compose -p ohealth-fe-<env> --env-file .env.prod -f docker-compose.prod.yml up -d --build
docker image prune -f
```

One `up` builds and (re)starts all three services
(`mp-dashboard`, `ph-dashboard`, `lb-dashboard`) defined in
`docker-compose.prod.yml`. `--build` rebuilds each image on every deploy (so new
`VITE_*` values are inlined — each surface is a separate image because its
`VITE_ROUTE` build arg differs), `-d` runs detached, and `docker image prune -f`
removes the now-dangling previous images.

By default the containers publish to host ports **3000** (mp), **3001** (ph), and
**3002** (lb); override with `MP_PORT` / `PH_PORT` / `LB_PORT` in `.env.prod`.

## Required GitHub secrets

Set these in **Settings → Secrets and variables → Actions**:

| Secret           | Description                                         |
| ---------------- | --------------------------------------------------- |
| `SERVER_HOST`    | Server hostname or IP.                              |
| `SERVER_USER`    | SSH user with access to `/var/www/ohealth/fe/…`.    |
| `SERVER_SSH_KEY` | Private SSH key for that user (PEM, no passphrase). |

## Server-side setup (one-time per environment)

1. Clone the repo into the environment directory and check out its branch:

   ```bash
   git clone <repo-url> /var/www/ohealth/fe/staging
   cd /var/www/ohealth/fe/staging && git checkout staging
   ```

2. Create the `.env.prod` file (it is **not** committed — `.env.*` is
   git-ignored). It supplies the shared API URL and, optionally, the host ports:

   ```dotenv
   # /var/www/ohealth/fe/staging/.env.prod
   VITE_API_BASE_URL=https://staging-api.ohealth.example.com

   # Host ports (optional — these are the defaults)
   MP_PORT=3000
   PH_PORT=3001
   LB_PORT=3002
   ```

   `VITE_ROUTE` is **not** set here — each service in `docker-compose.prod.yml`
   hardcodes its own. Give production its own `.env.prod` with production values.

3. Ensure Docker + Docker Compose are installed and the SSH user can run them.

4. (Recommended) Put a reverse proxy (nginx / Caddy / an AWS ALB) in front and
   route each subdomain to the matching container port — e.g.
   `mp.<domain>` → `:3000`, `ph.<domain>` → `:3001`, `lb.<domain>` → `:3002`.

After that, deploys are automatic on push.

## How the build gets its config

`VITE_API_BASE_URL` and `VITE_ROUTE` are **build-time** values — Vite inlines
them into the client bundle. In `docker-compose.prod.yml`, `VITE_API_BASE_URL`
comes from the `--env-file` and `VITE_ROUTE` is fixed per service; both are
passed as build args, which the `Dockerfile` promotes to `ENV` before
`npm run build`. Changing an env value therefore requires a rebuild (the workflow
always passes `--build`). All three surfaces point at the same `VITE_API_BASE_URL`.

## Scaling to a subset of surfaces

To deploy only some dashboards, pass the service names explicitly, e.g.
`docker compose … up -d --build mp-dashboard ph-dashboard`. To split surfaces
across separate hosts, give each host its own directory, `.env.prod`, and
Compose project name (`-p`).
