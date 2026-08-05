# Progress

Snapshot of what's built, what's mocked, and what's still ahead. Update this
file as work lands — it's meant to be the quick "where are we" reference
rather than a full changelog.

## Status by dashboard

| Surface                               | Status                   | Notes                                        |
| ------------------------------------- | ------------------------ | -------------------------------------------- |
| Medical Professional (`mp-dashboard`) | 🟢 In active development | Main dashboard page is built out; see below. |
| Pharmacy (`ph-dashboard`)             | ⚪ Scaffolded only       | Route + layout exist, no page content yet.   |
| Laboratory (`lb-dashboard`)           | ⚪ Scaffolded only       | Route + layout exist, no page content yet.   |

## Medical Professional dashboard — what's built

- **Next Appointment card** — patient identity, Age/Sex/Last
  Appointment/Date Registered, Join Consultation action, mailto link. Has its
  own loading skeleton, empty state, and error state.
- **Today's Appointments**, **Upcoming Appointments**, **Appointment
  Requests** (accept/reject), **Stats Cards**, **Activity Feed**, **Header**
  — all wired to TanStack Query hooks in `app/features/appointments/`, each
  with its own skeleton/empty/error states.
- Accept/reject on a request invalidates the requests and upcoming-appointments
  queries so the lists stay in sync without a manual refetch.

## Backend integration

There is no real backend wired up yet. All `/api/appointments/*` calls are
served locally by **MSW** (`app/mocks/handlers/appointments.ts`), which starts
automatically in dev (`app/entry.client.tsx`). This lets the UI, loading
states, and empty/error states be built and demoed end-to-end before the real
API exists.

Mock endpoints now include an artificial ~700ms delay (`MOCK_NETWORK_DELAY_MS`
in `app/mocks/handlers/appointments.ts`) so skeleton loaders are actually
visible locally instead of resolving instantly — this mirrors what a real
network round-trip will look like.

Switching to the real API later is a one-line change: set `VITE_API_BASE_URL`
in `.env.local` and the mocks stop being needed (MSW only runs in `DEV`
builds regardless).

## Recent fixes

- Widened the gap between the patient identity block and the Age/Sex info
  grid on the Next Appointment card to match design.
- Added mock network delay (above) so skeleton loading states are visible
  during local development.

## Known gaps / next up

- Pharmacy and Laboratory dashboards have no page content yet — only the
  route scaffolding.
- No real backend integration yet; everything runs against MSW mocks.
