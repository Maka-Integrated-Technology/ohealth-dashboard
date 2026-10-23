import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus, Search, X } from "lucide-react";
import { useSearchParams } from "react-router";
import {
  labListParams,
  labParam,
  labStaffMatch,
  labUniqueEmail,
} from "./laboratory-list-state";
import { LaboratoryShell } from "./laboratory-shell";
import {
  INITIAL_LAB_STAFF,
  LAB_STAFF_PERMISSIONS,
  LAB_STAFF_ROLES,
  type LabStaffMember,
  type LabStaffPermission,
  type LabStaffRole,
} from "./laboratory-staff-data";

type FormData = {
  name: string;
  email: string;
  phone: string;
  role: LabStaffRole;
};

type ActiveDialog =
  | { kind: "invite" }
  | { kind: "edit"; staffId: string }
  | { kind: "permissions"; staffId: string }
  | { kind: "status"; staffId: string }
  | null;

const ROLE_COLORS: Record<LabStaffRole, string> = {
  "Lab Administrator": "bg-[#edf4ff] text-[#155eef]",
  "Senior Technician": "bg-[#f4f0ff] text-[#7632ed]",
  "Lab Technician": "bg-[#fff8e7] text-[#ba5200]",
  Phlebotomist: "bg-[#ecf9ff] text-[#007db9]",
  "Quality Assurance": "bg-[#e8faf2] text-[#008663]",
  Reception: "bg-[#eff2f6] text-[#425874]",
};

const INPUT_CLASS =
  "h-[37px] w-full rounded-[10px] border border-[#dbe5f1] bg-white px-[12px] text-[12px] text-[#26364e] outline-none placeholder:text-[#94a7c2] focus:border-[#155eef] focus:ring-2 focus:ring-[#e6efff] sm:text-[14px]";
const OUTLINE_BUTTON =
  "rounded-[9px] border border-[#c8d6e7] bg-white px-[14px] py-[9px] text-[12px] font-medium text-[#344965] hover:bg-[#f4f7fc] focus-visible:outline-2 focus-visible:outline-[#155eef] sm:text-[13px]";
const BLUE_BUTTON =
  "rounded-[9px] bg-[#155eef] px-[16px] py-[10px] text-[12px] font-medium text-white shadow-sm hover:bg-[#0b4ddd] focus-visible:outline-2 focus-visible:outline-[#155eef] sm:text-[13px]";

function ModalFrame({
  title,
  onClose,
  children,
  footer,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#101828]/20 px-[13px] py-[20px] backdrop-blur-[5px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="lab-staff-dialog-title"
        className={
          "flex max-h-[min(92vh,930px)] w-full flex-col overflow-hidden rounded-[17px] bg-white shadow-[0_18px_65px_rgba(16,24,40,0.22)] " +
          (wide ? "max-w-[465px]" : "max-w-[424px]")
        }
      >
        <header className="flex min-h-[55px] shrink-0 items-center justify-between border-b border-[#e8edf4] px-[18px] py-[13px] sm:px-[23px]">
          <h2
            id="lab-staff-dialog-title"
            className="text-[15px] font-semibold text-[#1b273a] sm:text-[17px]"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-[4px] text-[#93a7c0] hover:bg-[#f2f5f9]"
          >
            <X className="size-[18px]" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-[18px] py-[18px] sm:px-[23px] sm:py-[20px]">
          {children}
        </div>
        <footer className="flex shrink-0 flex-wrap items-center justify-end gap-[9px] border-t border-[#e8edf4] bg-[#f7f9fc] px-[18px] py-[14px] sm:px-[23px]">
          {footer}
        </footer>
      </section>
    </div>
  );
}

function StaffFormModal({
  staff,
  onCancel,
  onSubmit,
}: {
  staff: LabStaffMember | null;
  onCancel: () => void;
  onSubmit: (draft: FormData) => string | null;
}) {
  const [draft, setDraft] = useState<FormData>({
    name: staff?.name ?? "",
    email: staff?.email ?? "",
    phone: staff?.phone ?? "",
    role: staff?.role ?? "Lab Technician",
  });
  const [error, setError] = useState("");
  const editing = staff !== null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = onSubmit({
      name: draft.name.trim(),
      email: draft.email.trim().toLowerCase(),
      phone: draft.phone.trim(),
      role: draft.role,
    });
    if (message) setError(message);
  };

  return (
    <ModalFrame
      title={editing ? "Edit Staff Member" : "Invite Staff Member"}
      onClose={onCancel}
      footer={
        <>
          <button type="button" className={OUTLINE_BUTTON} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            form="lab-staff-form"
            className={BLUE_BUTTON}
            disabled={!draft.name.trim() || !draft.email.trim()}
          >
            {editing ? "Save Changes" : "Send Invitation"}
          </button>
        </>
      }
    >
      <form
        id="lab-staff-form"
        onSubmit={handleSubmit}
        className="space-y-[15px]"
      >
        <div>
          <label
            htmlFor="staff-full-name"
            className="mb-[5px] block text-[12px] font-medium text-[#405570]"
          >
            Full Name <span className="text-[#e60025]">*</span>
          </label>
          <input
            id="staff-full-name"
            required
            maxLength={120}
            autoFocus
            className={INPUT_CLASS}
            placeholder="e.g. Dr. Ngozi Adeyemi"
            value={draft.name}
            onChange={(event) =>
              setDraft({ ...draft, name: event.currentTarget.value })
            }
          />
        </div>
        <div>
          <label
            htmlFor="staff-email"
            className="mb-[5px] block text-[12px] font-medium text-[#405570]"
          >
            Email Address <span className="text-[#e60025]">*</span>
          </label>
          <input
            id="staff-email"
            type="email"
            required
            maxLength={160}
            className={INPUT_CLASS}
            placeholder="staff@ohealthplus.ng"
            value={draft.email}
            onChange={(event) =>
              setDraft({ ...draft, email: event.currentTarget.value })
            }
          />
        </div>
        <div>
          <label
            htmlFor="staff-phone"
            className="mb-[5px] block text-[12px] font-medium text-[#405570]"
          >
            Phone Number
          </label>
          <input
            id="staff-phone"
            type="tel"
            maxLength={40}
            className={INPUT_CLASS}
            placeholder="+234 800 000 0000"
            value={draft.phone}
            onChange={(event) =>
              setDraft({ ...draft, phone: event.currentTarget.value })
            }
          />
        </div>
        <div>
          <label
            htmlFor="staff-role"
            className="mb-[5px] block text-[12px] font-medium text-[#405570]"
          >
            Role
          </label>
          <select
            id="staff-role"
            className={INPUT_CLASS}
            value={draft.role}
            onChange={(event) =>
              setDraft({
                ...draft,
                role: event.currentTarget.value as LabStaffRole,
              })
            }
          >
            {LAB_STAFF_ROLES.map((role) => (
              <option value={role} key={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-[#fff0f2] px-3 py-2 text-[12px] text-[#c11d33]"
          >
            {error}
          </p>
        )}
        <p className="text-[11px] leading-[17px] text-[#92a3bc]">
          Preview only. Invitations are not emailed or sent to a real account.
        </p>
      </form>
    </ModalFrame>
  );
}

function PermissionsModal({
  staff,
  onCancel,
  onSave,
}: {
  staff: LabStaffMember;
  onCancel: () => void;
  onSave: (permissions: LabStaffPermission[]) => void;
}) {
  const [selected, setSelected] = useState<LabStaffPermission[]>(
    staff.permissions
  );
  const togglePermission = (permission: LabStaffPermission) => {
    if (permission === "All Permissions (Admin)") {
      setSelected(selected.includes(permission) ? [] : [permission]);
      return;
    }
    const granular = selected.filter(
      (value) => value !== "All Permissions (Admin)"
    );
    setSelected(
      granular.includes(permission)
        ? granular.filter((value) => value !== permission)
        : [...granular, permission]
    );
  };

  return (
    <ModalFrame
      title={"Permissions — " + staff.name}
      onClose={onCancel}
      wide
      footer={
        <>
          <button type="button" className={OUTLINE_BUTTON} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={BLUE_BUTTON}
            onClick={() => onSave(selected)}
          >
            Save Permissions
          </button>
        </>
      }
    >
      <p className="mb-[18px] text-[13px] text-[#6b809d] sm:text-[15px]">
        Role:{" "}
        <strong className="font-semibold text-[#5f7391]">{staff.role}</strong>
      </p>
      <div className="space-y-[16px] sm:space-y-[18px]">
        {LAB_STAFF_PERMISSIONS.map((permission) => (
          <label
            key={permission}
            className="flex cursor-pointer items-center gap-[13px] text-[13px] text-[#394e69] sm:text-[15px]"
          >
            <input
              type="checkbox"
              className="size-[17px] shrink-0 cursor-pointer accent-[#155eef]"
              checked={selected.includes(permission)}
              onChange={() => togglePermission(permission)}
            />
            <span>{permission}</span>
          </label>
        ))}
      </div>
      <p className="mt-[22px] text-[11px] leading-[17px] text-[#93a4bb]">
        Preview permissions only. No live role-based access policy is changed.
      </p>
    </ModalFrame>
  );
}

function StatusModal({
  staff,
  onCancel,
  onConfirm,
}: {
  staff: LabStaffMember;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const deactivating = staff.status === "Active";
  return (
    <ModalFrame
      title={deactivating ? "Deactivate Staff Member" : "Activate Staff Member"}
      onClose={onCancel}
      footer={
        <>
          <button type="button" className={OUTLINE_BUTTON} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={
              deactivating
                ? "rounded-[9px] bg-[#e60012] px-[18px] py-[10px] text-[12px] font-medium text-white hover:bg-[#c50010] sm:text-[13px]"
                : BLUE_BUTTON
            }
            onClick={onConfirm}
          >
            {deactivating ? "Deactivate" : "Activate"}
          </button>
        </>
      }
    >
      <p className="text-[14px] leading-[23px] text-[#4b607d] sm:text-[16px] sm:leading-[25px]">
        {deactivating
          ? "Deactivating " +
            staff.name +
            " will revoke their access to the system immediately. Continue?"
          : "Activate " +
            staff.name +
            " so they can access the laboratory system again?"}
      </p>
      <p className="mt-[13px] text-[11px] leading-[17px] text-[#91a3bb]">
        Design preview only. This action updates the table but does not revoke
        or grant real system access.
      </p>
    </ModalFrame>
  );
}

function StaffAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  return (
    <span
      aria-hidden="true"
      className="flex size-[31px] shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[11px] font-semibold text-[#155eef]"
    >
      {initials}
    </span>
  );
}

function StaffStatusBadge({ status }: { status: LabStaffMember["status"] }) {
  return (
    <span
      className={
        "inline-flex items-center gap-[6px] rounded-full px-[9px] py-[4px] text-[10px] leading-[14px] font-medium sm:text-[11px] " +
        (status === "Active"
          ? "bg-[#e9faf2] text-[#008b64]"
          : status === "Inactive"
            ? "bg-[#eef2f7] text-[#50617b]"
            : "bg-[#fff8ea] text-[#bc7400]")
      }
    >
      <span
        aria-hidden="true"
        className={
          "size-[6px] rounded-full " +
          (status === "Active"
            ? "bg-[#0cb785]"
            : status === "Inactive"
              ? "bg-[#9aa9bc]"
              : "bg-[#e0a222]")
        }
      />
      {status}
    </span>
  );
}

export default function LaboratoryStaffManagement() {
  const [staff, setStaff] = useState<LabStaffMember[]>(INITIAL_LAB_STAFF);
  const [params, setParams] = useSearchParams();
  const search = labParam(params, "q");
  const setSearch = (value: string) =>
    setParams((current) => labListParams(current, "q", value), {
      replace: true,
    });
  const headerSearch = search;
  const setHeaderSearch = setSearch;
  const [dialog, setDialog] = useState<ActiveDialog>(null);
  const [notice, setNotice] = useState("");

  const selectedStaff =
    dialog && dialog.kind !== "invite"
      ? (staff.find((member) => member.id === dialog.staffId) ?? null)
      : null;

  useEffect(() => {
    if (!dialog) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDialog(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dialog]);

  const visibleStaff = useMemo(() => {
    return staff.filter((member) => labStaffMatch(member, search));
  }, [staff, search]);

  const saveStaff = (draft: FormData): string | null => {
    if (!draft.name || !draft.email || !draft.email.includes("@"))
      return "Enter a valid name and email address.";
    const editedId = dialog?.kind === "edit" ? dialog.staffId : null;
    if (!labUniqueEmail(staff, draft.email, editedId)) {
      return "A staff member with this email address already exists in this preview.";
    }
    if (editedId) {
      setStaff((current) =>
        current.map((member) =>
          member.id === editedId ? { ...member, ...draft } : member
        )
      );
      setNotice("Staff details saved locally (preview only).");
    } else {
      const id = "staff-preview-" + String(staff.length + 1);
      setStaff((current) => [
        ...current,
        {
          id,
          ...draft,
          status: "Invited",
          lastActive: "—",
          permissions: [],
        },
      ]);
      setNotice("Invitation added to this preview only. No email was sent.");
    }
    setDialog(null);
    return null;
  };

  const savePermissions = (permissions: LabStaffPermission[]) => {
    if (!selectedStaff) return;
    const id = selectedStaff.id;
    setStaff((current) =>
      current.map((member) =>
        member.id === id ? { ...member, permissions } : member
      )
    );
    setDialog(null);
    setNotice(
      "Permissions saved locally (preview only). No real account access was modified."
    );
  };

  const confirmStatus = () => {
    if (!selectedStaff) return;
    const id = selectedStaff.id;
    const nextStatus =
      selectedStaff.status === "Active" ? "Inactive" : "Active";
    setStaff((current) =>
      current.map((member) =>
        member.id === id ? { ...member, status: nextStatus } : member
      )
    );
    setDialog(null);
    setNotice(
      selectedStaff.name +
        " marked " +
        nextStatus.toLowerCase() +
        " in this preview only."
    );
  };

  return (
    <LaboratoryShell
      section="Staff Management"
      search={headerSearch}
      onSearchChange={setHeaderSearch}
    >
      <div className="w-full px-[15px] pt-[24px] pb-[75px] sm:px-[28px] sm:pt-[43px]">
        <div className="flex flex-wrap items-start justify-between gap-[13px]">
          <div>
            <h1 className="text-[22px] leading-[30px] font-semibold tracking-[-0.4px] text-[#202b3a] sm:text-[29px] sm:leading-[38px]">
              Staff Management
            </h1>
            <p className="mt-[2px] text-[13px] leading-[20px] text-[#566371] sm:text-[16px] sm:leading-[24px]">
              Manage laboratory staff, roles, and access permissions
            </p>
          </div>
          <button
            type="button"
            className={BLUE_BUTTON + " flex items-center gap-[4px]"}
            onClick={() => {
              setNotice("");
              setDialog({ kind: "invite" });
            }}
          >
            <Plus aria-hidden="true" className="size-[13px]" /> Invite Staff
          </button>
        </div>

        <div className="mt-[32px] grid grid-cols-2 gap-[11px] sm:mt-[40px] sm:grid-cols-3 sm:gap-[12px] xl:grid-cols-6">
          {LAB_STAFF_ROLES.map((role) => (
            <div
              key={role}
              className="flex min-h-[66px] flex-col items-center justify-center rounded-[15px] border border-[#dce6f2] bg-white px-[6px] py-[10px] text-center"
            >
              <strong className="text-[17px] leading-[22px] font-semibold text-[#16243a] sm:text-[19px]">
                {staff.filter((member) => member.role === role).length}
              </strong>
              <span className="mt-[3px] text-[10px] leading-[14px] text-[#748ba9] sm:text-[11px]">
                {role}
              </span>
            </div>
          ))}
        </div>

        {notice && (
          <div
            role="status"
            className="mt-[16px] flex items-center justify-between gap-2 rounded-[10px] border border-[#c7deff] bg-[#eef5ff] px-[12px] py-[10px] text-[12px] text-[#155eef]"
          >
            <span>{notice}</span>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setNotice("")}
              className="rounded p-1 hover:bg-white"
            >
              <X className="size-[14px]" />
            </button>
          </div>
        )}

        <section className="mt-[27px] overflow-hidden rounded-[16px] border border-[#e0e8f3] bg-white sm:mt-[29px]">
          <div className="px-[13px] py-[12px] sm:px-[19px] sm:py-[12px]">
            <div className="relative w-full sm:w-[272px]">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-[10px] left-[11px] size-[15px] text-[#91a6c1]"
              />
              <input
                type="search"
                aria-label="Search staff by name, email, or role"
                placeholder="Search staff by name, email, role..."
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                className={INPUT_CLASS + " pl-[34px]"}
              />
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-left">
              <thead>
                <tr className="h-[39px] border-y border-[#e7edf4] bg-[#f7f9fc] text-[11px] font-semibold tracking-[0.1px] text-[#617997]">
                  <th scope="col" className="w-[26%] px-[15px]">
                    STAFF MEMBER
                  </th>
                  <th scope="col" className="w-[14%] px-[15px]">
                    ROLE
                  </th>
                  <th scope="col" className="w-[15%] px-[15px]">
                    PHONE
                  </th>
                  <th scope="col" className="w-[10%] px-[15px]">
                    STATUS
                  </th>
                  <th scope="col" className="w-[13%] px-[15px]">
                    LAST ACTIVE
                  </th>
                  <th scope="col" className="w-[22%] px-[15px]">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleStaff.map((member) => (
                  <tr
                    key={member.id}
                    className="h-[57px] border-b border-[#eaf0f6] last:border-b-0 hover:bg-[#fbfcff]"
                  >
                    <td className="px-[15px] py-[9px]">
                      <div className="flex min-w-0 items-center gap-[11px]">
                        <StaffAvatar name={member.name} />
                        <div className="min-w-0">
                          <span className="block text-[12px] leading-[18px] font-medium text-[#24334d] sm:text-[14px]">
                            {member.name}
                          </span>
                          <span className="block text-[11px] leading-[16px] text-[#90a4c1]">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-[15px] py-[9px]">
                      <span
                        className={
                          "inline-block rounded-[8px] px-[8px] py-[4px] text-[10px] leading-[14px] font-medium whitespace-nowrap sm:text-[11px] " +
                          ROLE_COLORS[member.role]
                        }
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="px-[15px] py-[9px] font-mono text-[11px] whitespace-nowrap text-[#758ba9] sm:text-[12px]">
                      {member.phone || "—"}
                    </td>
                    <td className="px-[15px] py-[9px]">
                      <StaffStatusBadge status={member.status} />
                    </td>
                    <td className="px-[15px] py-[9px] font-mono text-[11px] whitespace-nowrap text-[#91a6c3]">
                      {member.lastActive}
                    </td>
                    <td className="px-[15px] py-[9px]">
                      <div className="flex items-center gap-[14px] whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setNotice("");
                            setDialog({ kind: "edit", staffId: member.id });
                          }}
                          className="rounded-sm text-[11px] text-[#3b516f] hover:text-[#155eef] hover:underline sm:text-[12px]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNotice("");
                            setDialog({
                              kind: "permissions",
                              staffId: member.id,
                            });
                          }}
                          className="rounded-sm text-[11px] text-[#3b516f] hover:text-[#155eef] hover:underline sm:text-[12px]"
                        >
                          Permissions
                        </button>
                        {member.status !== "Invited" && (
                          <button
                            type="button"
                            onClick={() => {
                              setNotice("");
                              setDialog({ kind: "status", staffId: member.id });
                            }}
                            className="rounded-sm text-[11px] text-[#3b516f] hover:text-[#155eef] hover:underline sm:text-[12px]"
                          >
                            {member.status === "Active"
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleStaff.length === 0 && (
              <div className="px-[20px] py-[42px] text-center text-[12px] text-[#7a91ad]">
                No staff members match your search.
                <button
                  type="button"
                  className="ml-2 font-medium text-[#155eef] hover:underline"
                  onClick={() => {
                    setSearch("");
                    setHeaderSearch("");
                  }}
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>

        <p className="mt-[14px] text-[11px] leading-[18px] text-[#95a7bd]">
          Design-preview staff directory. Invitations, permission changes, and
          account activation do not affect real users.
        </p>
      </div>
      {dialog?.kind === "invite" && (
        <StaffFormModal
          key="invite"
          staff={null}
          onCancel={() => setDialog(null)}
          onSubmit={saveStaff}
        />
      )}
      {dialog?.kind === "edit" && selectedStaff && (
        <StaffFormModal
          key={selectedStaff.id}
          staff={selectedStaff}
          onCancel={() => setDialog(null)}
          onSubmit={saveStaff}
        />
      )}
      {dialog?.kind === "permissions" && selectedStaff && (
        <PermissionsModal
          key={selectedStaff.id}
          staff={selectedStaff}
          onCancel={() => setDialog(null)}
          onSave={savePermissions}
        />
      )}
      {dialog?.kind === "status" && selectedStaff && (
        <StatusModal
          staff={selectedStaff}
          onCancel={() => setDialog(null)}
          onConfirm={confirmStatus}
        />
      )}
    </LaboratoryShell>
  );
}
