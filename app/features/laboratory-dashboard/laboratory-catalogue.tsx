import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus, Search, X } from "lucide-react";
import { useSearchParams } from "react-router";
import { labListParams, labParam } from "./laboratory-list-state";
import { LaboratoryShell } from "./laboratory-shell";
import {
  CATEGORY_SUMMARY,
  INITIAL_CATALOGUE_TESTS,
  formatCataloguePrice,
  type CatalogueCategory,
  type CatalogueTest,
} from "./laboratory-catalogue-data";

type CatalogueDraft = {
  name: string;
  category: CatalogueCategory;
  price: number;
  turnaround: string;
  active: boolean;
};

const EMPTY_DRAFT: CatalogueDraft = {
  name: "",
  category: "Blood Tests",
  price: 0,
  turnaround: "",
  active: true,
};

function CategoryCard({
  label,
  total,
  active,
  selected,
  onClick,
}: {
  label: string;
  total: number;
  active: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={
        "flex min-h-[80px] w-full flex-col items-start rounded-[15px] border bg-white px-[12px] py-[13px] text-left transition-colors hover:bg-[#f8faff] focus-visible:outline-2 focus-visible:outline-[#155eef] sm:min-h-[83px] sm:px-[13px] sm:py-[15px] " +
        (selected ? "border-[#92b7ff] bg-[#f7faff]" : "border-[#e0e8f2]")
      }
    >
      <span className="text-[18px] leading-[23px] font-semibold text-[#19243a] sm:text-[19px]">
        {total}
      </span>
      <span className="mt-[4px] text-[10px] leading-[13px] text-[#526884] sm:text-[11px] sm:leading-[15px]">
        {label}
      </span>
      <span className="mt-[1px] text-[10px] leading-[13px] text-[#91a5c1] sm:text-[11px] sm:leading-[15px]">
        {active} active
      </span>
    </button>
  );
}

function CategoryBadge({ category }: { category: CatalogueCategory }) {
  return (
    <span className="inline-flex rounded-[8px] bg-[#edf4ff] px-[7px] py-[3px] text-[10px] leading-[14px] font-medium whitespace-nowrap text-[#155eef] sm:text-[11px]">
      {category}
    </span>
  );
}

function TestStatus({ active }: { active: boolean }) {
  return (
    <span
      className={
        "inline-flex items-center gap-[6px] rounded-[8px] px-[9px] py-[4px] text-[10px] leading-[14px] font-medium sm:text-[11px] " +
        (active ? "bg-[#e9faf2] text-[#008a63]" : "bg-[#eef2f7] text-[#50617c]")
      }
    >
      <span
        className={
          "size-[6px] rounded-full " +
          (active ? "bg-[#08b785]" : "bg-[#9aabc2]")
        }
        aria-hidden="true"
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function CatalogueEditor({
  draft,
  editing,
  error,
  onChange,
  onCancel,
  onSave,
}: {
  draft: CatalogueDraft;
  editing: boolean;
  error: string;
  onChange: (draft: CatalogueDraft) => void;
  onCancel: () => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/20 px-[14px] py-[20px] backdrop-blur-[5px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalogue-editor-title"
        className="w-full max-w-[510px] overflow-hidden rounded-[18px] bg-white shadow-[0_20px_70px_rgba(15,23,42,0.2)]"
      >
        <div className="flex items-center justify-between border-b border-[#e8edf4] px-[18px] py-[17px] sm:px-[26px]">
          <h2
            id="catalogue-editor-title"
            className="text-[17px] font-semibold text-[#22314b] sm:text-[20px]"
          >
            {editing ? "Edit Test" : "Add Test"}
          </h2>
          <button
            type="button"
            aria-label="Close test editor"
            onClick={onCancel}
            className="rounded-md p-1 text-[#91a4bd] hover:bg-[#f2f5fa]"
          >
            <X className="size-[19px]" />
          </button>
        </div>
        <form
          onSubmit={onSave}
          className="space-y-[15px] px-[18px] pt-[20px] pb-[22px] sm:px-[26px] sm:pb-[26px]"
        >
          <div>
            <label
              htmlFor="catalogue-test-name"
              className="mb-[6px] block text-[12px] font-medium text-[#405570]"
            >
              Test Name
            </label>
            <input
              id="catalogue-test-name"
              required
              maxLength={140}
              autoFocus
              value={draft.name}
              onChange={(event) =>
                onChange({ ...draft, name: event.currentTarget.value })
              }
              placeholder="e.g. Complete Blood Count (CBC)"
              className="h-[41px] w-full rounded-[10px] border border-[#dce5f0] px-[12px] text-[13px] text-[#344762] outline-none focus:border-[#155eef]"
            />
          </div>
          <div>
            <label
              htmlFor="catalogue-test-category"
              className="mb-[6px] block text-[12px] font-medium text-[#405570]"
            >
              Category
            </label>
            <select
              id="catalogue-test-category"
              required
              value={draft.category}
              onChange={(event) =>
                onChange({
                  ...draft,
                  category: event.currentTarget.value as CatalogueCategory,
                })
              }
              className="h-[41px] w-full rounded-[10px] border border-[#dce5f0] bg-white px-[12px] text-[13px] text-[#344762] outline-none focus:border-[#155eef]"
            >
              {CATEGORY_SUMMARY.map(({ label, category }) => (
                <option key={category} value={category}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
            <div>
              <label
                htmlFor="catalogue-test-price"
                className="mb-[6px] block text-[12px] font-medium text-[#405570]"
              >
                Price (₦)
              </label>
              <input
                id="catalogue-test-price"
                type="number"
                min="1"
                step="1"
                required
                value={draft.price || ""}
                onChange={(event) =>
                  onChange({
                    ...draft,
                    price: Number(event.currentTarget.value),
                  })
                }
                placeholder="4500"
                className="h-[41px] w-full rounded-[10px] border border-[#dce5f0] px-[12px] text-[13px] text-[#344762] outline-none focus:border-[#155eef]"
              />
            </div>
            <div>
              <label
                htmlFor="catalogue-test-turnaround"
                className="mb-[6px] block text-[12px] font-medium text-[#405570]"
              >
                Turnaround Time
              </label>
              <input
                id="catalogue-test-turnaround"
                required
                maxLength={65}
                value={draft.turnaround}
                onChange={(event) =>
                  onChange({ ...draft, turnaround: event.currentTarget.value })
                }
                placeholder="e.g. 4–6 hours"
                className="h-[41px] w-full rounded-[10px] border border-[#dce5f0] px-[12px] text-[13px] text-[#344762] outline-none focus:border-[#155eef]"
              />
            </div>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-[9px] text-[12px] text-[#425872]">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={(event) =>
                onChange({ ...draft, active: event.currentTarget.checked })
              }
              className="size-[15px] accent-[#155eef]"
            />
            Available for booking (Active)
          </label>
          {error && (
            <p
              role="alert"
              className="rounded-[9px] bg-[#fff0f1] px-3 py-2 text-[12px] text-[#c72032]"
            >
              {error}
            </p>
          )}
          <p className="text-[11px] leading-[17px] text-[#91a3ba]">
            Preview only. Changes are kept in this browser session, not saved to
            a laboratory database.
          </p>
          <div className="flex flex-wrap justify-end gap-[9px] pt-[4px]">
            <button
              type="button"
              onClick={onCancel}
              className="min-h-[39px] rounded-[11px] border border-[#ccdae9] px-[15px] text-[13px] font-medium text-[#344963]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[39px] rounded-[11px] bg-[#155eef] px-[17px] text-[13px] font-medium text-white shadow-sm hover:bg-[#064ddb]"
            >
              {editing ? "Save Changes" : "Add Test"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function ToggleConfirmation({
  test,
  onCancel,
  onConfirm,
}: {
  test: CatalogueTest;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const action = test.active ? "Deactivate" : "Activate";
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/20 px-[14px] backdrop-blur-[5px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="catalogue-toggle-title"
        aria-describedby="catalogue-toggle-description"
        className="w-full max-w-[435px] rounded-[18px] bg-white px-[19px] py-[22px] shadow-[0_18px_65px_rgba(15,23,42,0.2)] sm:px-[26px] sm:py-[27px]"
      >
        <h2
          id="catalogue-toggle-title"
          className="text-[17px] font-semibold text-[#26344c] sm:text-[19px]"
        >
          {action} Test?
        </h2>
        <p
          id="catalogue-toggle-description"
          className="mt-[10px] text-[13px] leading-[21px] text-[#61758e]"
        >
          {test.active ? "Deactivate" : "Activate"}{" "}
          <strong className="text-[#26344c]">{test.name}</strong>?
          {test.active
            ? " It will appear as unavailable in this preview catalogue."
            : " It will appear as available in this preview catalogue."}
        </p>
        <p className="mt-[9px] text-[11px] text-[#95a6bc]">
          This does not change real test availability or existing bookings.
        </p>
        <div className="mt-[22px] flex justify-end gap-[10px]">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[10px] border border-[#d4deea] px-[14px] py-[9px] text-[13px] font-medium text-[#3b506d]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              "rounded-[10px] px-[15px] py-[9px] text-[13px] font-medium text-white " +
              (test.active
                ? "bg-[#dc3546] hover:bg-[#b82233]"
                : "bg-[#155eef] hover:bg-[#064ddb]")
            }
          >
            {action}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function LaboratoryTestCatalogue() {
  const [tests, setTests] = useState<CatalogueTest[]>(INITIAL_CATALOGUE_TESTS);
  const [params, setParams] = useSearchParams();
  const search = labParam(params, "q");
  const setSearch = (value: string) => setParams((current) => labListParams(current, "q", value), { replace: true });
  const headerSearch = search;
  const setHeaderSearch = setSearch;
  const categoryFilter = labParam(params, "category", ["All Categories", ...CATALOGUE_CATEGORIES.map((category) => category.category)], "All Categories") as CatalogueCategory | "All Categories";
  const setCategoryFilter = (value: CatalogueCategory | "All Categories") => setParams((current) => labListParams(current, "category", value, "All Categories"));
  const [editorId, setEditorId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CatalogueDraft | null>(null);
  const [error, setError] = useState("");
  const [toggleTestId, setToggleTestId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const toggleTest = tests.find((test) => test.id === toggleTestId) ?? null;

  const visibleTests = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const globalNeedle = headerSearch.trim().toLowerCase();
    return tests.filter((test) => {
      const fields = [
        test.name,
        test.id,
        test.category,
        test.turnaround,
        formatCataloguePrice(test.price),
        test.active ? "Active" : "Inactive",
      ]
        .join(" ")
        .toLowerCase();
      return (
        (categoryFilter === "All Categories" ||
          test.category === categoryFilter) &&
        fields.includes(needle) &&
        fields.includes(globalNeedle)
      );
    });
  }, [tests, search, headerSearch, categoryFilter]);

  useEffect(() => {
    if (!draft && !toggleTest) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDraft(null);
        setError("");
        setToggleTestId(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [draft, toggleTest]);

  const beginAdd = () => {
    setDraft({ ...EMPTY_DRAFT });
    setEditorId(null);
    setError("");
    setNotice("");
  };

  const beginEdit = (test: CatalogueTest) => {
    setDraft({
      name: test.name,
      category: test.category,
      price: test.price,
      turnaround: test.turnaround,
      active: test.active,
    });
    setEditorId(test.id);
    setError("");
    setNotice("");
  };

  const saveTest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;
    const name = draft.name.trim();
    const turnaround = draft.turnaround.trim();
    if (
      !name ||
      !turnaround ||
      !Number.isFinite(draft.price) ||
      !Number.isInteger(draft.price) ||
      draft.price <= 0
    ) {
      setError(
        "Enter a test name, a positive whole-number price, and a turnaround time."
      );
      return;
    }
    if (
      tests.some(
        (test) =>
          test.id !== editorId && test.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      setError(
        "A test with this name already exists in the preview catalogue."
      );
      return;
    }
    const saved: CatalogueDraft = { ...draft, name, turnaround };
    if (editorId) {
      setTests((current) =>
        current.map((test) =>
          test.id === editorId ? { ...test, ...saved } : test
        )
      );
      setNotice("Test updated locally (preview only).");
    } else {
      const nextId =
        Math.max(...tests.map((test) => Number(test.id.slice(4)) || 0), 0) + 1;
      setTests((current) => [
        ...current,
        { id: "CAT-" + String(nextId).padStart(3, "0"), ...saved },
      ]);
      setNotice("Test added locally (preview only).");
    }
    setDraft(null);
    setEditorId(null);
    setError("");
  };

  const confirmToggle = () => {
    if (!toggleTest) return;
    setTests((current) =>
      current.map((test) =>
        test.id === toggleTest.id ? { ...test, active: !test.active } : test
      )
    );
    setNotice(
      toggleTest.name +
        (toggleTest.active ? " deactivated" : " activated") +
        " locally (preview only)."
    );
    setToggleTestId(null);
  };

  return (
    <LaboratoryShell
      section="Test Catalogue"
      search={headerSearch}
      onSearchChange={setHeaderSearch}
    >
      <div className="mx-auto w-full max-w-[1500px] px-[15px] pt-[24px] pb-[70px] sm:px-[25px] sm:pt-[43px] sm:pb-[80px]">
        <div className="flex flex-wrap items-start justify-between gap-[14px]">
          <div>
            <h1 className="text-[22px] leading-[30px] font-semibold tracking-[-0.4px] text-[#202b3a] sm:text-[27px] sm:leading-[36px]">
              Test Catalogue
            </h1>
            <p className="mt-[1px] text-[13px] leading-[20px] text-[#566371] sm:text-[16px] sm:leading-[24px]">
              Manage available tests, pricing, and availability
            </p>
          </div>
          <button
            type="button"
            onClick={beginAdd}
            className="inline-flex min-h-[35px] items-center gap-[6px] rounded-[11px] bg-[#155eef] px-[14px] text-[12px] font-medium text-white shadow-sm hover:bg-[#064ddb] sm:min-h-[36px] sm:text-[13px]"
          >
            <Plus className="size-[14px]" aria-hidden="true" /> Add Test
          </button>
        </div>

        <div className="mt-[29px] grid grid-cols-2 gap-[10px] sm:mt-[31px] sm:grid-cols-3 sm:gap-[11px] lg:grid-cols-7">
          {CATEGORY_SUMMARY.map((item) => {
            const members = tests.filter(
              (test) => test.category === item.category
            );
            return (
              <CategoryCard
                key={item.category}
                label={item.label}
                total={members.length}
                active={members.filter((test) => test.active).length}
                selected={categoryFilter === item.category}
                onClick={() =>
                  setCategoryFilter(
                    categoryFilter === item.category
                      ? "All Categories"
                      : item.category
                  )
                }
              />
            );
          })}
        </div>

        {notice && (
          <div
            role="status"
            className="mt-[19px] flex items-center justify-between gap-[8px] rounded-[10px] border border-[#d2e2ff] bg-[#f0f6ff] px-[12px] py-[9px] text-[12px] text-[#1a58c9]"
          >
            {notice}
            <button
              type="button"
              aria-label="Dismiss notice"
              onClick={() => setNotice("")}
              className="shrink-0 rounded p-[3px] hover:bg-white"
            >
              <X className="size-[14px]" />
            </button>
          </div>
        )}

        <section className="mt-[34px] overflow-hidden rounded-[15px] border border-[#e0e8f2] bg-white sm:mt-[36px]">
          <div className="flex flex-wrap items-center justify-between gap-[11px] px-[12px] py-[11px] sm:px-[17px] sm:py-[12px]">
            <div className="flex w-full flex-wrap items-center gap-[10px] sm:w-auto sm:gap-[11px]">
              <div className="relative w-full sm:w-[246px]">
                <Search
                  className="pointer-events-none absolute top-[10px] left-[12px] size-[15px] text-[#93a5c2]"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  aria-label="Search catalogue tests"
                  placeholder="Search tests..."
                  value={search}
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  className="h-[35px] w-full rounded-[10px] border border-[#dbe5f1] bg-white pr-[10px] pl-[34px] text-[12px] text-[#344762] outline-none placeholder:text-[#94a7c2] focus:border-[#155eef] sm:text-[13px]"
                />
              </div>
              <select
                aria-label="Filter catalogue by category"
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(
                    event.currentTarget.value as
                      CatalogueCategory | "All Categories"
                  )
                }
                className="h-[35px] min-w-[172px] rounded-[10px] border border-[#dbe5f1] bg-white px-[12px] text-[12px] text-[#344762] outline-none focus:border-[#155eef] sm:text-[13px]"
              >
                <option value="All Categories">All Categories</option>
                {CATEGORY_SUMMARY.map(({ category }) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <span className="ml-auto text-[11px] text-[#93a7c2]">
              {visibleTests.length}{" "}
              {visibleTests.length === 1 ? "test" : "tests"}
            </span>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-left">
              <thead>
                <tr className="h-[36px] border-y border-[#e8edf4] bg-[#f7f9fc] text-[11px] font-semibold tracking-[0.1px] text-[#607794]">
                  <th scope="col" className="w-[25%] px-[13px]">
                    TEST NAME
                  </th>
                  <th scope="col" className="w-[22%] px-[13px]">
                    CATEGORY
                  </th>
                  <th scope="col" className="w-[10%] px-[13px]">
                    PRICE
                  </th>
                  <th scope="col" className="w-[16%] px-[13px]">
                    TURNAROUND TIME
                  </th>
                  <th scope="col" className="w-[11%] px-[13px]">
                    STATUS
                  </th>
                  <th scope="col" className="w-[16%] px-[13px]">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleTests.map((test) => (
                  <tr
                    key={test.id}
                    className="h-[52px] border-b border-[#edf1f6] last:border-b-0"
                  >
                    <td className="px-[13px] py-[8px]">
                      <span className="block text-[12px] leading-[17px] font-medium text-[#263550] sm:text-[13px]">
                        {test.name}
                      </span>
                      <span className="block text-[11px] leading-[15px] text-[#90a4c1]">
                        {test.id}
                      </span>
                    </td>
                    <td className="px-[13px] py-[8px]">
                      <CategoryBadge category={test.category} />
                    </td>
                    <td className="px-[13px] py-[8px] font-mono text-[12px] font-semibold whitespace-nowrap text-[#27364f]">
                      {formatCataloguePrice(test.price)}
                    </td>
                    <td className="px-[13px] py-[8px] text-[11px] whitespace-nowrap text-[#7187a7] sm:text-[12px]">
                      {test.turnaround}
                    </td>
                    <td className="px-[13px] py-[8px]">
                      <TestStatus active={test.active} />
                    </td>
                    <td className="px-[13px] py-[8px]">
                      <div className="flex items-center gap-[17px]">
                        <button
                          type="button"
                          onClick={() => beginEdit(test)}
                          aria-label={"Edit " + test.name}
                          className="rounded-[4px] text-[11px] text-[#344b68] hover:text-[#155eef] hover:underline focus-visible:outline-2 focus-visible:outline-[#155eef] sm:text-[12px]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNotice("");
                            setToggleTestId(test.id);
                          }}
                          aria-label={
                            (test.active ? "Deactivate " : "Activate ") +
                            test.name
                          }
                          className="rounded-[4px] text-[11px] text-[#344b68] hover:text-[#155eef] hover:underline focus-visible:outline-2 focus-visible:outline-[#155eef] sm:text-[12px]"
                        >
                          {test.active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleTests.length === 0 && (
              <div className="px-[18px] py-[40px] text-center text-[12px] text-[#7990ad]">
                No tests match your search or category.
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setHeaderSearch("");
                    setCategoryFilter("All Categories");
                  }}
                  className="ml-[7px] font-medium text-[#155eef] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
        <p className="mt-[14px] text-[11px] leading-[18px] text-[#95a7bb]">
          Preview catalogue based on the supplied reference. Prices,
          availability, edits, and new tests are sample data only; nothing
          changes real bookings.
        </p>
      </div>

      {draft && (
        <CatalogueEditor
          draft={draft}
          editing={editorId !== null}
          error={error}
          onChange={setDraft}
          onCancel={() => {
            setDraft(null);
            setError("");
          }}
          onSave={saveTest}
        />
      )}
      {toggleTest && (
        <ToggleConfirmation
          test={toggleTest}
          onCancel={() => setToggleTestId(null)}
          onConfirm={confirmToggle}
        />
      )}
    </LaboratoryShell>
  );
}
