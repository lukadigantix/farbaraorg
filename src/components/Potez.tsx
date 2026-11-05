// Roze potez četkicom ispod reči u naslovu
export default function Potez({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 16"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute ${className}`}
    >
      <path
        d="M2 14C60 8 170 2 298 2c-68 4-168 9-238 14-20 1-45 0-58-2Z"
        fill="var(--color-roze)"
      />
    </svg>
  );
}
