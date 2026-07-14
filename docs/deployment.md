# Deployment

The app is deployed to an AWS server over SSH. Each environment builds and runs
a single dashboard surface (selected by `VITE_ROUTE`) as a Docker container.

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

`--build` rebuilds the image on every deploy (so new `VITE_*` values are
inlined), `-d` runs detached, and `docker image prune -f` removes the now-dangling
previous image.

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
   git-ignored). This drives the build args in `docker-compose.prod.yml`:

   ```dotenv
   # /var/www/ohealth/fe/staging/.env.prod
   VITE_API_BASE_URL=https://staging-api.ohealth.example.com
   VITE_ROUTE=mp-dashboard      # mp-dashboard | ph-dashboard | lb-dashboard
   PORT=3000                    # host port to expose
   ```

   Give production its own `.env.prod` with production values (and a different
   `PORT` if several surfaces share one host).

3. Ensure Docker + Docker Compose are installed and the SSH user can run them.

After that, deploys are automatic on push.

## How the build gets its config

`VITE_API_BASE_URL` and `VITE_ROUTE` are **build-time** values — Vite inlines
them into the client bundle. `docker-compose.prod.yml` reads them from the
`--env-file` and passes them to the image as build args, which the `Dockerfile`
promotes to `ENV` before `npm run build`. Changing an env value therefore
requires a rebuild (the workflow always passes `--build`).

## Running more than one surface

Each build serves one dashboard. To run several surfaces on one server, give
each its own directory, `.env.prod` (distinct `VITE_ROUTE` and `PORT`), and
Compose project name (`-p`), and put a reverse proxy in front to route by
host/path.
