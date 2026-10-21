import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router";
import { LaboratoryShell } from "./laboratory-shell";

type ProfileTab = "Lab Details" | "Operating Hours" | "Branch Locations" | "Security";
type ProfileDetails = {
  laboratoryName: string;
  registrationNumber: string;
  licenseNumber: string;
  contactEmail: string;
  phoneNumber: string;
  region: string;
  address: string;
};
type OpeningDay = { day: string; hours: string; open: boolean };
type Branch = { id: number; name: string; address: string; phone: string; active: boolean };
type BranchDraft = { name: string; address: string; phone: string; active: boolean };
type ProfileDialog = "history" | "devices" | "logout" | null;

const TABS: ProfileTab[] = ["Lab Details", "Operating Hours", "Branch Locations", "Security"];
const INITIAL_DETAILS: ProfileDetails = {
  laboratoryName: "MedCore Diagnostics",
  registrationNumber: "RC-894231",
  licenseNumber: "LAB-LG-0042-2024",
  contactEmail: "info@medcorediagnostics.ng",
  phoneNumber: "+234 801 000 0001",
  region: "Lagos State",
  address: "12 Marina Road, Lagos Island, Lagos State, Nigeria",
};
const INITIAL_HOURS: OpeningDay[] = [
  { day: "Mon", hours: "08:00–18:00", open: true },
  { day: "Tue", hours: "08:00–18:00", open: true },
  { day: "Wed", hours: "08:00–18:00", open: true },
  { day: "Thu", hours: "08:00–18:00", open: true },
  { day: "Fri", hours: "08:00–18:00", open: true },
  { day: "Sat", hours: "09:00–14:00", open: true },
  { day: "Sun", hours: "Closed", open: false },
];
const INITIAL_BRANCHES: Branch[] = [
  {
    id: 1,
    name: "Lagos Island (HQ)",
    address: "12 Marina Road, Lagos Island, Lagos State",
    phone: "+234 801 000 0001",
    active: true,
  },
  {
    id: 2,
    name: "Victoria Island Branch",
    address: "8 Akin Adesola Street, Victoria Island, Lagos",
    phone: "+234 801 000 0002",
    active: true,
  },
];
const INPUT_CLASS =
  "h-[41px] w-full min-w-0 rounded-[12px] border border-[#dbe4f0] bg-white px-[13px] text-[13px] text-[#26344d] outline-none placeholder:text-[#8ea2bc] focus:border-[#155eef] focus:ring-2 focus:ring-[#e6efff] sm:text-[15px]";
const PRIMARY_CLASS =
  "inline-flex min-h-[39px] items-center justify-center rounded-[11px] bg-[#155eef] px-[16px] text-[13px] font-medium text-white shadow-sm hover:bg-[#0f50dd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#155eef] sm:text-[15px]";
const SECONDARY_CLASS =
  "inline-flex min-h-[36px] items-center justify-center rounded-[12px] border border-[#c6d5e7] bg-white px-[13px] text-[12px] font-medium text-[#344862] hover:bg-[#f7faff] focus-visible:outline-2 focus-visible:outline-[#155eef] sm:text-[14px]";
const CARD_CLASS = "rounded-[17px] border border-[#e0e8f2] bg-white";

function ProfileField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
}) {
  const id = "lab-profile-" + label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-[6px] block text-[12px] font-medium text-[#405570] sm:text-[13px]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required
        onChange={(event) => onChange(event.currentTarget.value)}
        className={INPUT_CLASS}
      />
    </div>
  );
}

function BranchDialog({
  initial,
  onClose,
  onSave,
}: {
  initial: Branch | null;
  onClose: () => void;
  onSave: (draft: BranchDraft) => void;
}) {
  const [draft, setDraft] = useState<BranchDraft>({
    name: initial?.name ?? "",
    address: initial?.address ?? "",
    phone: initial?.phone ?? "",
    active: initial?.active ?? true,
  });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.address.trim() || !draft.phone.trim()) return;
    onSave({
      name: draft.name.trim(),
      address: draft.address.trim(),
      phone: draft.phone.trim(),
      active: draft.active,
    });
  };
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/20 px-4 backdrop-blur-[4px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="lab-branch-dialog-title" className="w-full max-w-[480px] rounded-[18px] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between border-b border-[#e8edf4] px-[20px] py-[16px]">
          <h2 id="lab-branch-dialog-title" className="text-[17px] font-semibold text-[#202b3a]">
            {initial ? "Edit Branch Location" : "Add Branch Location"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close branch editor" className="rounded-md p-1 text-[#8da1bb] hover:bg-[#f5f7fb]">
            <X className="size-[19px]" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-[15px] px-[20px] py-[21px]">
          <ProfileField label="Branch Name" value={draft.name} onChange={(name) => setDraft((prev) => ({ ...prev, name }))} />
          <ProfileField label="Branch Address" value={draft.address} onChange={(address) => setDraft((prev) => ({ ...prev, address }))} />
          <ProfileField label="Branch Phone" type="tel" value={draft.phone} onChange={(phone) => setDraft((prev) => ({ ...prev, phone }))} />
          <label className="flex items-center gap-2 text-[13px] text-[#405570]">
            <input type="checkbox" checked={draft.active} onChange={(event) => setDraft((prev) => ({ ...prev, active: event.currentTarget.checked }))} className="size-[16px] accent-[#155eef]" />
            Branch active
          </label>
          <p className="text-[11px] leading-[17px] text-[#8ca0ba]">Preview only: branch changes are not sent to a server.</p>
          <div className="flex justify-end gap-2 pt-[6px]">
            <button type="button" onClick={onClose} className={SECONDARY_CLASS}>Cancel</button>
            <button type="submit" className={PRIMARY_CLASS}>{initial ? "Save Branch" : "Add Branch"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function SecurityDialog({ kind, onClose, onReturn }: {
  kind: Exclude<ProfileDialog, null>;
  onClose: () => void;
  onReturn: () => void;
}) {
  const title = kind === "history" ? "Login History" : kind === "devices" ? "Device Management" : "Logout";
  const body =
    kind === "history"
      ? "Live account sign-in history is not connected to this design preview. No login events are available to show."
      : kind === "devices"
        ? "Trusted-device management requires an authenticated account service. This preview does not list, trust or revoke real devices."
        : "This is a design preview with no authenticated session. You can return to the laboratory sign-in screen without signing out of any real account.";
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/20 px-4 backdrop-blur-[4px]"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="lab-security-dialog-title" className="w-full max-w-[460px] rounded-[18px] bg-white p-[23px] shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between gap-2">
          <h2 id="lab-security-dialog-title" className="text-[18px] font-semibold text-[#202b3a]">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1 text-[#8da1bb] hover:bg-[#f5f7fb]"><X className="size-[18px]" /></button>
        </div>
        <p className="mt-[13px] text-[13px] leading-[21px] text-[#607591]">{body}</p>
        <div className="mt-[23px] flex justify-end gap-2">
          <button type="button" onClick={onClose} className={SECONDARY_CLASS}>{kind === "logout" ? "Cancel" : "Close"}</button>
          {kind === "logout" && <button type="button" onClick={onReturn} className={PRIMARY_CLASS}>Return to Sign In</button>}
        </div>
      </section>
    </div>
  );
}

export default function LaboratoryProfile() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<ProfileTab>("Lab Details");
  const [details, setDetails] = useState<ProfileDetails>(INITIAL_DETAILS);
  const [hours, setHours] = useState<OpeningDay[]>(INITIAL_HOURS);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [editingBranch, setEditingBranch] = useState<Branch | null | "new">(null);
  const [securityDialog, setSecurityDialog] = useState<ProfileDialog>(null);
  const [previewTwoFactor, setPreviewTwoFactor] = useState(true);
  const [notice, setNotice] = useState("");
  const [headerSearch, setHeaderSearch] = useState("");

  useEffect(() => {
    if (editingBranch === null && securityDialog === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEditingBranch(null);
        setSecurityDialog(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [editingBranch, securityDialog]);

  const updateDetails = (field: keyof ProfileDetails, value: string) =>
    setDetails((previous) => ({ ...previous, [field]: value }));

  const saveDetails = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("Lab details saved in this preview only. No laboratory account was updated.");
  };

  const updateHours = (index: number, value: string) =>
    setHours((previous) => previous.map((item, i) => i === index ? { ...item, hours: value } : item));

  const toggleDay = (index: number) =>
    setHours((previous) =>
      previous.map((item, i) =>
        i !== index
          ? item
          : {
              ...item,
              open: !item.open,
              hours: item.open ? "Closed" : item.day === "Sat" ? "09:00–14:00" : "08:00–18:00",
            }
      )
    );

  const saveHours = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d[–-]([01]\d|2[0-3]):[0-5]\d$/;
    if (hours.some((item) => item.open && !timePattern.test(item.hours.trim()))) {
      setNotice("Use a time range such as 08:00–18:00 for every open day.");
      return;
    }
    setNotice("Operating hours saved in this preview only. No live scheduling was changed.");
  };

  const saveBranch = (draft: BranchDraft) => {
    if (editingBranch && editingBranch !== "new") {
      const id = editingBranch.id;
      setBranches((previous) => previous.map((item) => item.id === id ? { ...item, ...draft } : item));
      setNotice("Branch details updated in the preview only.");
    } else {
      setBranches((previous) => [...previous, { ...draft, id: Math.max(0, ...previous.map((item) => item.id)) + 1 }]);
      setNotice("Branch added in the preview only.");
    }
    setEditingBranch(null);
  };

  const changeTab = (value: ProfileTab) => {
    setTab(value);
    setNotice("");
  };

  return (
    <LaboratoryShell section="Laboratory Profile" search={headerSearch} onSearchChange={setHeaderSearch}>
      <div className="w-full px-[15px] pt-[24px] pb-[75px] sm:px-[30px] sm:pt-[44px] lg:px-[45px]">
        <h1 className="text-[22px] leading-[30px] font-semibold tracking-[-0.4px] text-[#202b3a] sm:text-[29px] sm:leading-[38px]">
          Laboratory Profile
        </h1>
        <p className="mt-[2px] text-[13px] leading-[20px] text-[#566371] sm:text-[16px] sm:leading-[24px]">
          Manage your laboratory's information, operating hours, and branches
        </p>

        <div role="tablist" aria-label="Laboratory profile sections" className="mt-[32px] flex w-full max-w-[900px] gap-[16px] overflow-x-auto border-b border-[#e1e8f1] sm:mt-[42px] sm:gap-[40px]">
          {TABS.map((name) => (
            <button key={name} type="button" role="tab" aria-selected={tab === name}
              onClick={() => changeTab(name)}
              className={
                "min-h-[43px] shrink-0 border-b-2 px-[12px] pb-[9px] text-[12px] font-medium whitespace-nowrap transition-colors sm:text-[15px] " +
                (tab === name ? "border-[#155eef] text-[#155eef]" : "border-transparent text-[#5c728f] hover:text-[#155eef]")
              }
            >
              {name}
            </button>
          ))}
        </div>

        {notice && (
          <div role="status" className="mt-[16px] flex w-full max-w-[900px] items-start justify-between gap-3 rounded-[11px] border border-[#c6dbff] bg-[#f0f6ff] px-4 py-3 text-[12px] leading-[19px] text-[#155eef]">
            <span>{notice}</span>
            <button type="button" aria-label="Dismiss notice" onClick={() => setNotice("")} className="shrink-0 p-0.5"><X className="size-[15px]" /></button>
          </div>
        )}

        {tab === "Lab Details" && (
          <form onSubmit={saveDetails} role="tabpanel" aria-label="Lab Details" className={CARD_CLASS + " mt-[26px] w-full max-w-[900px] px-[17px] py-[21px] sm:px-[26px] sm:py-[28px]"}>
            <div className="flex items-center gap-[17px] border-b border-[#edf1f6] pb-[23px]">
              <span aria-hidden="true" className="flex size-[61px] shrink-0 items-center justify-center rounded-[15px] bg-[#155eef] text-[24px] font-semibold text-white sm:size-[68px] sm:text-[27px]">MC</span>
              <div className="min-w-0">
                <h2 className="text-[16px] leading-[23px] font-semibold text-[#19243a] sm:text-[19px]">{details.laboratoryName || "MedCore Diagnostics"}</h2>
                <p className="mt-[3px] text-[12px] text-[#667d9b] sm:text-[14px]">Lagos Island Branch</p>
                <p className="mt-[4px] inline-flex items-center gap-2 text-[11px] font-medium text-[#009b72] sm:text-[13px]">
                  <span className="size-[7px] rounded-full bg-[#08b989]" aria-hidden="true" />
                  Verified &amp; Active on OHealth+
                </p>
              </div>
            </div>
            <div className="mt-[23px] grid grid-cols-1 gap-x-[21px] gap-y-[20px] sm:grid-cols-2">
              <ProfileField label="Laboratory Name" value={details.laboratoryName} onChange={(value) => updateDetails("laboratoryName", value)} />
              <ProfileField label="Registration Number" value={details.registrationNumber} onChange={(value) => updateDetails("registrationNumber", value)} />
              <ProfileField label="License Number" value={details.licenseNumber} onChange={(value) => updateDetails("licenseNumber", value)} />
              <ProfileField label="Contact Email" type="email" value={details.contactEmail} onChange={(value) => updateDetails("contactEmail", value)} />
              <ProfileField label="Phone Number" type="tel" value={details.phoneNumber} onChange={(value) => updateDetails("phoneNumber", value)} />
              <ProfileField label="State/Region" value={details.region} onChange={(value) => updateDetails("region", value)} />
              <div className="sm:col-span-2">
                <ProfileField label="Laboratory Address" value={details.address} onChange={(value) => updateDetails("address", value)} />
              </div>
            </div>
            <div className="mt-[21px] flex justify-end">
              <button type="submit" className={PRIMARY_CLASS}>Save Changes</button>
            </div>
          </form>
        )}

        {tab === "Operating Hours" && (
          <form onSubmit={saveHours} role="tabpanel" aria-label="Operating Hours" className={CARD_CLASS + " mt-[35px] w-full max-w-[725px] px-[17px] py-[23px] sm:px-[27px] sm:py-[29px]"}>
            <h2 className="text-[15px] font-semibold text-[#344862] sm:text-[17px]">Operating Hours</h2>
            <div className="mt-[19px] space-y-[13px]">
              {hours.map((item, index) => (
                <div key={item.day} className="grid grid-cols-[40px_minmax(0,1fr)_65px] items-center gap-[9px] sm:grid-cols-[50px_minmax(0,1fr)_85px] sm:gap-[13px]">
                  <label htmlFor={"opening-" + item.day} className="text-[13px] font-medium text-[#435873] sm:text-[16px]">{item.day}</label>
                  <input
                    id={"opening-" + item.day}
                    value={item.hours}
                    readOnly={!item.open}
                    aria-label={item.day + " operating hours"}
                    onChange={(event) => updateHours(index, event.currentTarget.value)}
                    className={INPUT_CLASS}
                  />
                  <button type="button" onClick={() => toggleDay(index)} aria-label={(item.open ? "Close " : "Open ") + item.day}
                    className={
                      "justify-self-center rounded-full px-[12px] py-[8px] text-[12px] leading-[17px] font-medium sm:px-[14px] sm:text-[14px] " +
                      (item.open ? "bg-[#f0f3f7] text-[#3d506b] hover:bg-[#e8edf4]" : "bg-[#e8faf2] text-[#009c6b] hover:bg-[#daf5e9]")
                    }>
                    {item.open ? "Close" : "Open"}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-[21px] flex justify-end">
              <button type="submit" className={PRIMARY_CLASS}>Save Hours</button>
            </div>
          </form>
        )}

        {tab === "Branch Locations" && (
          <section role="tabpanel" aria-label="Branch Locations" className="mt-[47px] w-full max-w-[740px] space-y-[13px]">
            {branches.map((branch) => (
              <article key={branch.id} className={CARD_CLASS + " flex min-h-[109px] flex-wrap items-center justify-between gap-[10px] px-[16px] py-[17px] sm:px-[21px] sm:py-[20px]"}>
                <div className="min-w-0">
                  <h2 className="text-[14px] font-semibold text-[#25344c] sm:text-[16px]">{branch.name}</h2>
                  <p className="mt-[4px] text-[12px] leading-[18px] text-[#6a82a2] sm:text-[14px]">{branch.address}</p>
                  <p className="mt-[3px] font-mono text-[11px] tracking-[0.3px] text-[#90a6c3] sm:text-[13px]">{branch.phone}</p>
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-[10px]">
                  <span className={"inline-flex items-center gap-[7px] text-[12px] font-medium sm:text-[14px] " + (branch.active ? "text-[#00a474]" : "text-[#8797ae]")}>
                    <span aria-hidden="true" className={"size-[7px] rounded-full " + (branch.active ? "bg-[#0cbb88]" : "bg-[#9aa9bd]")} />
                    {branch.active ? "Active" : "Inactive"}
                  </span>
                  <button type="button" onClick={() => setEditingBranch(branch)} className={SECONDARY_CLASS}>Edit</button>
                </div>
              </article>
            ))}
            <button
              type="button"
              onClick={() => setEditingBranch("new")}
              className="flex min-h-[69px] w-full items-center justify-center rounded-[17px] border border-dashed border-[#cbdbee] bg-transparent px-4 text-[12px] font-medium text-[#8fa6c4] hover:bg-[#f4f8ff] hover:text-[#155eef] sm:text-[15px]"
            >
              + Add Branch Location
            </button>
          </section>
        )}

        {tab === "Security" && (
          <section role="tabpanel" aria-label="Security" className="mt-[42px] w-full max-w-[740px] space-y-[16px]">
            <article className={CARD_CLASS + " flex min-h-[81px] items-center justify-between gap-3 px-[19px] py-[17px] sm:px-[21px]"}>
              <div>
                <h2 className="text-[13px] font-semibold text-[#26354d] sm:text-[15px]">Two-Factor Authentication</h2>
                <p className="mt-[4px] text-[11px] leading-[17px] text-[#7288a7] sm:text-[13px] sm:leading-[19px]">
                  Add an extra layer of security to your account with authenticator app verification.
                </p>
              </div>
              <button type="button" role="switch" aria-checked={previewTwoFactor} aria-label="Two-Factor Authentication preview"
                onClick={() => {
                  setPreviewTwoFactor((value) => !value);
                  setNotice("Preview-only switch. No real two-factor authentication setting was changed.");
                }}
                className={"relative h-[22px] w-[42px] shrink-0 rounded-full transition-colors " + (previewTwoFactor ? "bg-[#08bb81]" : "bg-[#a4b2c6]")}>
                <span className={"absolute top-[3px] size-[16px] rounded-full bg-white shadow-sm transition-all " + (previewTwoFactor ? "left-[23px]" : "left-[3px]")} />
              </button>
            </article>

            <article className={CARD_CLASS + " flex min-h-[81px] items-center justify-between gap-3 px-[19px] py-[17px] sm:px-[21px]"}>
              <div>
                <h2 className="text-[13px] font-semibold text-[#26354d] sm:text-[15px]">Login History</h2>
                <p className="mt-[4px] text-[11px] leading-[17px] text-[#7288a7] sm:text-[13px] sm:leading-[19px]">View recent login activity for your account.</p>
              </div>
              <button type="button" onClick={() => setSecurityDialog("history")} className={SECONDARY_CLASS + " shrink-0"}>View History</button>
            </article>

            <article className={CARD_CLASS + " flex min-h-[81px] items-center justify-between gap-3 px-[19px] py-[17px] sm:px-[21px]"}>
              <div>
                <h2 className="text-[13px] font-semibold text-[#26354d] sm:text-[15px]">Device Management</h2>
                <p className="mt-[4px] text-[11px] leading-[17px] text-[#7288a7] sm:text-[13px] sm:leading-[19px]">Manage trusted devices that are logged in to this account.</p>
              </div>
              <button type="button" onClick={() => setSecurityDialog("devices")} className={SECONDARY_CLASS + " shrink-0"}>Manage Devices</button>
            </article>

            <article className={CARD_CLASS + " px-[19px] py-[19px] sm:px-[21px]"}>
              <h2 className="text-[13px] font-semibold text-[#e1000a] sm:text-[15px]">Logout</h2>
              <p className="mt-[4px] text-[11px] leading-[17px] text-[#7288a7] sm:text-[13px] sm:leading-[19px]">
                Sign out of MedCore Diagnostics on OHealth+. You will need to log back in to continue.
              </p>
              <button type="button" onClick={() => setSecurityDialog("logout")}
                className="mt-[14px] min-h-[36px] rounded-[11px] bg-[#e60012] px-[17px] text-[12px] font-medium text-white hover:bg-[#c70011] sm:text-[14px]">
                Logout
              </button>
            </article>
          </section>
        )}

        <p className="mt-[23px] max-w-[900px] text-[11px] leading-[18px] text-[#99a8bd]">
          Laboratory profile preview using sample information. Save, branch and security interactions do not update a live account.
        </p>
      </div>

      {editingBranch !== null && (
        <BranchDialog
          key={editingBranch === "new" ? "new" : editingBranch.id}
          initial={editingBranch === "new" ? null : editingBranch}
          onClose={() => setEditingBranch(null)}
          onSave={saveBranch}
        />
      )}
      {securityDialog && (
        <SecurityDialog
          kind={securityDialog}
          onClose={() => setSecurityDialog(null)}
          onReturn={() => navigate("/")}
        />
      )}
    </LaboratoryShell>
  );
}
