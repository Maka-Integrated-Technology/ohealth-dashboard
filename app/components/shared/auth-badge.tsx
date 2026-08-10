// app/components/shared/auth-badge.tsx
export default function AuthBadge() {
  return (
    <div className="mb-4 flex justify-center">
      <svg
        width="44"
        height="40"
        viewBox="0 0 52 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M26 42S3 29 3 15.5C3 9.15 8.15 4 14.5 4c4.4 0 8.2 2.4 10.5 5.9L26 12l1-2.1C29.3 6.4 33.1 4 37.5 4 43.85 4 49 9.15 49 15.5 49 29 26 42 26 42z"
          fill="#1D4ED8"
        />
        <path
          d="M26 15v14M19 22h14"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
