import * as React from "react";

export type ProgressiveBlurPosition = "top" | "bottom";

export interface ProgressiveBlurProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Where the blur/gradient fades from.
   * - bottom: blur sits at bottom and fades upward
   * - top: blur sits at top and fades downward
   */
  position?: ProgressiveBlurPosition;
  /** Height of the overlay. Accepts any valid CSS length (e.g. '40%', '120px'). */
  height?: string;
}

/**
 * ProgressiveBlur
 *
 * A lightweight, dependency-free alternative to MagicUI's ProgressiveBlur.
 * It overlays a blurred, theme-aware gradient on the edge of a scroll container.
 */
export const ProgressiveBlur = React.forwardRef<
  HTMLDivElement,
  ProgressiveBlurProps
>(
  (
    { position = "bottom", height = "40%", style, className = "", ...props },
    ref,
  ) => {
    const isBottom = position === "bottom";

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={[
          "pointer-events-none absolute left-0 right-0 z-10",
          isBottom ? "bottom-0" : "top-0",
          className,
        ].join(" ")}
        style={{
          height,
          // Two-layer approach:
          // 1) gradient gives the fade using theme variables
          // 2) backdrop-filter adds the blur to whatever is behind
          background: isBottom
            ? "linear-gradient(to top, var(--bg-page, #ffffff) 10%, rgba(255,255,255,0) 90%)"
            : "linear-gradient(to bottom, var(--bg-page, #ffffff) 10%, rgba(255,255,255,0) 90%)",
          WebkitBackdropFilter: "blur(10px)",
          backdropFilter: "blur(10px)",
          ...style,
        }}
        {...props}
      />
    );
  },
);

ProgressiveBlur.displayName = "ProgressiveBlur";
