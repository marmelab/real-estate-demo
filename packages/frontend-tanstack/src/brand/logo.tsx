export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 29V14a8 8 0 0 1 16 0v15" />
      <path d="M5 29h22" strokeLinecap="square" />
      <circle cx="16" cy="17" r="2" fill="currentColor" stroke="none" />
      <path d="M15.2 18.4h1.6l.6 4.6h-2.8z" fill="currentColor" stroke="none" />
    </svg>
  );
}
