import { useMemo, useState } from "react";
import { Search, ChevronDown, AlertTriangle } from "lucide-react";
import { Link } from "react-router";
import { LaboratoryShell } from "./laboratory-shell";

type AuditTab = "Audit Logs" | "Compliance Controls" | "Monitoring";
type AuditCategory = "Sample" | "Booking" | "Result" | "Staff" | "Auth";
type AuditLog = {
  timestamp: string;
  user: string;
  action: string;
  record: string;
  category: AuditCategory;
  status: "success" | "warning";
};
const TABS: AuditTab[] = ["Audit Logs", "Compliance Controls", "Monitoring"];

const AUDIT_LOGS: AuditLog[] = [
  { timestamp: "13 Sept, 11:45", user: "Mr. Babatunde Adisa", action: "Updated sample status to 'Under Analysis'", record: "SP-2025-0441", category: "Sample", status: "success" },
  { timestamp: "13 Sept, 11:05", user: "Nurse Kelechi Obi", action: "Marked sample collected for booking", record: "BK-2025-0843", category: "Booking", status: "success" },
  { timestamp: "13 Sept, 10:30", user: "Ms. Tosin Lawal", action: "Patient checked in", record: "BK-2025-0842", category: "Booking", status: "success" },
  { timestamp: "13 Sept, 09:55", user: "System", action: "Appointment reminder sent", record: "BK-2025-0841", category: "Booking", status: "success" },
  { timestamp: "12 Sept, 15:00", user: "Dr. Chiamaka Eze", action: "Result reviewed and approved", record: "RES-2025-0390", category: "Result", status: "success" },
  { timestamp: "12 Sept, 15:30", user: "Dr. Yetunde Afolabi", action: "Result published to patient record", record: "RES-2025-0390", category: "Result", status: "success" },
  { timestamp: "12 Sept, 11:00", user: "Mr. Babatunde Adisa", action: "Result file uploaded", record: "RES-2025-0391", category: "Result", status: "success" },
  { timestamp: "11 Sept, 17:00", user: "Dr. Chiamaka Eze", action: "New staff invitation sent", record: "STF-006", category: "Staff", status: "success" },
  { timestamp: "11 Sept, 16:00", user: "Dr. Chiamaka Eze", action: "Failed login attempt (wrong password)", record: "AUTH", category: "Auth", status: "warning" },
  { timestamp: "10 Sept, 10:00", user: "Ms. Tosin Lawal", action: "Appointment cancelled by patient request", record: "BK-2025-0839", category: "Booking", status: "success" },
];

const CONTROLS = [
  {
    id: "role", icon: "🔒", name: "Role-Based Access Control", status: "Active", warning: false,
    description: "All staff access is controlled via role-based permissions. Admin-only actions require administrator privileges.",
  },
  {
    id: "encryption", icon: "🔐", name: "Encrypted Patient Data", status: "Active", warning: false,
    description: "All patient data is encrypted at rest and in transit using AES-256 and TLS 1.3.",
  },
  {
    id: "storage", icon: "🗄️", name: "Secure Result Storage", status: "Active", warning: false,
    description: "Laboratory results are stored in isolated, access-controlled storage with audit trail.",
  },
  {
    id: "logging", icon: "📝", name: "Access Logging", status: "Active", warning: false,
    description: "All data access events are logged with timestamp, user, and record details.",
  },
  {
    id: "retention", icon: "📅", name: "Data Retention Policies", status: "Review Required", warning: true,
    description: "Patient data retention policy review due in 14 days. Current policy: 7 years for diagnostic records.",
  },
];

const LICENSES = [
  { name: "Laboratory License", issuer: "NAFDAC", expiry: "2026-03-15", status: "Valid", attention: false },
  { name: "Accreditation Certificate", issuer: "MLSCN", expiry: "2026-08-01", status: "Valid", attention: false },
  { name: "CAC Registration", issuer: "CAC Nigeria", expiry: "—", status: "Valid", attention: false },
  { name: "ISO 15189 Compliance", issuer: "SON", expiry: "2025-12-01", status: "Review Due", attention: true },
];

const CATEGORY_STYLES: Record<AuditCategory, string> = {
  Sample: "bg-[#ecf8ff] text-[#0279b8]",
  Booking: "bg-[#edf3ff] text-[#175cff]",
  Result: "bg-[#e6f9f0] text-[#00815b]",
  Staff: "bg-[#f3edff] text-[#7040e6]",
  Auth: "bg-[#fff5e6] text-[#ca5c03]",
};

const RECORD_ROUTES: Partial<Record<AuditCategory, string>> = {
  Sample: "/samples-tests",
  Booking: "/test-bookings",
  Result: "/results",
};

function AuditLogs({ query }: { query: string }) {
  const [localSearch, setLocalSearch] = useState("");
  const [category, setCategory] = useState<AuditCategory | "">("");

  const filtered = useMemo(() => {
    const local = localSearch.trim().toLowerCase();
    const global = query.trim().toLowerCase();
    return AUDIT_LOGS.filter((log) => {
      const text = [log.timestamp, log.user, log.action, log.record, log.category, log.status]
        .join(" ").toLowerCase();
      return (!category || log.category === category) && text.includes(local) && text.includes(global);
    });
  }, [localSearch, category, query]);

  return (
    <section className="mt-[20px] overflow-hidden rounded-[14px] border border-[#dfe6ef] bg-white sm:mt-[31px] sm:rounded-[17px]">
      <div className="flex flex-wrap items-center gap-[10px] px-[12px] py-[12px] sm:gap-[12px] sm:px-[18px] sm:py-[13px]">
        <div className="relative w-full sm:w-[260px]">
          <Search className="pointer-events-none absolute top-[10px] left-[12px] size-[15px] text-[#9aabc0]" aria-hidden="true" />
          <input type="search" aria-label="Search audit logs" placeholder="Search logs..."
            value={localSearch} onChange={(event) => setLocalSearch(event.currentTarget.value)}
            className="h-[35px] w-full rounded-[10px] border border-[#d9e3f0] bg-white pr-3 pl-[35px] text-[12px] text-[#3b506c] outline-none placeholder:text-[#91a6c3] focus:border-[#155eef] focus:ring-2 focus:ring-[#e7efff] sm:text-[13px]" />
        </div>
        <div className="relative w-full sm:w-[174px]">
          <select aria-label="Filter audit logs by category" value={category}
            onChange={(event) => setCategory(event.currentTarget.value as AuditCategory | "")}
            className="h-[35px] w-full appearance-none rounded-[10px] border border-[#d9e3f0] bg-white px-[12px] pr-[34px] text-[12px] text-[#344764] outline-none focus:border-[#155eef] sm:text-[13px]">
            <option value="">All Categories</option>
            {(["Sample", "Booking", "Result", "Staff", "Auth"] as AuditCategory[]).map((item) =>
              <option key={item} value={item}>{item}</option>
            )}
          </select>
          <ChevronDown className="pointer-events-none absolute top-[10px] right-[12px] size-[15px] text-[#304660]" aria-hidden="true" />
        </div>
        <span className="ml-auto text-[11px] text-[#93a7c3]">{filtered.length} {filtered.length === 1 ? "log entry" : "log entries"}</span>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="h-[38px] border-y border-[#e5eaf2] bg-[#f7f9fc] text-[11px] font-semibold tracking-[0.1px] text-[#657a9a]">
              <th scope="col" className="w-[14%] px-[15px]">TIMESTAMP</th>
              <th scope="col" className="w-[18%] px-[15px]">USER</th>
              <th scope="col" className="w-[35%] px-[15px]">ACTION</th>
              <th scope="col" className="w-[14%] px-[15px]">RECORD</th>
              <th scope="col" className="w-[11%] px-[15px]">CATEGORY</th>
              <th scope="col" className="w-[8%] px-[15px]">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log, index) => (
              <tr key={log.timestamp + log.record + index} className="h-[41px] border-b border-[#edf1f6] last:border-b-0 sm:h-[42px]">
                <td className="whitespace-nowrap px-[15px] py-[8px] font-mono text-[11px] text-[#7187a7] sm:text-[12px]">{log.timestamp}</td>
                <td className="px-[15px] py-[8px] text-[12px] text-[#3b4f6d] sm:text-[13px]">{log.user}</td>
                <td className="px-[15px] py-[8px] text-[12px] text-[#536780] sm:text-[13px]">{log.action}</td>
                <td className="whitespace-nowrap px-[15px] py-[8px] font-mono text-[11px] sm:text-[12px]">
                  {RECORD_ROUTES[log.category] ? (
                    <Link className="text-[#155eef] hover:underline" to={RECORD_ROUTES[log.category] ?? "/dashboard"} title="Open the related preview section">{log.record}</Link>
                  ) : (
                    <span className="text-[#155eef]">{log.record}</span>
                  )}
                </td>
                <td className="px-[15px] py-[8px]">
                  <span className={"inline-flex rounded-[8px] px-[7px] py-[3px] text-[10px] leading-[14px] font-medium sm:text-[11px] " + CATEGORY_STYLES[log.category]}>{log.category}</span>
                </td>
                <td className="px-[15px] py-[8px]">
                  <span className={"inline-flex items-center gap-[5px] rounded-[8px] px-[7px] py-[3px] text-[10px] leading-[14px] font-medium sm:text-[11px] " + (log.status === "success" ? "bg-[#e9faf1] text-[#00895f]" : "bg-[#fff7e5] text-[#c46805]")}>
                    <span aria-hidden="true" className={"size-[6px] rounded-full " + (log.status === "success" ? "bg-[#08af80]" : "bg-[#f59e0b]")} />
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-[13px] text-[#7890ab]">
            No audit entries match the search and category.
            <button type="button" onClick={() => { setCategory(""); setLocalSearch(""); }} className="ml-2 font-medium text-[#155eef] hover:underline">Clear filters</button>
          </div>
        )}
      </div>
    </section>
  );
}

function ComplianceControls() {
  return (
    <section className="mt-[20px] grid grid-cols-1 gap-[12px] sm:mt-[36px] sm:grid-cols-2 sm:gap-[13px]">
      {CONTROLS.map((control) => (
        <article key={control.id} className={"flex min-h-[84px] items-start gap-[15px] rounded-[14px] border px-[15px] py-[17px] sm:min-h-[86px] sm:rounded-[15px] sm:px-[18px] sm:py-[18px] " +
          (control.warning ? "border-[#ffd66d] bg-[#fffbea]" : "border-[#dce6f2] bg-white")}>
          <span className="mt-[3px] shrink-0 text-[18px]" aria-hidden="true">{control.icon}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-[6px]">
              <h2 className="text-[12px] leading-[17px] font-semibold text-[#263752] sm:text-[13px]">{control.name}</h2>
              <span className={"inline-flex items-center gap-[6px] rounded-full px-[8px] py-[3px] text-[10px] leading-[13px] font-medium " +
                (control.warning ? "bg-[#fff4d9] text-[#b15d00]" : "bg-[#e7f9f2] text-[#008b66]")}>
                <span className={"size-[5px] rounded-full " + (control.warning ? "bg-[#f39908]" : "bg-[#0aaf84]")} />
                {control.status}
              </span>
            </div>
            <p className="mt-[4px] text-[11px] leading-[16px] text-[#7188a8] sm:text-[12px] sm:leading-[18px]">{control.description}</p>
          </div>
        </article>
      ))}
      <p className="col-span-full mt-[8px] text-[11px] leading-[17px] text-[#91a3ba]">
        Reference-design labels only. Encryption, permissions, access logging, and retention enforcement have not been verified or connected to this preview.
      </p>
    </section>
  );
}

function Monitoring() {
  return (
    <section className="mt-[22px] sm:mt-[49px]">
      <div className="rounded-[14px] border border-[#ffd369] bg-[#fffbec] px-[16px] py-[16px] text-[#ad4d07] sm:px-[19px] sm:py-[17px]">
        <div className="flex items-center gap-[9px]">
          <AlertTriangle className="size-[15px] shrink-0 text-[#ed9200]" fill="#ed9200" stroke="white" strokeWidth={1.8} aria-hidden="true" />
          <strong className="text-[12px] sm:text-[13px]">1 Compliance Alert</strong>
        </div>
        <p className="mt-[9px] text-[11px] leading-[18px] sm:text-[12px] sm:leading-[20px]">
          ISO 15189 compliance re-certification is due on <strong>1 December 2025</strong>. Please submit the required documentation before the deadline to maintain accreditation status.
        </p>
      </div>
      <h2 className="mt-[19px] text-[12px] font-semibold text-[#26364e] sm:text-[13px]">License &amp; Accreditation Status</h2>
      <div className="mt-[11px] grid grid-cols-1 gap-[10px] sm:grid-cols-2 sm:gap-[12px]">
        {LICENSES.map((license) => (
          <article key={license.name} className="flex min-h-[78px] items-start justify-between gap-[10px] rounded-[14px] border border-[#dce6f2] bg-white px-[15px] py-[14px] sm:rounded-[15px] sm:px-[17px]">
            <div className="min-w-0">
              <h3 className="text-[12px] font-semibold text-[#293852] sm:text-[13px]">{license.name}</h3>
              <p className="mt-[4px] text-[11px] text-[#7187a6]">Issuer: {license.issuer}</p>
              <p className="mt-[3px] font-mono text-[10px] text-[#92a7c2] sm:text-[11px]">Expiry: {license.expiry}</p>
            </div>
            <span className={"inline-flex shrink-0 items-center gap-[6px] rounded-full px-[8px] py-[4px] text-[10px] leading-[13px] font-medium " + (license.attention ? "bg-[#fff8e7] text-[#be6700]" : "bg-[#e9faf1] text-[#008961]")}>
              <span className={"size-[6px] rounded-full " + (license.attention ? "bg-[#f59e0b]" : "bg-[#0ab886]")} />
              {license.status}
            </span>
          </article>
        ))}
      </div>
      <p className="mt-[14px] text-[11px] leading-[18px] text-[#879bb8]">
        Historical Figma sample data (2025–2026). These statuses and deadlines are not live accreditation checks; the 1 December 2025 date has passed.
      </p>
    </section>
  );
}

export default function LaboratoryComplianceAndAudit() {
  const [active, setActive] = useState<AuditTab>("Audit Logs");
  const [headerQuery, setHeaderQuery] = useState("");
  return (
    <LaboratoryShell section="Compliance & Audit" search={headerQuery} onSearchChange={setHeaderQuery}>
      <div className="mx-auto w-full max-w-[1500px] px-[15px] pt-[24px] pb-[60px] sm:px-[30px] sm:pt-[45px] sm:pb-[74px]">
        <h1 className="text-[22px] leading-[30px] font-semibold tracking-[-0.4px] text-[#202b3a] sm:text-[29px] sm:leading-[37px] sm:tracking-[-0.5px]">Compliance and Audit</h1>
        <p className="mt-[1px] text-[13px] leading-[20px] text-[#566371] sm:text-[17px] sm:leading-[25px]">
          Activity logs, compliance controls, and licensing status
        </p>
        <div role="tablist" aria-label="Compliance and audit sections" className="mt-[27px] flex gap-[12px] overflow-x-auto border-b border-[#dde5ee] sm:mt-[40px] sm:gap-[25px]">
          {TABS.map((tab) => (
            <button key={tab} type="button" role="tab" aria-selected={active === tab}
              onClick={() => setActive(tab)}
              className={"min-h-[40px] shrink-0 border-b-[2px] px-[10px] text-[12px] font-medium sm:min-h-[42px] sm:px-[14px] sm:text-[13px] " +
                (active === tab ? "border-[#155eef] text-[#155eef]" : "border-transparent text-[#5f7697] hover:text-[#155eef]")}>
              {tab}
            </button>
          ))}
        </div>
        {active === "Audit Logs" && <AuditLogs query={headerQuery} />}
        {active === "Compliance Controls" && <ComplianceControls />}
        {active === "Monitoring" && <Monitoring />}
        <p className="mt-[20px] text-[11px] text-[#95a6ba]">
          Compliance &amp; Audit is a static design preview. Audit entries are examples, not security evidence or a real audit trail.
        </p>
      </div>
    </LaboratoryShell>
  );
}
