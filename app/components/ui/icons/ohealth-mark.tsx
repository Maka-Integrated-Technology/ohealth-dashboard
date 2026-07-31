import type { SVGProps } from "react";

export function OHealthMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#ohealth-mark-clip)">
        <path
          d="M11.5349 0.0174001L11.5228 5.70713H5.77736V-0.000366211H-0.00195312V5.70713V12.3405C0.88537 11.1261 2.08688 10.1341 3.40194 9.40529C6.97607 7.44086 10.5867 8.30112 11.5228 8.55515V17.1432H17.2911V0.0173994L11.5349 0.0174001Z"
          fill="#155EEF"
        />
        <path
          d="M-0.00195312 17.1539H5.71138C5.71886 15.4439 6.07033 14.1549 6.34922 13.3677C6.72225 12.315 7.1164 11.7387 7.273 11.5186C7.64444 11.002 8.08899 10.5423 8.59268 10.1538C7.97287 10.1538 4.56766 10.2176 2.08226 12.9274C0.613018 14.5295 0.156848 16.302 -0.00195312 17.1539Z"
          fill="#155EEF"
        />
      </g>
      <defs>
        <clipPath id="ohealth-mark-clip">
          <rect width="17.2931" height="17.1542" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}