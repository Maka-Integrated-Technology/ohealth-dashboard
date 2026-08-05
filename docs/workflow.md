# Workflow & Implementation Patterns

Conventions for building routes, components, and features in this codebase.

---

## Route folder structure

### Keep `page.tsx` thin

`page.tsx` is an orchestration file. It should:

- Read and parse URL search params for the route.
- Call route-level API hooks and own top-level mutations.
- Derive computed/summary data.
- Compose the page layout by rendering section components.
- Define shared callbacks (e.g. `clearFilters`) passed to multiple sections.

It should **not** contain inline table columns, dialogs, filter controls, form
sections, or large component definitions. If a route page exceeds a few hundred
lines, split it.

### Suggested folder shape

```
app/routes/<route>/
  page.tsx
  _sections/
    header.tsx
    summary-metrics.tsx
    filters.tsx
    <resource>-grid.tsx
    dialogs.tsx
    forms.tsx
    _primitives.tsx
```

Add only what the route needs.

### File responsibilities

**`page.tsx`** — parses URL params, calls hooks, derives data, composes
layout, defines shared callbacks.

**`_sections/header.tsx`** — page title, description, top-level action
buttons.

**`_sections/summary-metrics.tsx`** — metric cards or summary controls;
receives computed data from `page.tsx`.

**`_sections/filters.tsx`** — search input and filter controls; calls
`useSearchParams` directly to read/write params; receives only data it cannot
derive locally (API-backed option lists, result counts, shared
`onClearFilters`).

**`_sections/<resource>-grid.tsx`** — column definitions, row actions, empty
state, and the data grid; calls `useSearchParams` directly for sort and
pagination; receives data rows, loading/error state, pagination totals.

**`_sections/dialogs.tsx`** — route-specific dialogs, sheets, confirmation
modals, side panels.

**`_sections/forms.tsx`** — route-specific form composition using shared
form-field components.

**`_sections/_primitives.tsx`** — route-specific TypeScript types, URL param
parser/validator functions, constants, tiny route-local display components,
and formatting helpers.

### Shared vs route-local

- Used by one route only → keep in that route's `_sections/`.
- Used by two or more routes → move to `app/components/` or the relevant
  feature folder.
- Do not generalize a component before there is a real second use case.

---

## Route-level table/list state

- URL search params are the **source of truth** for list state: search query,
  filters, sort key, sort direction, current page, and page size. Typical
  params: `?search=`, `?page=`, `?pageSize=`, `?sort=`, `?direction=`, plus
  one param per filter.
- Do not duplicate URL-backed state in parent `useState`. Local state is only
  acceptable for temporary UI behavior — e.g. a debounced search input that
  needs instant typing feedback before the committed value reaches the URL.
- **Reset `page` to `1`** whenever search, any filter, sort key, sort
  direction, or page size changes.
- **Delete default and empty values** from the URL rather than storing them.
  Delete `?status=` when the field is empty; delete `?search=` when the input
  is cleared. Avoid noisy params like `?status=all`.
- Parse URL params defensively in explicit helper functions colocated with the
  route (e.g. in `_primitives.tsx`). Invalid pages fall back to `1`; invalid
  page sizes fall back to the default; invalid enum values fall back to `"all"`.

---

## Search input

- Keep local `inputSearch` state for immediate typing feedback. The committed
  URL value (from `searchParams.get("search")`) is what the API query reads.
- Debounce writes to `?search=` using `useDebouncedCallback` from
  `~/hooks/use-debounce`. 300 ms is the standard delay.
- Track the latest intent in a `useRef` (`searchIntentRef`). The debounced
  callback compares `searchIntentRef.current !== value` and skips stale writes.
- Trim the value before writing to the URL. Delete `?search=` when the trimmed
  value is empty.
- Reset `page` to `1` on every search commit.
- Clear actions must reset both local input and `searchIntentRef` before
  updating the URL to prevent a pending debounce from racing and re-writing a
  stale value.
- When an external action clears the URL param (e.g. an empty-state clear
  button), use a `useEffect` on the committed URL value to reset local state
  and cancel any pending debounce.
- Visual structure: a `Search` icon followed by a borderless `<input>` inside a
  rounded, bordered, background-colored wrapper. Placeholder text names the
  searchable fields for that specific list.

---

## Single-select filters

- Store each value in a dedicated URL param (e.g. `?status=active`).
- Treat the default / unfiltered state as `"all"`. Delete the param rather than
  writing `?status=all`.
- Reset `page` to `1` on every change.
- Validate param values against the allowed list in the parser. Invalid or
  missing values fall back to `"all"`.
- Render as `<Select>` dropdowns with an "All …" option as the first item.
- The filter component should call `useSearchParams` directly. Pass option
  lists as props only when they come from the API.

---

## Multi-select filters

- Store values in URL params using the `f_<key>` convention with
  comma-separated values: `?f_status=active,pending`.
- Parse each `f_<key>` param by splitting on `","` and filtering empty strings.
- Toggle logic: if the value is already in the array, remove it; otherwise
  append. Delete the param when the resulting array is empty.
- Reset `page` to `1` on every toggle.
- Clear-all must delete every `f_<key>` param and reset `page` to `1`.
- Render selected values as removable chips when any multi-select filter is
  active.

---

## Component prop boundaries

- Do not pass URL-backed state values as props unless the child genuinely
  cannot call `useSearchParams` itself.
- Filter and search components should call `useSearchParams` directly to read
  and write their own params.
- The route page passes only: data/computed results, loading/error state, and
  shared callbacks (e.g. `onClearFilters`).
- Shared callbacks are acceptable when the same action is triggered from
  multiple places; define them with `useCallback` in the route page.
- Avoid threading props like `query`, `sortKey`, `page`, `onPageChange`,
  `onStatusChange`, etc. when the child can derive and update those values
  itself.

---

## Forms

### Use Formik

Wrap submitted forms with `<Formik>` or `useFormik`. Do not manage form values
with manual `useState` objects.

**Avoid:**

```tsx
const [form, setForm] = useState({ name: "", email: "" });
<Input value={form.name} onChange={(e) => setForm(...)} />
```

**Prefer:**

```tsx
<Formik
  initialValues={{ name: "", email: "" }}
  validationSchema={validationSchema}
  onSubmit={async (values) => {
    await save(values);
  }}
>
  {({ handleSubmit, isSubmitting }) => (
    <form onSubmit={handleSubmit}>
      <FormField name="name" label="Name" required />
      <Button type="submit" isLoading={isSubmitting}>
        Save
      </Button>
    </form>
  )}
</Formik>
```

Use `enableReinitialize` when external data loads after mount, instead of a
`useEffect` that calls a setter.

### Use Yup validation

Define a `validationSchema` near the component. Put user-facing constraints in
Yup rather than inside submit handlers.

```tsx
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  name: Yup.string().required("Name is required"),
});
```

### Use shared form field components

Pass `name` so Formik connects the field and error message automatically. Do
not hand-roll label + input + error shells.

**Avoid:**

```tsx
<label>
  Email
  <input value={email} onChange={...} />
</label>
{error && <small>{error}</small>}
```

**Prefer:**

```tsx
<FormField name="email" label="Email" type="email" required />
```

### Submit buttons

Use `isSubmitting` from Formik for the submit button's loading state. Pass it
through `Button isLoading`. Do not also pass `disabled={sameLoadingValue}` —
`Button` disables itself when `isLoading` is true.

```tsx
<Button type="submit" isLoading={isSubmitting}>
  Save
</Button>
```

Only add `disabled` for an additional non-loading gate:

```tsx
<Button type="submit" isLoading={isSubmitting} disabled={!requiredFieldsFilled}>
  Save
</Button>
```

### Payload preparation

Trim and transform values inside Formik `onSubmit`. Keep validation in Yup.

### Exceptions

- Table search inputs follow the **Search input** rules above, not Formik.
- Very small one-off controls that are not submitted forms may use local state.

---

## Buttons

- Always use the shared `Button` from `~/components/ui/button`. Do not recreate
  button styles.
- Use existing `variant` and `size` props before adding custom classes.
- Use `isLoading` for async actions. Do not pass `disabled={samePendingValue}`.
- Use `asChild` when wrapping a `<Link>` or other non-button element.

---

## Colors and theming

- Use semantic Tailwind/theme tokens first:
  - `bg-background`, `bg-card`, `bg-muted`, `bg-accent`, `bg-primary`
  - `text-foreground`, `text-muted-foreground`, `text-primary`
  - `border-border`, `border-input`, `ring-ring`
- Do not add raw hex or OKLCH values when a semantic class already covers the
  intent.
- If the same raw color is needed in more than one place, add a token in
  `global.css` instead of duplicating it.
- Only use a raw value when no existing token matches and the usage is
  intentionally isolated.

---

## Cards

- Use `Card` / `CardContent` from `~/components/ui/card`.
- Prefer `bg-card` and `border-border` over hardcoded colors.
- Do not build custom `div` shells when `Card` covers the need.

---

## Mutation hook usage

Destructure mutation hooks at the call site and rename fields to
domain-readable names.

**Avoid:**

```tsx
const mutation = useCreateItem();
mutation.mutate(data);
<Spinner show={mutation.isPending} />;
```

**Prefer:**

```tsx
const { mutateAsync: createItem, isPending: isCreating } = useCreateItem();

async function handleCreate() {
  await createItem(data);
}

<Button isLoading={isCreating} onClick={handleCreate}>
  Create
</Button>;
```

### Rules

- Rename `mutateAsync` / `mutate` to a domain action name: `createItem`,
  `updateUser`, `deleteRecord`.
- Rename `isPending` to a UI-intent name: `isCreating`, `isSaving`,
  `isDeleting`.
- Use `mutateAsync` when the handler needs to `await`, sequence follow-up work,
  or catch errors.
- Use `mutate` only for intentional fire-and-forget calls.
- Do not pass the full mutation object into JSX or child components. Pass only
  the handler function and status booleans.
- Destructure only the fields you actually use.

---

## Implementation checklist for new routes

Before writing new route UI:

1. **Layout** — match the shell, padding, and max-width of the nearest existing
   route.
2. **Colors** — check `app/styles/global.css` before adding any color class.
   Use semantic tokens.
3. **Cards** — use `Card` / `CardContent`. Do not build custom shells.
4. **Forms** — use Formik + Yup. Use shared form-field components. Do not
   hand-roll label/input/error.
5. **Buttons** — use `Button` with the right `variant` and `size`.
6. **Search** — follow the debounced URL-state pattern above.
7. **Route structure** — keep `page.tsx` thin. Put route-specific UI in
   `_sections/` files.
8. **Mutations** — destructure and rename at the call site. Do not pass full
   mutation objects into JSX.
