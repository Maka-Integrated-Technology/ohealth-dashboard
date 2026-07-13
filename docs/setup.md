# Setup & Local Development

This guide covers running OHealth Dashboard locally and building it for
production.

## Prerequisites

- **Node.js** 20+ (the Docker image builds on `node:20-alpine`)
- **npm** (the repository ships a `package-lock.json`)

## Install dependencies

```bash
npm install
```

## Environment variables

Copy the example file and fill in the values for your environment:

```bash
cp .env.example .env.local
```

The app reads the following variable (client-side, prefixed with `VITE_`):

| Variable            | Required | Description                                                       |
| ------------------- | -------- | ----------------------------------------------------------------- |
| `VITE_API_BASE_URL` | Yes      | Base URL for all API requests. Read by `app/lib/config/axios.ts`. |

## Development server

```bash
npm run dev
```

The dev server runs on a custom port:

```
http://localhost:5100
```

(The `dev` script passes `-p 5100` to `react-router dev`.)

## Type checking

Generate React Router route types and run the TypeScript compiler:

```bash
npm run typecheck
```

This runs `react-router typegen && tsc`.

## Linting

```bash
npm run lint
```

This runs ESLint across all TypeScript and TSX source files. Run after every
code change before committing.

```bash
npm run lint:fix
```

This runs ESLint with `--fix` to apply safe automatic corrections (import
ordering, unused-var cleanup, etc.). Use this first, then resolve any remaining
errors manually.

## Formatting

```bash
npm run format
```

This runs Prettier (`prettier --write .`) with `prettier-plugin-tailwindcss`,
which also sorts Tailwind class names. See [code-style.md](./code-style.md).

## Production build

```bash
npm run build
```

This runs `react-router build`. Because the app is configured as an SPA
(`ssr: false` in `react-router.config.ts`), the build emits a static client
bundle under `build/client`.

## Serving the production build

```bash
npm run start
```

This serves `build/client` with `npx serve build/client -s`. The `-s` flag
rewrites all paths to `index.html` for client-side routing.

## Docker

The repository includes a multi-stage `Dockerfile` (based on `node:20-alpine`)
that installs dependencies, builds the app, and serves it with `npm run start`.

Build the image:

```bash
docker build -t ohealth-dashboard .
```

Run the container:

```bash
docker run -p 3000:3000 ohealth-dashboard
```

`serve` listens on port `3000` by default — map host `3000` to container `3000`.

> **Note:** `VITE_*` environment variables are inlined into the client bundle
> at build time by Vite. They must be present during `docker build` / `npm run
build`, not only at runtime.

## CI

`.github/workflows/ci.yml` runs on every pull request to `main`. It executes
the same commands you should run locally before pushing:

```bash
npm run format:check   # fails if any file is not Prettier-formatted
npm run lint           # ESLint across all TypeScript/TSX files
npm run typecheck      # React Router typegen + tsc strict
npm run build          # production bundle (build/client)
```

All four must pass before a PR can be merged.

For projects using the [advanced multi-route setup](./architecture.md#advanced-multi-route-setup),
extend the workflow with a build step per route surface.

## Docker Compose

`docker-compose.yml` defines two services:

**Development** (`app-dev`) — mounts source files, enables polling for file
watching, and starts the React Router dev server:

```bash
docker compose up app-dev
```

Available at **http://localhost:5100**.

**Production** (`app-prod`) — builds the final image and serves the static
bundle:

```bash
docker compose up app-prod
```

Available at **http://localhost:3000**.
