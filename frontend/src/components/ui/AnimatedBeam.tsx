import * as React from "react";

export interface AnimatedBeamProps {
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  /**
   * Curvature in px. Positive bends downward, negative bends upward.
   * 0 draws a straight-ish quadratic curve.
   */
  curvature?: number;
  /** Optional y-offset applied to the target point */
  endYOffset?: number;
  /** Optional x-offset applied to the target point */
  endXOffset?: number;
  /** Reverse the animation direction */
  reverse?: boolean;
  /** Stroke width */
  strokeWidth?: number;
  /**
   * Beam color (fallbacks to brand primary).
   * Tip: use `rgba()` for subtlety.
   */
  color?: string;
  /** How long a full animation loop lasts (seconds). */
  duration?: number;
  /** Additional class names on the SVG */
  className?: string;
}

function getCenterRelativeToContainer(
  container: HTMLElement,
  el: HTMLElement,
): { x: number; y: number } {
  const c = container.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return {
    x: r.left - c.left + r.width / 2,
    y: r.top - c.top + r.height / 2,
  };
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  endYOffset = 0,
  endXOffset = 0,
  reverse = false,
  strokeWidth = 2,
  color,
  duration = 3,
  className = "",
}) => {
  const [path, setPath] = React.useState<string>("");
  const id = React.useId();

  const recompute = React.useCallback(() => {
    const container = containerRef.current;
    const fromEl = fromRef.current;
    const toEl = toRef.current;
    if (!container || !fromEl || !toEl) return;

    const from = getCenterRelativeToContainer(container, fromEl);
    const toBase = getCenterRelativeToContainer(container, toEl);
    const to = { x: toBase.x + endXOffset, y: toBase.y + endYOffset };

    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;

    // Control point is pushed along the perpendicular direction for a nice bend.
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.max(1, Math.hypot(dx, dy));

    const nx = -dy / len;
    const ny = dx / len;

    const cx = midX + nx * curvature;
    const cy = midY + ny * curvature;

    setPath(`M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`);
  }, [containerRef, fromRef, toRef, curvature, endYOffset, endXOffset]);

  React.useEffect(() => {
    recompute();

    const onResize = () => recompute();
    window.addEventListener("resize", onResize);

    // Track layout changes in the container (scroll/resize/content changes)
    const ro = containerRef.current
      ? new ResizeObserver(() => recompute())
      : null;
    if (ro && containerRef.current) ro.observe(containerRef.current);

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", recompute, { passive: true });
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (container) container.removeEventListener("scroll", recompute);
      ro?.disconnect();
    };
  }, [recompute, containerRef]);

  if (!path) return null;

  const stroke = color ?? "var(--brand-primary)";

  // Underlay line + animated dash overlay for a clean “beam” feel.
  return (
    <svg
      className={["pointer-events-none absolute inset-0", className].join(" ")}
      width="100%"
      height="100%"
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-grad`} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={stroke} stopOpacity="0" />
          <stop offset="50%" stopColor={stroke} stopOpacity="0.85" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeOpacity={0.2}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      <path
        d={path}
        fill="none"
        stroke={`url(#${id}-grad)`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray="8 10"
      >
        <animate
          attributeName="stroke-dashoffset"
          from={reverse ? 0 : 100}
          to={reverse ? 100 : 0}
          dur={`${duration}s`}
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
};
