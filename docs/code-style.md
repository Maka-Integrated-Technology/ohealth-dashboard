# Code Style & Conventions

## TypeScript

- Strict mode is enabled — no `any`, no implicit `any`, no unchecked index
  access.
- Use `type` for object shapes and union types. Use `interface` only when
  declaration merging is needed.
- Prefer `import type` for type-only imports (`verbatimModuleSyntax` enforces
  this).
- Use the `~/*` path alias for all imports from `app/` — no relative `../../`
  climbs.

## Linting

ESLint is configured with flat config (`eslint.config.js`). It enforces:

- TypeScript rules via `typescript-eslint` (recommended + strict)
- React and JSX rules via `eslint-plugin-react` (with JSX runtime support)
- React Hooks rules via `eslint-plugin-react-hooks`
- Vite fast-refresh rules via `eslint-plugin-react-refresh`

Run after code changes:

```bash
npm run lint        # report all issues
npm run lint:fix    # apply safe automatic fixes, then resolve the rest manually
```

Agents should run `npm run lint` after every code change and use `npm run lint:fix`
for safe automatic corrections before manually resolving any remaining errors.

## Formatting

Prettier runs with `prettier-plugin-tailwindcss`. Run `npm run format` before
committing. Do not configure editor-level formatters separately — let Prettier
own all formatting decisions.

Tailwind class names are sorted automatically by the plugin. Do not sort them
by hand.

CI enforces formatting with `npm run format:check` and linting with
`npm run lint`. Both must pass before a pull request can be merged.

## Naming

| Thing                         | Convention                |
| ----------------------------- | ------------------------- |
| Files and directories         | `kebab-case`              |
| React components              | `PascalCase`              |
| Hooks                         | `camelCase`, `use` prefix |
| Constants                     | `SCREAMING_SNAKE_CASE`    |
| Types and interfaces          | `PascalCase`              |
| Non-exported helper functions | `camelCase`               |

## Components

Keep route files (`page.tsx`) thin. Extract logical sections into
`_sections/<SectionName>.tsx` files alongside the page. A page file should
read as an outline of what it renders, not an implementation.

```
routes/main/settings/
  page.tsx
  _sections/
    ProfileForm.tsx
    PreferencesPanel.tsx
```

Props that a component needs from its parent should be explicit typed props.
Never read from a global store or context inside a component that could instead
receive a value as a prop — keep the dependency visible.

## Data fetching

- Never call `axios` directly from a component or a page.
- Feature hooks (`app/features/<domain>/hooks.ts`) own all `useQuery` and
  `useMutation` calls.
- Destructure mutations with domain-readable names at the call site:

  ```ts
  const { mutate: createItem, isPending: isCreating } = useCreateItem();
  ```

- Use `QUERY_KEYS` from `app/lib/utils/query-keys.ts` for every `queryKey`.
  Never inline raw string arrays.

## URL search params

Use URL search params as the source of truth for list page state — active
filters, search term, current page. Do not mirror this state into `useState`.
Use `useCustomSearchParams` to read and `useSearchParams` (from React Router)
to write.

Debounce search input with `useDebouncedCallback` before updating the URL.
Track user intent in a `ref` so the input feels instant:

```ts
const searchIntentRef = useRef(initialSearch);
const debouncedSetSearch = useDebouncedCallback((value: string) => {
  setSearchParams(...);
}, 400);
```

## Forms

Use Formik for forms with validation. Define schemas with Yup. Extract shared
field components (`<EmailField />`, `<PasswordField />`) when the same field
appears in more than one form.

## Theming and color

Use semantic CSS custom property tokens (e.g. `bg-primary`, `text-muted-foreground`)
rather than raw Tailwind palette values (e.g. `bg-indigo-600`). Semantic tokens
automatically adapt to light and dark mode.

Only reach for raw palette values when building a one-off decorative element
that intentionally does not respond to the theme.

## Comments

- Do not add section divider comments, for example `// ─── Section name ───`.
- Do not add comments that restate what the code already shows.
- Do not add comments that label groups of functions, such as "Direct backend
  calls" or "Helper functions".
- Only add comments for non-obvious business logic, edge cases, or external
  constraints.
- JSDoc on public APIs is acceptable when it adds real detail such as params,
  return shape, or side effects.
- Skip JSDoc when it only repeats the function name or obvious behavior.
