# Laboratory portal review and validation

Laboratory PR #49 covers the login and onboarding preview, dashboard overview,
bookings, samples and tests, results, external results, test catalogue,
notifications, reports/analytics, compliance/audit, profile settings and
staff/permissions administration.

## URL-driven navigation and filters

Each laboratory section has a dedicated route in `app/routes/lb-dashboard/`.
The sidebar uses React Router links; mobile navigation uses the same destinations.
Search in the header and the section lists now shares a URL-backed `?q=`
parameter rather than maintaining contradictory local input states.
Where applicable, tabs and filters use `?tab=`, `?status=`, `?category=`,
`?source=` and `?period=`. Defaults are removed from the URL; unrelated
parameters are preserved. Refreshing and opening shareable URLs re-applies
those filters. The profile, compliance and results tabs also use URL state.
Header search is disabled on screens where it has no search function.

## Test coverage

Run:

```bash
npm run test:lab
npm run test:lab:ui
npm run test:audit-policy
npm run audit:dependencies
npm run format:check
npm run lint -- --max-warnings=0
npm run typecheck
npm run build:lb
```

Node-based behavior tests cover URL search/filter logic, invalid and default
parameters, staff filtering/duplicate emails/preview-only updates, catalogue
updates, booking transitions, results publishing transitions, notification
read-state helpers, onboarding progression and password rule validation.
Five additional React Testing Library/JSDOM component tests render the actual
onboarding, catalogue, staff, bookings and result-publishing screens and
exercise their buttons, dialogs, form submission and local-state changes.
Both the normal CI and hardened Laboratory Preview workflow run both lab
suites. These rendered tests do not replace cross-browser Playwright or
manual keyboard/visual QA.

The permanent Laboratory Preview workflow uses SHA-pinned checkout and
setup-node actions, does not persist checkout credentials, and runs the
repository supply-chain scan and its adversarial tests **before** installing
dependencies. The standalone lockfile/formatter validation workflow was
temporary and is removed before review.

## Security and privacy constraints

All staff changes, notifications, results, compliance actions, onboarding and
bookings are **preview-only** and are never written to a clinical system.
The UI is not a production identity, permissions or medical record management
service. It does not send real mail, change backend RBAC, publish real test
results, download actual documents, or expose patient data via a live API.

Package versions and lockfile incorporate the dependency remediation already
validated on the hospital branch. The security audit policy is unchanged;
new advisories must be remediated, not suppressed.

## Remaining manual checks before deployment

- Cross-browser end-to-end automation for keyboard/focus interactions,
  URL back/forward and real browser navigation (component tests are not
  a full end-to-end guarantee)
- Visual screenshot comparison at desktop/tablet/mobile breakpoints
- Review historical dates and fictional/sample patient data against approved
  training/preview content
- Integrate real APIs, secure auth and server-side permission checks under
  a separate, reviewed production implementation

No production deployment is performed by the PR review work.

The unrelated external Cloudflare Pages check for `ohealth-hospital-preview`
must be scoped by its project owner so hospital preview builds do not block
laboratory-only changes. This PR does not modify Cloudflare project settings.
