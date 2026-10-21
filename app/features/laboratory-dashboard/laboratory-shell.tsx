import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronDown, LayoutGrid, Menu, Search, X } from "lucide-react";

type NavEntry = { label: string; icon: string; href?: string };
const NAV_ITEMS: NavEntry[] = [
  { label: "Overview", icon: "overview", href: "/dashboard" },
  { label: "Test Bookings", icon: "📅", href: "/test-bookings" },
  { label: "Samples & Tests", icon: "🧪" },
  { label: "Results", icon: "📋" },
  { label: "External Results", icon: "🗂️" },
  { label: "Test Catalogue", icon: "📁" },
  { label: "Notifications", icon: "🔔" },
  { label: "Reports & Analytics", icon: "📊" },
  { label: "Laboratory Profile", icon: "🏥" },
  { label: "Staff Management", icon: "👥" },
  { label: "Compliance & Audit", icon: "🛡️" },
];

export function LaboratoryShell({
  section,
  children,
  search,
  onSearchChange,
}: {
  section: string;
  children: ReactNode;
  search?: string;
  onSearchChange?: (value: string) => void;
}) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [showAlerts, setShowAlerts] = useState(false);
  const [readAlerts, setReadAlerts] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const openSection = (label: string) => {
    setMobileOpen(false);
    setShowAlerts(false);
    if (label === "Notifications") {
      setShowAlerts(true);
      setNotice("");
    } else {
      setNotice(label + " is not included in the current laboratory preview.");
    }
  };

  const sidebar = (
    <aside
      className={
        "flex h-full shrink-0 flex-col border-r border-[#e9edf3] bg-white " +
        "w-[222px]"
      }
    >
      <Link
        to="/dashboard"
        onClick={() => setMobileOpen(false)}
        className={
          "flex shrink-0 items-center border-b border-[#e9edf3] " +
          "h-[64px] px-[18px] sm:h-[78px] sm:px-[22px]"
        }
        aria-label="OHealth+ laboratory overview"
      >
        <img
          src="/icons/ohealth-plus-mark.svg"
          alt=""
          width="23"
          height="23"
          className="shrink-0"
        />
        <span className="ml-1.5 text-[14px] font-semibold tracking-[-0.5px] whitespace-nowrap text-[#151b26] sm:text-[15px]">
          OHealth+
        </span>
      </Link>
      <nav
        className={
          "flex flex-1 flex-col overflow-y-auto " +
          "gap-[11px] px-[16px] py-[16px] sm:gap-[13px] sm:px-[21px] sm:py-[20px]"
        }
        aria-label="Laboratory navigation"
      >
        {NAV_ITEMS.map((item) => {
          const selected = section === item.label;
          const navContent = (
            <>
              {item.icon === "overview" ? (
                <LayoutGrid className="size-[15px] shrink-0" strokeWidth={2} />
              ) : (
                <span
                  aria-hidden="true"
                  className="w-[16px] shrink-0 text-center text-[13px] leading-none"
                >
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
            </>
          );
          const className =
            "flex h-[40px] min-h-[40px] w-full items-center gap-[8px] rounded-[8px] px-[12px] text-left text-[12px] tracking-[-0.2px] transition-colors sm:h-[43px] sm:min-h-[43px] sm:px-[13px] sm:text-[14px] " +
            (selected
              ? "bg-[#f1f5fc] font-medium text-[#155eef]"
              : "text-[#101828] hover:bg-[#f5f7fb]");
          return item.href ? (
            <Link
              key={item.label}
              to={item.href}
              className={className}
              onClick={() => {
                setMobileOpen(false);
                setNotice("");
              }}
            >
              {navContent}
            </Link>
          ) : (
            <button
              key={item.label}
              type="button"
              className={className}
              onClick={() => openSection(item.label)}
            >
              {navContent}
            </button>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-sans text-[#192334]">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        {sidebar}
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div className={"relative h-full shadow-xl " + "w-[222px]"}>
            {sidebar}
          </div>
        </div>
      )}
      <div className={"min-h-screen lg:pl-[222px]"}>
        <header
          className={
            "sticky top-0 z-30 flex h-[64px] items-center gap-4 border-b border-[#ebedf1] bg-white px-[16px] sm:h-[78px] sm:px-[26px]"
          }
        >
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center justify-center rounded-md p-1.5 text-[#23324b] lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <h2 className="min-w-0 flex-1 text-[16px] font-semibold text-[#202b3a]">
            <span className="sr-only">{section}</span>
          </h2>
          <div className="relative hidden w-[327px] shrink-0 items-center text-[#7386a4] md:flex">
            <Search
              className="pointer-events-none absolute left-[14px] size-[15px]"
              strokeWidth={1.9}
            />
            <input
              type="search"
              aria-label="Search patients and appointments"
              placeholder="Search patients, appointments..."
              value={search ?? ""}
              onChange={(event) => onSearchChange?.(event.currentTarget.value)}
              className="h-[34px] w-full rounded-[8px] border border-[#e1e7f0] bg-[#f8fafc] pr-3 pl-[37px] text-[14px] text-[#263b59] outline-none placeholder:text-[#617594] focus:border-[#97b8f7]"
            />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-[21px] sm:ml-10">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowAlerts((value) => !value);
                  setShowProfile(false);
                }}
                aria-label="Notifications"
                aria-expanded={showAlerts}
                className="relative flex size-[26px] items-center justify-center text-[16px] sm:text-[18px]"
              >
                <span aria-hidden="true">🔔</span>
                {!readAlerts && (
                  <span className="absolute -top-[3px] -right-[5px] flex size-[14px] items-center justify-center rounded-full bg-[#f72e49] text-[9px] font-bold text-white">
                    4
                  </span>
                )}
              </button>
              {showAlerts && (
                <div className="absolute top-10 right-[-38px] z-40 w-[290px] rounded-xl border border-[#e9edf3] bg-white p-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm">Notifications</strong>
                    <button
                      type="button"
                      onClick={() => setShowAlerts(false)}
                      aria-label="Close notifications"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <p className="mt-3 text-[13px] leading-5 text-[#65758d]">
                    {readAlerts
                      ? "All preview notifications marked as read."
                      : "4 unread preview notifications. No live notification service is connected."}
                  </p>
                  {!readAlerts && (
                    <button
                      type="button"
                      onClick={() => setReadAlerts(true)}
                      className="mt-3 text-xs font-semibold text-[#155eef]"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowProfile((value) => !value);
                  setShowAlerts(false);
                }}
                aria-expanded={showProfile}
                className="flex min-w-0 items-center gap-[10px] text-left"
              >
                <span className="flex size-[23px] shrink-0 items-center justify-center rounded-full bg-[#155eef] text-[9px] font-bold text-white">
                  CE
                </span>
                <span className="hidden max-w-[85px] flex-col md:flex">
                  <span className="truncate text-[10px] leading-[14px] font-semibold text-[#23324b]">
                    MedCore Diagn...
                  </span>
                  <span className="truncate text-[8px] leading-[12px] text-[#94a3b8]">
                    Lab Administrator
                  </span>
                </span>
                <ChevronDown className="hidden size-[11px] text-[#9aabc3] md:block" />
              </button>
              {showProfile && (
                <div className="absolute top-10 right-0 z-40 w-[225px] rounded-xl border border-[#e9edf3] bg-white p-4 shadow-xl">
                  <strong className="text-sm">MedCore Diagnostics</strong>
                  <p className="mt-1 text-xs text-[#7890aa]">
                    Lab Administrator · Preview
                  </p>
                  <button
                    type="button"
                    className="mt-3 text-xs font-medium text-[#155eef]"
                    onClick={() => navigate("/")}
                  >
                    Return to sign in
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        {notice && (
          <div
            role="status"
            className="mx-5 mt-4 flex items-center justify-between gap-3 rounded-lg border border-[#dbeafe] bg-[#eff6ff] px-4 py-2.5 text-xs text-[#1d4ed8] sm:mx-10"
          >
            <span>{notice}</span>
            <button
              type="button"
              aria-label="Dismiss message"
              onClick={() => setNotice("")}
            >
              <X className="size-4" />
            </button>
          </div>
        )}
        <main>{children}</main>
      </div>
    </div>
  );
}
