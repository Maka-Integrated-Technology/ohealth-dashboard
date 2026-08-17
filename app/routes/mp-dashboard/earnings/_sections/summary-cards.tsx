import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import type { EarningsSummary } from "~/features/earnings/types";
import { cn } from "~/lib/utils/helpers";
import { formatNairaParts } from "./_primitives";

type SummaryCardsProps = {
  summary?: EarningsSummary;
  isLoading: boolean;
};

function WalletIcon() {
  return (
    <svg
      width="37"
      height="38"
      viewBox="0 0 37 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="36.6693" height="37.9985" rx="18.3346" fill="#EFF4FF" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.7219 19.3335C20.5841 18.9435 20.3287 18.6058 19.9909 18.367C19.6531 18.1281 19.2496 17.9999 18.8359 18V17.5H17.8359V18C17.3055 18 16.7968 18.2107 16.4217 18.5858C16.0467 18.9609 15.8359 19.4696 15.8359 20C15.8359 20.5304 16.0467 21.0391 16.4217 21.4142C16.7968 21.7893 17.3055 22 17.8359 22V24C17.4009 24 17.0304 23.7225 16.8924 23.3335C16.872 23.2699 16.8389 23.211 16.7953 23.1603C16.7517 23.1097 16.6983 23.0683 16.6384 23.0386C16.5785 23.0089 16.5133 22.9916 16.4465 22.9875C16.3798 22.9835 16.3129 22.9929 16.2499 23.0152C16.1869 23.0375 16.1289 23.0721 16.0795 23.1172C16.0301 23.1622 15.9903 23.2167 15.9623 23.2775C15.9343 23.3382 15.9188 23.4039 15.9167 23.4707C15.9146 23.5376 15.9259 23.6041 15.9499 23.6665C16.0878 24.0565 16.3432 24.3942 16.681 24.633C17.0187 24.8719 17.4223 25.0001 17.8359 25V25.5H18.8359V25C19.3664 25 19.8751 24.7893 20.2502 24.4142C20.6252 24.0391 20.8359 23.5304 20.8359 23C20.8359 22.4696 20.6252 21.9609 20.2502 21.5858C19.8751 21.2107 19.3664 21 18.8359 21V19C19.0427 18.9999 19.2445 19.064 19.4134 19.1834C19.5822 19.3027 19.71 19.4715 19.7789 19.6665C19.8231 19.7915 19.9151 19.8939 20.0348 19.9511C20.094 19.9795 20.1583 19.9958 20.2238 19.9993C20.2894 20.0028 20.355 19.9934 20.4169 19.9715C20.4789 19.9496 20.5359 19.9158 20.5847 19.8719C20.6335 19.828 20.6732 19.7749 20.7016 19.7157C20.7299 19.6564 20.7463 19.5922 20.7498 19.5266C20.7533 19.461 20.7438 19.3954 20.7219 19.3335ZM17.8359 19C17.5707 19 17.3164 19.1054 17.1288 19.2929C16.9413 19.4804 16.8359 19.7348 16.8359 20C16.8359 20.2652 16.9413 20.5196 17.1288 20.7071C17.3164 20.8946 17.5707 21 17.8359 21V19ZM18.8359 24C19.1012 24 19.3555 23.8946 19.543 23.7071C19.7306 23.5196 19.8359 23.2652 19.8359 23C19.8359 22.7348 19.7306 22.4804 19.543 22.2929C19.3555 22.1054 19.1012 22 18.8359 22V24Z"
        fill="#004EEB"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.9124 11.3105C14.1394 10.71 16.1524 10 18.3554 10C20.5124 10 22.4724 10.6805 23.6929 11.273L23.7619 11.3065C24.1299 11.4885 24.4269 11.6605 24.6359 11.8L22.7889 14.5C27.0469 18.853 30.3359 27.9985 18.3554 27.9985C6.37493 27.9985 9.57543 19.019 13.8704 14.5L12.0354 11.8C12.1769 11.7075 12.3564 11.6 12.5704 11.486C12.6764 11.429 12.7904 11.3702 12.9124 11.3105ZM21.6019 14.4645L23.0804 12.303C21.7054 12.402 20.0694 12.725 18.4944 13.181C17.3694 13.506 16.1194 13.4565 14.9619 13.243C14.6702 13.189 14.3805 13.1246 14.0934 13.05L15.0534 14.4635C17.1109 15.196 19.5439 15.196 21.6019 14.4645ZM14.4759 15.315C16.8834 16.245 19.7769 16.245 22.1844 15.314C23.1891 16.3736 24.0297 17.5774 24.6784 18.8855C25.3544 20.2645 25.7224 21.643 25.6624 22.831C25.6044 23.9775 25.1534 24.957 24.1234 25.685C23.0499 26.4435 21.2444 26.9985 18.3549 26.9985C15.4624 26.9985 13.6484 26.453 12.5649 25.703C11.5274 24.9845 11.0719 24.018 11.0074 22.887C10.9399 21.712 11.2999 20.3405 11.9734 18.952C12.6159 17.628 13.5124 16.3535 14.4759 15.315ZM13.9009 11.958C14.3009 12.077 14.7189 12.1805 15.1429 12.259C16.2179 12.457 17.2959 12.486 18.2159 12.2195C19.288 11.9071 20.3784 11.6614 21.4809 11.484C20.5609 11.207 19.4849 11 18.3549 11C16.6324 11 15.0259 11.4805 13.9009 11.958Z"
        fill="#004EEB"
      />
    </svg>
  );
}

function CalendarCheckIcon() {
  return (
    <svg
      width="37"
      height="37"
      viewBox="0 0 37 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="37"
        height="37"
        rx="18.5"
        fill="#D1FADF"
        fillOpacity="0.76"
      />
      <path
        d="M21.9 13.4C21.9 11.7969 21.9 10.9962 21.4019 10.4981C20.9038 10 20.1031 10 18.5 10C16.8969 10 16.0962 10 15.5981 10.4981C15.1 10.9962 15.1 11.7969 15.1 13.4M10 20.2C10 16.9947 10 15.3916 10.9962 14.3962C11.9924 13.4009 13.5947 13.4 16.8 13.4H20.2C23.4054 13.4 25.0084 13.4 26.0038 14.3962C26.9991 15.3924 27 16.9947 27 20.2C27 23.4054 27 25.0084 26.0038 26.0038C25.0076 26.9991 23.4054 27 20.2 27H16.8C13.5947 27 11.9916 27 10.9962 26.0038C10.0008 25.0076 10 23.4054 10 20.2Z"
        stroke="#039855"
        strokeWidth="1.5"
      />
      <path
        d="M19.7749 20.2008H17.2249M18.4999 18.9258V21.4758"
        stroke="#039855"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18.4999 23.6008C20.3776 23.6008 21.8999 22.0785 21.8999 20.2008C21.8999 18.323 20.3776 16.8008 18.4999 16.8008C16.6221 16.8008 15.0999 18.323 15.0999 20.2008C15.0999 22.0785 16.6221 23.6008 18.4999 23.6008Z"
        stroke="#039855"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ReceiptTextIcon() {
  return (
    <svg
      width="36"
      height="38"
      viewBox="0 0 36 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="36" height="37.7778" rx="18" fill="#FDEAD7" />
      <path
        d="M24.2222 17.5556V17.1111C24.2222 13.7591 24.2222 12.0827 23.1804 11.0418C22.1387 10.0009 20.4631 10 17.1111 10C13.7591 10 12.0827 10 11.0418 11.0418C10.0009 12.0836 10 13.7591 10 17.1111V21.1111C10 24.0329 10 25.4942 10.8071 26.4782C10.9553 26.6584 11.1194 26.8225 11.2996 26.9707C12.2844 27.7778 13.744 27.7778 16.6667 27.7778M13.5556 14.4444H20.6667M13.5556 18H17.1111"
        stroke="#E04F16"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.3333 24.6662L22 24.1773V21.9996M18 23.7773C18 24.3026 18.1035 24.8228 18.3045 25.3081C18.5055 25.7934 18.8001 26.2343 19.1716 26.6058C19.543 26.9772 19.984 27.2718 20.4693 27.4729C20.9546 27.6739 21.4747 27.7773 22 27.7773C22.5253 27.7773 23.0454 27.6739 23.5307 27.4729C24.016 27.2718 24.457 26.9772 24.8284 26.6058C25.1999 26.2343 25.4945 25.7934 25.6955 25.3081C25.8965 24.8228 26 24.3026 26 23.7773C26 22.7165 25.5786 21.6991 24.8284 20.9489C24.0783 20.1988 23.0609 19.7773 22 19.7773C20.9391 19.7773 19.9217 20.1988 19.1716 20.9489C18.4214 21.6991 18 22.7165 18 23.7773Z"
        stroke="#E04F16"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-7 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-40 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const cards = [
    {
      icon: WalletIcon,
      label: "Monthly Earnings",
      amount: summary.monthlyEarnings,
      hint: `+${summary.monthlyEarningsPercentChange}%`,
      hintClass: "bg-[#edf3ff] text-primary",
    },
    {
      icon: CalendarCheckIcon,
      label: "Completed Consultations",
      value: summary.completedConsultations.toString(),
      hint: `+${summary.consultationsChange} this month`,
      hintClass: "bg-[#e9fbf2] text-[#009d58]",
    },
    {
      icon: ReceiptTextIcon,
      label: "Pending Payouts",
      amount: summary.pendingPayouts,
      hint: `${summary.pendingTransactions} transactions`,
      hintClass: "bg-[#fff0e8] text-[#ff5b1a]",
    },
  ];

  return (
    <div className="grid gap-7 md:grid-cols-3">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="border-border h-40 gap-0 rounded-2xl border py-0 shadow-none ring-0"
        >
          <CardContent className="flex h-full flex-col items-start px-6 py-6">
            <div className="flex size-9 items-center justify-center">
              <card.icon />
            </div>

            <div className="mt-5 flex items-center gap-2">
              {card.amount !== undefined ? (
                <p className="text-foreground text-[28px] leading-none font-bold tracking-[-0.02em]">
                  {formatNairaParts(card.amount).whole}
                  <span className="text-muted-foreground ml-0.5 text-[16px]">
                    {formatNairaParts(card.amount).fraction}
                  </span>
                </p>
              ) : (
                <p className="text-foreground text-[28px] leading-none font-bold">
                  {card.value}
                </p>
              )}

              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] leading-none font-medium",
                  card.hintClass
                )}
              >
                {card.hint}
              </span>
            </div>

            <p className="text-muted-foreground mt-3 text-sm font-medium">
              {card.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
