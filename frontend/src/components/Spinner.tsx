import React from "react";

type SpinnerProps = {
  size?: number; // px
  thickness?: number; // stroke width
  label?: string; // accessible label
};

const Spinner: React.FC<SpinnerProps> = ({ size = 48, thickness = 4, label = "Loading" }) => {
  const half = size / 2;
  const radius = half - thickness;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex items-center justify-center"
      style={{ height: size, width: size }}
    >
      {/* Scoped keyframes and styles so you don't need to modify global CSS */}
      <style>{`
        @keyframes spinPremium {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes dashPremium {
          0% { stroke-dasharray: 1, ${circumference}; stroke-dashoffset: 0; }
          50% { stroke-dasharray: ${circumference * 0.7}, ${circumference}; stroke-dashoffset: -${circumference * 0.15}; }
          100% { stroke-dasharray: 1, ${circumference}; stroke-dashoffset: -${circumference}; }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(${half - 6}px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(${half - 6}px) rotate(-360deg); }
        }
      `}</style>

      <svg
        viewBox={`0 0 ${size} ${size}`}
        height={size}
        width={size}
        style={{ display: "block", overflow: "visible", animation: "spinPremium 1.6s linear infinite" }}
      >
        {/* subtle track */}
        <circle
          cx={half}
          cy={half}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={thickness}
        />

        {/* glowing gold arc (animated dash) */}
        <defs>
          <linearGradient id="goldGrad" x1="0%" x2="100%">
            <stop offset="0%" stopColor="var(--gold-soft, #e6c76a)" />
            <stop offset="60%" stopColor="var(--gold-primary, #d4af37)" />
            <stop offset="100%" stopColor="var(--gold-muted, #a88f2d)" />
          </linearGradient>

          {/* subtle blur for glow (optional if supported) */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={half}
          cy={half}
          r={radius}
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.25} ${circumference}`}
          strokeDashoffset="0"
          style={{
            transformOrigin: "center",
            filter: "url(#softGlow)",
            animation: "dashPremium 1.6s ease-in-out infinite",
          }}
        />

        {/* orbiting dot for extra polish */}
        <g style={{ transformOrigin: "center" }}>
          <g style={{ animation: `orbit 1.6s linear infinite` as any }}>
            <circle
              cx={half}
              cy={half - radius}
              r={Math.max(2, thickness - 1)}
              fill="var(--gold-primary)"
              style={{ mixBlendMode: "screen", filter: "blur(0.2px)" }}
            />
          </g>
        </g>
      </svg>

      {/* screen reader only */}
      <span className="sr-only" aria-hidden="false">{label}</span>
    </div>
  );
};

export default Spinner;
