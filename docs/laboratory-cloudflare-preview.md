# OHealth+ Laboratory Portal — Cloudflare Preview

The laboratory portal is developed on the isolated Git branch `feat/laboratory-auth-cloudflare-preview` (branched from `dev`). This branch must not be merged into `dev` without review, and it must not replace the existing medical-professional, pharmacy or hospital deployments.

## Cloudflare Pages preview

For a **separate Cloudflare Pages project** connected to this GitHub repository, configure:

| Setting                   | Value                                          |
| ------------------------- | ---------------------------------------------- |
| Repository                | `Maka-Integrated-Technology/ohealth-dashboard` |
| Preview / selected branch | `feat/laboratory-auth-cloudflare-preview`      |
| Build command             | `npm run build:lb`                             |
| Build output directory    | `build/client`                                 |
| Framework                 | React / Vite (static SPA)                      |
| Root directory            | repository root                                |
| Runtime requirement       | Node.js 20+                                    |

The `build:lb` script **already exists on `dev`** and runs `cross-env VITE_ROUTE=lb react-router build`. The React Router configuration uses `ssr: false`, so the portal builds as a static single-page application. The lab routes are isolated from the medical-professional and pharmacy route sets.

Select the branch above for a Git preview and verify the Pages preview URL first. **Do not point a custom lab domain to the project or mark this application production-ready until the preview is reviewed and live authentication, API integration, and the security audit have been addressed.** No Cloudflare deployment or domain operation is performed by this PR.

## Local development

```bash
npm ci
npm run dev:lb
```

Open `http://localhost:5102/` for the lab sign-in. For a production-like build:

```bash
npm run build:lb
```

The root route `/` renders the laboratory sign-in screen, **not** the old four-card dashboard placeholder. The laboratory authentication page now directly reuses the hospital authentication page's split-screen layout, blue gradient, typography, form styling, five-step progress display, and shared OHealth+ SVG logo from the existing hospital feature branch. Only the laboratory copy, fields, example figures, and preview actions differ. Registration includes the lab-details, administrator, documents, verification and setup screens in preview state. This stage is intended for visual review and feedback before implementing the actual laboratory dashboard.

## Preview-only warning

- **No authentication API** is connected, no real sign-in session is established and forgotten-password requests send no email.
- Registration, administrative credentials and document selections are only temporary in React component state. No file is uploaded, no application submitted, and no verification or approval occurs.
- The left-side metrics (`12,400+`, `340+`, `99.8%`, `<4h`) are **Figma design copy**, not live laboratory performance data.
- The original Figma artboard: https://www.figma.com/design/GXjleSLcTnSKrfDDxW024Q/OHealth---Copy---Copy---Copy---Copy-?node-id=8003-2132
- Full high-fidelity screenshot comparison is **still pending** due to the Figma MCP Starter plan rate limit. The visual structure and shared logo are copied directly from the hospital authentication implementation, while lab-specific text and fields use the supplied lab Figma node metadata. No pixel-perfect browser comparison has been completed.
- Do not deploy for real users, transmit patient data, or rely on these sign-in controls for access control.
