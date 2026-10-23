import { Activity } from "lucide-react";
import Logo from "~/components/shared/logo";

const FEATURES = [
  { value: "12,400+", description: "Tests processed monthly" },
  { value: "340+", description: "Partner laboratories" },
  { value: "99.8%", description: "Result accuracy rate" },
  { value: "< 4h", description: "Average turnaround time" },
];

export default function LaboratoryAuthHero() {
  return (
      <aside
        className="relative isolate overflow-hidden bg-[#001338] px-6 py-7 text-white sm:px-10 sm:py-10 lg:flex lg:min-h-screen lg:flex-col lg:px-16 lg:py-14"
        style={{
          backgroundImage:
            "linear-gradient(-34.22046568354368deg, rgb(0, 53, 158) 4.8884%, rgb(0, 19, 56) 106.65%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,1) 0.15%, transparent 0.15%), linear-gradient(90deg, rgba(255,255,255,1) 0.14%, transparent 0.14%)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex items-center lg:absolute lg:top-14 lg:left-16">
          <Logo size="auth" variant="light" />
        </div>

        <div className="relative z-10 max-w-xl py-9 lg:absolute lg:top-[270px] lg:left-16 lg:w-[586px] lg:py-0">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100">
            <Activity className="size-3.5" />
            Laboratory workspace
          </div>
          <h1 className="max-w-lg font-sans text-4xl leading-[1.25] font-bold tracking-tight">
            <span className="block text-white">Your laboratory,</span>
            <span className="block text-[#51a2ff]">connected.</span>
          </h1>
          <p className="mt-4 max-w-[384px] text-base leading-[26px] text-[#90a1b9]">
            Manage diagnostic operations, track test results, and connect with
            healthcare professionals on OHealth+.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {FEATURES.map((feature) => (
              <div
                className="min-h-[72px] rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur-sm"
                key={feature.value}
              >
                <p className="text-[18px] leading-7 font-semibold text-white">
                  {feature.value}
                </p>
                <p className="mt-1 text-xs leading-4 text-[#90a1b9]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>


  );
}
