# Approved GitHub issue label colours

**Status:** Approved for the OHealth+ dashboard repository on **27 October 2026**.

These are the team's default colours for the existing GitHub labels used in [Issue #55](https://github.com/Maka-Integrated-Technology/ohealth-dashboard/issues/55), [Issue #56](https://github.com/Maka-Integrated-Technology/ohealth-dashboard/issues/56), and [Issue #57](https://github.com/Maka-Integrated-Technology/ohealth-dashboard/issues/57). Labels retain their original names, so current issues and filters keep working.

| Label | Colour | GitHub hex | Intended use |
| --- | --- | --- | --- |
| `frontend` | Blue | `#2563EB` | Frontend development and integration |
| `ui` | Purple | `#9333EA` | Layout, Figma matching, styling and design work |
| `deployment` | Orange | `#EA580C` | Hosting, release preparation and Cloudflare previews |
| `qa` | Yellow | `#EAB308` | Quality assurance, tests and sign-off |
| `pharmacy` | Green | `#16A34A` | Pharmacy portal scope |
| `medical-professional` | Teal | `#0D9488` | Medical Professional portal scope |
| `bug` | Red | `#D73A4A` | Defects and regressions; preserves GitHub's original red |

## Source of truth and application

The machine-readable source of truth is [`.github/issue-label-colors.json`](../.github/issue-label-colors.json). It records the approved values and short label descriptions.

[`sync-issue-label-colors.yml`](../.github/workflows/sync-issue-label-colors.yml) applies the palette **to existing GitHub labels**, using the repository's scoped GitHub Actions token. The workflow runs when the approved palette or the workflow itself is pushed to `dev`, and can be re-run manually with `workflow_dispatch`.

The workflow does **not** create or remove labels, alter issue priorities, edit issue bodies, or touch production infrastructure. Missing expected labels cause a visible failed run rather than silently creating unrelated labels.

## Rules for future tickets

- Use **one dashboard/surface label** plus the relevant type-of-work labels. Multiple labels on the same issue are fine.
- Use the actual GitHub **Priority** field (e.g., High or Urgent) rather than inventing duplicate priority labels.
- Update both this document and the JSON source of truth when the team approves a new label or a colour change. Changes are reviewed through a PR to `dev`.
- Dark/light appearance of GitHub label text is handled automatically by GitHub; these hexadecimal values define the label background.

**Verification:** After the sync workflow succeeds, inspect the colours on the repository's GitHub Labels page and on Issues #55–#57.
