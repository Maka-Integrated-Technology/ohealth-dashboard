import {
  Bell,
  Check,
  ChevronRight,
  Clock3,
  Edit3,
  KeyRound,
  LockKeyhole,
  Mail,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState, type FormEvent } from "react";

type SettingsTab =
  "account" | "password" | "staff" | "notifications" | "security";
type Account = { name: string; email: string; role: string; hospital: string };
type StaffStatus = "active" | "inactive" | "pending";
type StaffMember = {
  name: string;
  initials: string;
  role: string;
  email: string;
  status: StaffStatus;
  active: string;
};

const sampleAccount: Account = {
  name: "Dr. Alexandra Foster",
  email: "alexandra.foster@stmarys.com",
  role: "Hospital Administrator",
  hospital: "St. Mary's Medical Center",
};

const sampleStaff: StaffMember[] = [
  {
    initials: "SC",
    name: "Dr. Sarah Chen",
    role: "Doctor",
    email: "sarah.chen@stmarys.com",
    status: "active",
    active: "2 minutes ago",
  },
  {
    initials: "JW",
    name: "Dr. James Wilson",
    role: "Doctor",
    email: "james.wilson@stmarys.com",
    status: "active",
    active: "1 hour ago",
  },
  {
    initials: "RT",
    name: "Rebecca Torres",
    role: "Nurse",
    email: "r.torres@stmarys.com",
    status: "active",
    active: "15 minutes ago",
  },
  {
    initials: "MA",
    name: "Mark Anderson",
    role: "Receptionist",
    email: "m.anderson@stmarys.com",
    status: "active",
    active: "30 minutes ago",
  },
  {
    initials: "LP",
    name: "Linda Park",
    role: "Lab Technician",
    email: "l.park@stmarys.com",
    status: "active",
    active: "2 hours ago",
  },
  {
    initials: "TG",
    name: "Thomas Grant",
    role: "Administrator",
    email: "t.grant@stmarys.com",
    status: "inactive",
    active: "3 days ago",
  },
  {
    initials: "ER",
    name: "Dr. Emily Rodriguez",
    role: "Doctor",
    email: "emily.r@stmarys.com",
    status: "active",
    active: "45 minutes ago",
  },
  {
    initials: "CN",
    name: "Chris Nguyen",
    role: "Nurse",
    email: "c.nguyen@stmarys.com",
    status: "pending",
    active: "Invitation sent",
  },
];

const prefTypes = [
  "Cancellations",
  "Verification Updates",
  "New Reviews",
  "System Announcements",
] as const;
type PrefType = (typeof prefTypes)[number];
type Channel = "inApp" | "email";
type Preferences = Record<PrefType, Record<Channel, boolean>>;
const samplePreferences: Preferences = {
  Cancellations: { inApp: true, email: true },
  "Verification Updates": { inApp: true, email: true },
  "New Reviews": { inApp: true, email: false },
  "System Announcements": { inApp: true, email: true },
};

const sections: {
  id: Exclude<SettingsTab, "password">;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "account", label: "Account Information", icon: UserRound },
  { id: "staff", label: "Staff Accounts", icon: Users },
  { id: "notifications", label: "Notification Preferences", icon: Bell },
  { id: "security", label: "Security Settings", icon: ShieldCheck },
];

function PreviewNotice({ message }: { message: string }) {
  return message ? (
    <p
      role="status"
      className="mb-6 rounded-xl border border-[#dbeafe] bg-[#eff4ff] px-5 py-4 text-sm leading-6 text-[#155eef]"
    >
      {message}
    </p>
  ) : null;
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[29px] w-[54px] shrink-0 items-center rounded-full p-[3px] transition-colors ${checked ? "bg-[#0092b8]" : "bg-[#d2d6db]"}`}
    >
      <span
        className={`size-[23px] rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-[25px]" : ""}`}
      />
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-[13px] font-medium text-[#4d5761] sm:text-[15px]">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 block min-h-11 w-full rounded-xl border border-[#d2d6db] px-4 text-[13px] text-[#1f2a37] outline-none focus:border-[#155eef] sm:text-[15px]"
      />
    </label>
  );
}

export default function HospitalSettings() {
  const [tab, setTab] = useState<SettingsTab>("account");
  const [account, setAccount] = useState(sampleAccount);
  const [draft, setDraft] = useState(sampleAccount);
  const [editing, setEditing] = useState(false);
  const [staff, setStaff] = useState(sampleStaff);
  const [inviting, setInviting] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Doctor");
  const [prefs, setPrefs] = useState<Preferences>(samplePreferences);
  const [security, setSecurity] = useState({
    timeout: true,
    login: true,
    ip: false,
  });
  const [notice, setNotice] = useState("");

  const switchTab = (next: SettingsTab) => {
    setTab(next);
    setNotice("");
    setEditing(false);
    setInviting(false);
  };

  const startEdit = () => {
    setDraft({ ...account });
    setEditing(true);
  };
  const saveAccount = () => {
    if (!draft.name.trim() || !draft.email.trim()) {
      setNotice("Please provide a name and an email address.");
      return;
    }
    setAccount({ ...draft });
    setEditing(false);
    setNotice(
      "Account details changed in this local preview only. No account record was updated."
    );
  };
  const inviteStaff = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = inviteName.trim();
    const email = inviteEmail.trim();
    if (!name || !email) return;
    if (
      staff.some((item) => item.email.toLowerCase() === email.toLowerCase())
    ) {
      setNotice("That email address is already in the preview staff list.");
      setInviting(false);
      return;
    }
    setStaff((current) => [
      ...current,
      {
        name,
        email,
        role: inviteRole,
        initials: name
          .split(" ")
          .map((item) => item[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
        status: "pending",
        active: "Preview invitation — not sent",
      },
    ]);
    setInviting(false);
    setInviteName("");
    setInviteEmail("");
    setNotice(
      "Staff member added as pending in this preview only. No invitation email was sent."
    );
  };
  const togglePref = (type: PrefType, channel: Channel, next: boolean) => {
    setPrefs((current) => ({
      ...current,
      [type]: { ...current[type], [channel]: next },
    }));
    setNotice(
      "Notification preferences changed in this preview only. Delivery settings are not connected."
    );
  };
  const toggleSecurity = (key: keyof typeof security, next: boolean) => {
    setSecurity((current) => ({ ...current, [key]: next }));
    setNotice(
      "Security option changed visually for this preview only. No enforcement or security policy was changed."
    );
  };

  return (
    <div className="mx-auto w-full max-w-[1110px] pb-16">
      <div className="mb-10 flex max-w-[883px] items-start gap-3 rounded-xl border border-[#fef0c7] bg-[#fffaeb] px-4 py-3">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-[#b54708]" />
        <div>
          <p className="text-sm font-semibold text-[#92400e]">Under Review</p>
          <p className="text-xs leading-5 text-[#b54708]">
            OHealth is currently reviewing your submitted documents — Figma
            preview status only.
          </p>
        </div>
      </div>
      <h2 className="mb-7 text-[20px] font-semibold text-[#1d293d] sm:text-[26px]">
        Settings
      </h2>
      <div className="grid items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
        <nav
          aria-label="Hospital settings sections"
          className="rounded-[20px] border border-[#f1f5f9] bg-white p-4"
        >
          {sections.map(({ id, label, icon: Icon }) => {
            const selected =
              id === tab || (id === "account" && tab === "password");
            return (
              <button
                key={id}
                type="button"
                aria-current={selected ? "page" : undefined}
                onClick={() => switchTab(id)}
                className={`flex min-h-[50px] w-full items-center gap-3 rounded-[14px] px-4 text-left text-[13px] font-medium sm:text-[16px] ${selected ? "bg-[#eff4ff] text-[#2970ff]" : "text-[#45556c] hover:bg-[#f8fafc]"}`}
              >
                <Icon className="size-5 shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>
        <div className="min-w-0">
          <PreviewNotice message={notice} />
          {tab === "account" ? (
            <section className="rounded-[20px] border border-[#f1f5f9] bg-white p-6 sm:p-8">
              <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-[15px] font-semibold text-[#1d293d] sm:text-[19px]">
                  Account Information
                </h3>
                {!editing ? (
                  <button
                    type="button"
                    onClick={startEdit}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-[#62748e] hover:bg-[#f8fafc]"
                  >
                    <Edit3 className="size-4" />
                    Edit
                  </button>
                ) : null}
              </div>
              {editing ? (
                <div className="space-y-5">
                  <Field
                    label="Full Name"
                    value={draft.name}
                    onChange={(name) =>
                      setDraft((current) => ({ ...current, name }))
                    }
                  />
                  <Field
                    label="Email"
                    value={draft.email}
                    type="email"
                    onChange={(email) =>
                      setDraft((current) => ({ ...current, email }))
                    }
                  />
                  <p className="text-sm text-[#62748e]">Role: {account.role}</p>
                  <p className="text-sm text-[#62748e]">
                    Hospital: {account.hospital}
                  </p>
                  <div className="flex flex-wrap justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="rounded-xl border border-[#d2d6db] px-5 py-2.5 text-[#4d5761]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={saveAccount}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#155eef] px-5 py-2.5 text-white"
                    >
                      <Check className="size-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  {(
                    [
                      ["Full Name", account.name],
                      ["Email", account.email],
                      ["Role", account.role],
                      ["Hospital", account.hospital],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[14px] text-[#6c737f]">{label}</dt>
                      <dd className="mt-2 text-[13px] font-medium break-words text-[#1f2a37] sm:text-[16px]">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className="mt-8 border-t border-[#e2e8f0] pt-6">
                <button
                  type="button"
                  onClick={() => switchTab("password")}
                  className="flex w-full items-center justify-between text-left font-semibold text-[#155eef]"
                >
                  <span className="inline-flex items-center gap-2">
                    <KeyRound className="size-5" />
                    Password &amp; Security
                  </span>
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </section>
          ) : null}
          {tab === "password" ? (
            <section className="rounded-[20px] border border-[#f1f5f9] bg-white p-6 sm:p-8">
              <button
                type="button"
                onClick={() => switchTab("account")}
                className="mb-6 text-sm font-medium text-[#155eef] hover:underline"
              >
                ← Account Information
              </button>
              <h3 className="mb-7 text-[15px] font-semibold text-[#1d293d] sm:text-[19px]">
                Change Password
              </h3>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setNotice(
                    "Password updates require live authentication and are unavailable in this preview. No password was sent or saved."
                  );
                  event.currentTarget.reset();
                }}
                className="max-w-[500px] space-y-5"
              >
                {[
                  "Current Password",
                  "New Password",
                  "Confirm New Password",
                ].map((name) => (
                  <label
                    key={name}
                    className="block text-[13px] font-medium text-[#4d5761] sm:text-[15px]"
                  >
                    {name}
                    <input
                      required
                      type="password"
                      autoComplete={
                        name === "Current Password"
                          ? "current-password"
                          : "new-password"
                      }
                      className="mt-2 block min-h-11 w-full rounded-xl border border-[#d2d6db] px-4 outline-none focus:border-[#155eef]"
                    />
                  </label>
                ))}
                <button
                  type="submit"
                  className="rounded-xl bg-[#155eef] px-5 py-3 font-medium text-white"
                >
                  Update Password
                </button>
              </form>
              <div className="mt-8 border-t border-[#e2e8f0] pt-7">
                <h4 className="mb-4 text-[14px] font-semibold text-[#1d293d] sm:text-[17px]">
                  Two-Factor Authentication
                </h4>
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#f8fafc] p-5">
                  <div>
                    <p className="font-semibold text-[#1f2a37]">
                      2FA via Authenticator App
                    </p>
                    <p className="mt-2 text-sm text-[#6c737f]">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setNotice(
                        "Authenticator enrollment is not available in this preview; two-factor authentication was not enabled."
                      )
                    }
                    className="rounded-xl border border-[#d2d6db] px-5 py-2.5 font-medium text-[#155eef]"
                  >
                    Enable
                  </button>
                </div>
              </div>
            </section>
          ) : null}
          {tab === "staff" ? (
            <section className="min-w-0">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-[15px] font-semibold text-[#1d293d] sm:text-[19px]">
                  Staff Accounts
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setInviting(true);
                    setNotice("");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2970ff] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  <Plus className="size-4" />
                  Invite Staff
                </button>
              </div>
              <div className="overflow-x-auto rounded-[19px] border border-[#f1f5f9] bg-white">
                <table className="w-full min-w-[650px] border-collapse text-left">
                  <thead className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[13px] font-semibold tracking-wide text-[#90a1b9] uppercase">
                    <tr>
                      <th className="px-5 py-4">Name</th>
                      <th className="px-4 py-4">Role</th>
                      <th className="px-4 py-4">Email</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {staff.map((member) => (
                      <tr key={member.email}>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-xs font-semibold text-[#155eef]">
                              {member.initials}
                            </span>
                            <span className="text-[14px] font-medium text-[#1f2a37]">
                              {member.name}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[14px] text-[#4d5761]">
                          {member.role}
                        </td>
                        <td className="px-4 py-4 text-[14px] text-[#4d5761]">
                          {member.email}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${member.status === "active" ? "bg-[#ecfdf3] text-[#067647]" : member.status === "pending" ? "bg-[#fffbeb] text-[#b54708]" : "bg-[#f1f5f9] text-[#62748e]"}`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[13px] text-[#62748e]">
                          {member.active}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {inviting ? (
                <form
                  onSubmit={inviteStaff}
                  className="mt-6 rounded-[20px] border border-[#e2e8f0] bg-white p-4 sm:p-6"
                >
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <h4 className="text-[14px] font-semibold text-[#1d293d] sm:text-[18px]">
                      Invite Staff
                    </h4>
                    <button
                      type="button"
                      aria-label="Close invite form"
                      onClick={() => setInviting(false)}
                    >
                      <X className="size-5 text-[#6c737f]" />
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Full Name"
                      value={inviteName}
                      onChange={setInviteName}
                    />
                    <Field
                      label="Email"
                      value={inviteEmail}
                      onChange={setInviteEmail}
                      type="email"
                    />
                    <label className="block text-[13px] font-medium text-[#4d5761] sm:text-[15px]">
                      Role
                      <select
                        value={inviteRole}
                        onChange={(event) => setInviteRole(event.target.value)}
                        className="mt-2 block min-h-11 w-full rounded-xl border border-[#d2d6db] bg-white px-4 text-[#1f2a37]"
                      >
                        {[
                          "Doctor",
                          "Nurse",
                          "Receptionist",
                          "Lab Technician",
                          "Administrator",
                        ].map((role) => (
                          <option key={role}>{role}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <p className="mt-4 text-xs text-[#62748e]">
                    This adds a pending preview row; no invitation email will be
                    sent.
                  </p>
                  <div className="mt-5 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setInviting(false)}
                      className="rounded-xl border border-[#d2d6db] px-4 py-2.5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#155eef] px-4 py-2.5 font-semibold text-white"
                    >
                      Add Preview Staff
                    </button>
                  </div>
                </form>
              ) : null}
            </section>
          ) : null}
          {tab === "notifications" ? (
            <section className="rounded-[20px] border border-[#f1f5f9] bg-white p-6 sm:p-8">
              <h3 className="mb-6 text-[15px] font-semibold text-[#1d293d] sm:text-[19px]">
                Notification Preferences
              </h3>
              <div className="overflow-x-auto rounded-[19px] border border-[#f1f5f9]">
                <table className="w-full min-w-[450px] border-collapse text-left">
                  <thead className="bg-[#f8fafc] text-[13px] font-semibold tracking-wide text-[#90a1b9] uppercase">
                    <tr>
                      <th className="px-5 py-4">Notification Type</th>
                      <th className="px-5 py-4 text-center">In-App</th>
                      <th className="px-5 py-4 text-center">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f8fafc]">
                    {prefTypes.map((type) => (
                      <tr key={type}>
                        <th
                          scope="row"
                          className="px-5 py-5 text-[13px] font-normal text-[#314158] sm:text-[16px]"
                        >
                          {type}
                        </th>
                        {(["inApp", "email"] as const).map((channel) => (
                          <td key={channel} className="px-5 py-5 text-center">
                            <Switch
                              checked={prefs[type][channel]}
                              onChange={(next) =>
                                togglePref(type, channel, next)
                              }
                              label={`${type} ${channel === "inApp" ? "in-app" : "email"} notifications`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-5 text-sm text-[#6c737f]">
                Preferences only change in this preview; notification delivery
                is not configured.
              </p>
            </section>
          ) : null}
          {tab === "security" ? (
            <section className="rounded-[20px] border border-[#f1f5f9] bg-white p-6 sm:p-8">
              <h3 className="mb-6 text-[15px] font-semibold text-[#1d293d] sm:text-[19px]">
                Security Settings
              </h3>
              <div className="space-y-4">
                {(
                  [
                    [
                      "timeout",
                      "Session Timeout",
                      "Automatically sign out after 30 minutes of inactivity.",
                      Clock3,
                    ],
                    [
                      "login",
                      "Login Notifications",
                      "Send an email when a new login is detected.",
                      Mail,
                    ],
                    [
                      "ip",
                      "IP Restriction",
                      "Restrict access to specific IP addresses.",
                      Shield,
                    ],
                  ] as const
                ).map(([key, title, description, Icon]) => (
                  <div
                    key={key}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-[16px] bg-[#f8fafc] p-5"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <Icon className="mt-0.5 size-5 shrink-0 text-[#62748e]" />
                      <div>
                        <h4 className="text-[13px] font-semibold text-[#1f2a37] sm:text-[16px]">
                          {title}
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-[#6c737f]">
                          {description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={security[key]}
                      onChange={(next) => toggleSecurity(key, next)}
                      label={title}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-6 text-[#b54708]">
                <LockKeyhole className="mr-2 inline size-4" />
                Security controls are visual previews only. Changes do not
                affect authentication, IP access, email, or session behavior.
              </p>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
