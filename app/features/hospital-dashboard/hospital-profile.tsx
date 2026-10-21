import {
  Building2,
  type LucideIcon,
  Check,
  Clock3,
  Contact,
  Edit3,
  Hospital,
  MapPin,
  Plus,
  ShieldCheck,
  Stethoscope,
  Trash2,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

type HospitalProfileData = {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  emergencyPhone: string;
  hours: { label: string; opens: string; closes: string }[];
  departments: string[];
  services: string[];
};

const sampleProfile: HospitalProfileData = {
  name: "St. Mary's Medical Center",
  description:
    "A premier full-service hospital providing comprehensive medical care with state-of-the-art facilities and a dedicated team of specialists.",
  address: "1247 Medical Center Drive, Rumuokoro, Port harcourt, Rivers",
  phone: "+234 12345678",
  email: "info@stmarysmedical.com",
  website: "www.stmarysmedical.com",
  emergencyPhone: "+234 5555-0911",
  hours: [
    { label: "Monday–Friday", opens: "7:00 AM", closes: "8:00 PM" },
    { label: "Saturday", opens: "8:00 AM", closes: "5:00 PM" },
    { label: "Sunday", opens: "9:00 AM", closes: "3:00 PM" },
    { label: "Emergency", opens: "24 / 7", closes: "" },
  ],
  departments: [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "General Medicine",
    "Dermatology",
    "Oncology",
    "Radiology",
  ],
  services: [
    "ICU",
    "Emergency Department",
    "Surgical Suite",
    "Radiology & Imaging",
    "Laboratory",
    "Pharmacy",
    "Physical Therapy",
    "Cafeteria",
  ],
};

function SectionCard({
  title,
  icon: Icon,
  children,
  onEdit,
  editing,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  onEdit?: () => void;
  editing?: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-[#f1f5f9] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f1f5f9] px-6 py-6 sm:px-[30px]">
        <h3 className="flex items-center gap-[15px] text-[21px] leading-[30px] font-semibold text-[#1f2a37]">
          <Icon className="size-6 text-[#45556c]" strokeWidth={1.8} />
          {title}
        </h3>
        {!editing && onEdit ? (
          <button
            onClick={onEdit}
            type="button"
            className="flex items-center gap-2 rounded-xl border border-[#e2e8f0] px-[18px] py-[9px] text-[17px] text-[#62748e] hover:bg-[#f8fafc]"
          >
            <Edit3 className="size-[18px]" />
            Edit
          </button>
        ) : null}
      </div>
      <div className="p-6 sm:p-[30px]">{children}</div>
    </section>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[17px] leading-[25px] font-medium text-[#6c737f]">
        {label}
      </dt>
      <dd className="mt-[3px] text-[20px] leading-[30px] font-medium text-[#1f2a37]">
        {value}
      </dd>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  const classes =
    "mt-2 block w-full rounded-xl border border-[#d2d6db] bg-white px-4 py-3 text-[17px] text-[#1f2a37] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20";
  return (
    <label className="block text-[16px] font-medium text-[#4d5761]">
      {label}
      {multiline ? (
        <textarea
          rows={3}
          className={classes}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={classes}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

function EditableTags({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [newItem, setNewItem] = useState("");
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-2.5 text-[16px] text-[#45556c]"
          >
            {item}
            <button
              type="button"
              aria-label={`Remove ${item}`}
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="rounded-full p-1 hover:bg-[#fef3f2]"
            >
              <X className="size-4" />
            </button>
          </span>
        ))}
      </div>
      <form
        className="mt-4 flex flex-wrap gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = newItem.trim();
          if (
            trimmed &&
            !items.some((item) => item.toLowerCase() === trimmed.toLowerCase())
          ) {
            onChange([...items, trimmed]);
            setNewItem("");
          }
        }}
      >
        <input
          aria-label={`New ${label.toLowerCase()}`}
          placeholder={`Add ${label.toLowerCase()}…`}
          value={newItem}
          onChange={(event) => setNewItem(event.target.value)}
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-[#d2d6db] px-4"
        />
        <button
          type="submit"
          disabled={!newItem.trim()}
          className="inline-flex items-center gap-2 rounded-xl border border-[#d2d6db] px-5 text-[#155eef] disabled:opacity-40"
        >
          <Plus className="size-4" />
          Add
        </button>
      </form>
    </div>
  );
}

function cloneProfile(data: HospitalProfileData): HospitalProfileData {
  return {
    ...data,
    hours: data.hours.map((item) => ({ ...item })),
    departments: [...data.departments],
    services: [...data.services],
  };
}

export default function HospitalProfile() {
  const [profile, setProfile] = useState<HospitalProfileData>(sampleProfile);
  const [draft, setDraft] = useState<HospitalProfileData>(
    cloneProfile(sampleProfile)
  );
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [hourLabel, setHourLabel] = useState("");

  const startEdit = () => {
    setDraft(cloneProfile(profile));
    setEditing(true);
    setNotice("");
  };
  const updateDraft = <K extends keyof HospitalProfileData>(
    key: K,
    value: HospitalProfileData[K]
  ) => setDraft((current) => ({ ...current, [key]: value }));
  const cancelEdit = () => {
    setEditing(false);
    setDraft(cloneProfile(profile));
  };
  const saveEdit = () => {
    if (!draft.name.trim() || !draft.email.trim()) {
      setNotice("Hospital name and email are required.");
      return;
    }
    setProfile(cloneProfile(draft));
    setEditing(false);
    setNotice(
      "Changes saved in this local preview only. Public profile updates require OHealth approval."
    );
  };

  return (
    <div className="mx-auto w-full max-w-[1082px] pb-14 lg:pt-[110px]">
      {editing ? (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6">
          <div>
            <h2 className="text-[24px] font-semibold text-[#1f2a37]">
              Edit Hospital Profile
            </h2>
            <p className="mt-1 flex items-start gap-2 text-sm text-[#6c737f]">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" />
              This change requires OHealth approval before it becomes publicly
              visible.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center gap-2 rounded-xl border border-[#d2d6db] px-5 py-3 text-[#4d5761]"
            >
              <X className="size-4" />
              Cancel
            </button>
            <button
              type="button"
              onClick={saveEdit}
              className="inline-flex items-center gap-2 rounded-xl bg-[#155eef] px-5 py-3 font-medium text-white"
            >
              <Check className="size-4" />
              Save Changes
            </button>
          </div>
        </div>
      ) : null}
      {notice ? (
        <div
          role="status"
          className={`mb-7 rounded-xl px-5 py-4 text-sm ${notice.startsWith("Changes") ? "bg-[#eff4ff] text-[#155eef]" : "bg-[#fef3f2] text-[#b42318]"}`}
        >
          {notice}
        </div>
      ) : null}
      <div className="space-y-[62px]">
        <SectionCard
          title="Basic Information"
          icon={Building2}
          editing={editing}
          onEdit={startEdit}
        >
          {editing ? (
            <div className="grid gap-6">
              <EditableField
                label="Hospital Name"
                value={draft.name}
                onChange={(value) => updateDraft("name", value)}
              />
              <EditableField
                label="Description"
                value={draft.description}
                multiline
                onChange={(value) => updateDraft("description", value)}
              />
              <EditableField
                label="Address"
                value={draft.address}
                onChange={(value) => updateDraft("address", value)}
              />
            </div>
          ) : (
            <dl className="grid gap-6">
              <ProfileField label="Hospital Name" value={profile.name} />
              <ProfileField label="Description" value={profile.description} />
              <ProfileField label="Address" value={profile.address} />
            </dl>
          )}
        </SectionCard>
        <SectionCard
          title="Contact Information"
          icon={Contact}
          editing={editing}
          onEdit={startEdit}
        >
          {editing ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <EditableField
                label="Phone"
                value={draft.phone}
                onChange={(value) => updateDraft("phone", value)}
              />
              <EditableField
                label="Email"
                value={draft.email}
                onChange={(value) => updateDraft("email", value)}
              />
              <EditableField
                label="Website"
                value={draft.website}
                onChange={(value) => updateDraft("website", value)}
              />
              <EditableField
                label="Emergency Contact"
                value={draft.emergencyPhone}
                onChange={(value) => updateDraft("emergencyPhone", value)}
              />
            </div>
          ) : (
            <dl className="grid gap-6 sm:grid-cols-2">
              <ProfileField label="Phone" value={profile.phone} />
              <ProfileField label="Email" value={profile.email} />
              <ProfileField label="Website" value={profile.website} />
              <ProfileField
                label="Emergency Contact"
                value={profile.emergencyPhone}
              />
            </dl>
          )}
        </SectionCard>
        <SectionCard
          title="Operating Hours"
          icon={Clock3}
          editing={editing}
          onEdit={startEdit}
        >
          {editing ? (
            <div>
              <div className="mb-3 grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-sm text-[#6c737f]">
                <span>Day / Period</span>
                <span>Opens</span>
                <span>Closes</span>
                <span> </span>
              </div>
              {draft.hours.map((hour, index) => (
                <div
                  key={index}
                  className="mb-3 grid grid-cols-[1fr_1fr_1fr_auto] gap-2"
                >
                  <input
                    aria-label={`Period ${index + 1}`}
                    value={hour.label}
                    onChange={(event) =>
                      updateDraft(
                        "hours",
                        draft.hours.map((item, i) =>
                          i === index
                            ? { ...item, label: event.target.value }
                            : item
                        )
                      )
                    }
                    className="min-w-0 rounded-lg border border-[#d2d6db] p-2"
                  />
                  <input
                    aria-label={`Opening time ${index + 1}`}
                    value={hour.opens}
                    onChange={(event) =>
                      updateDraft(
                        "hours",
                        draft.hours.map((item, i) =>
                          i === index
                            ? { ...item, opens: event.target.value }
                            : item
                        )
                      )
                    }
                    className="min-w-0 rounded-lg border border-[#d2d6db] p-2"
                  />
                  <input
                    aria-label={`Closing time ${index + 1}`}
                    value={hour.closes}
                    onChange={(event) =>
                      updateDraft(
                        "hours",
                        draft.hours.map((item, i) =>
                          i === index
                            ? { ...item, closes: event.target.value }
                            : item
                        )
                      )
                    }
                    placeholder="Closed"
                    className="min-w-0 rounded-lg border border-[#d2d6db] p-2"
                  />
                  <button
                    type="button"
                    aria-label={`Remove ${hour.label}`}
                    onClick={() =>
                      updateDraft(
                        "hours",
                        draft.hours.filter((_, i) => i !== index)
                      )
                    }
                    className="rounded-lg p-2 text-[#d92d20]"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              <form
                className="mt-3 flex gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (hourLabel.trim()) {
                    updateDraft("hours", [
                      ...draft.hours,
                      { label: hourLabel.trim(), opens: "", closes: "" },
                    ]);
                    setHourLabel("");
                  }
                }}
              >
                <input
                  aria-label="Add a day or period"
                  placeholder="Add a day or period…"
                  value={hourLabel}
                  onChange={(event) => setHourLabel(event.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-[#d2d6db] px-4 py-3"
                />
                <button
                  type="submit"
                  disabled={!hourLabel.trim()}
                  className="rounded-xl border border-[#d2d6db] px-5 text-[#155eef] disabled:opacity-40"
                >
                  Add
                </button>
              </form>
            </div>
          ) : (
            <dl className="divide-y divide-[#f1f5f9]">
              {profile.hours.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 text-[20px] text-[#1f2a37]"
                >
                  <dt>{item.label}</dt>
                  <dd className="font-medium">
                    {item.closes
                      ? `${item.opens} – ${item.closes}`
                      : item.opens}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </SectionCard>
        <SectionCard
          title="Departments"
          icon={Stethoscope}
          editing={editing}
          onEdit={startEdit}
        >
          {editing ? (
            <EditableTags
              label="Department"
              items={draft.departments}
              onChange={(items) => updateDraft("departments", items)}
            />
          ) : (
            <ul className="grid list-none gap-5 sm:grid-cols-2">
              {profile.departments.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-3 text-[19px] text-[#1f2a37]"
                >
                  <span className="size-2 rounded-full bg-[#155eef]" />
                  {name}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
        <SectionCard
          title="Facilities & Services"
          icon={Hospital}
          editing={editing}
          onEdit={startEdit}
        >
          {editing ? (
            <EditableTags
              label="Service"
              items={draft.services}
              onChange={(items) => updateDraft("services", items)}
            />
          ) : (
            <ul className="grid list-none gap-5 sm:grid-cols-2">
              {profile.services.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-3 text-[19px] text-[#1f2a37]"
                >
                  <span className="size-2 rounded-full bg-[#155eef]" />
                  {name}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
      <div className="mt-12 flex items-center gap-3 border-t border-[#e5e7eb] py-8 text-[#4d5761]">
        <div className="flex size-12 items-center justify-center rounded-xl bg-[#eff4ff] text-[#155eef]">
          <MapPin className="size-5" />
        </div>
        <div>
          <p className="font-semibold text-[#1f2a37]">{profile.name}</p>
          <p className="text-sm">Hospital Administrator · Preview profile</p>
        </div>
      </div>
    </div>
  );
}
