export default function Logo({
  className = "h-7 w-7",
}: { className?: string }) {
  const RED = "#C51412"; // always red
  return (
    <svg
      viewBox="0 0 512 512"
      aria-label="Royal Arch Seal"
      role="img"
      className={className}
    >
      {/* Outer ring */}
      <circle
        cx="256"
        cy="256"
        r="236"
        fill="none"
        stroke={RED}
        strokeWidth="36"
      />
      {/* Equilateral triangle */}
      <polygon
        points="256,84 84,404 428,404"
        fill="none"
        stroke={RED}
        strokeWidth="28"
        strokeLinejoin="miter"
      />
      {/* Triple Tau */}
      <g fill={RED}>
        {/* Top T bar */}
        <rect x="196" y="180" width="120" height="32" />
        {/* Center post */}
        <rect x="244" y="212" width="24" height="124" />
        {/* H crossbar */}
        <rect x="172" y="300" width="168" height="28" />
        {/* Left/Right legs */}
        <rect x="172" y="272" width="28" height="88" />
        <rect x="340" y="272" width="28" height="88" />
      </g>
    </svg>
  );
}