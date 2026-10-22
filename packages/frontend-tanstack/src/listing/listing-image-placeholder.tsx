export function ListingImagePlaceholder({ className }: { className: string }) {
  return (
    <div
      role="img"
      aria-label="No photo available"
      className={`flex items-center justify-center bg-gray-200 text-gray-400 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-12"
        aria-hidden="true"
      >
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9v12h14V9" />
        <path d="M10 21v-6h4v6" />
      </svg>
    </div>
  );
}
