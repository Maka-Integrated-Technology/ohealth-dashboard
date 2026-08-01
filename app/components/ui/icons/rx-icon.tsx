import type { SVGProps } from "react";

export function RxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#rx-icon-clip)">
        <path
          d="M5.68754 11.1041L11.1042 5.68748C11.3573 5.43944 11.5587 5.14368 11.6968 4.8173C11.8349 4.49093 11.907 4.14042 11.9087 3.78604C11.9105 3.43166 11.8421 3.08044 11.7073 2.75269C11.5725 2.42494 11.374 2.12716 11.1235 1.87657C10.8729 1.62598 10.5751 1.42755 10.2473 1.29276C9.91959 1.15797 9.56837 1.08949 9.21399 1.09128C8.8596 1.09307 8.50909 1.1651 8.18272 1.30319C7.85635 1.44128 7.56059 1.64271 7.31254 1.89582L1.89588 7.31248C1.64277 7.56053 1.44135 7.85629 1.30325 8.18266C1.16516 8.50903 1.09313 8.85954 1.09134 9.21392C1.08955 9.56831 1.15803 9.91953 1.29282 10.2473C1.42761 10.575 1.62604 10.8728 1.87663 11.1234C2.12722 11.374 2.425 11.5724 2.75275 11.7072C3.0805 11.842 3.43172 11.9105 3.7861 11.9087C4.14048 11.9069 4.49099 11.8349 4.81737 11.6968C5.14374 11.5587 5.4395 11.3573 5.68754 11.1041Z"
          stroke="currentColor"
          strokeWidth="1.08333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.604 4.60419L8.39567 8.39585"
          stroke="currentColor"
          strokeWidth="1.08333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="rx-icon-clip">
          <rect width="13" height="13" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
}
