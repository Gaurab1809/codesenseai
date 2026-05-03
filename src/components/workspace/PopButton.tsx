import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "accent";
type Tone = "lime" | "coral" | "violet" | "sky" | "amber";

const TONE_BG: Record<Tone, string> = {
  lime: "bg-[var(--lime)]",
  coral: "bg-[var(--coral)]",
  violet: "bg-[var(--violet)]",
  sky: "bg-[var(--sky)]",
  amber: "bg-[var(--amber)]",
};

export interface PopButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

/**
 * Workspace button with consistent variants that respect light/dark.
 * - primary: solid accent background, dark ink — highest emphasis
 * - accent: same as primary but for tonal CTAs
 * - secondary: card surface, foreground text
 * - ghost: transparent, foreground text
 */
export const PopButton = React.forwardRef<HTMLButtonElement, PopButtonProps>(
  ({ className, variant = "secondary", tone = "lime", size = "md", children, ...props }, ref) => {
    const sizes = {
      sm: "h-8 px-2.5 text-[12px] gap-1.5 rounded-lg",
      md: "h-9 px-3 text-[12.5px] gap-1.5 rounded-xl",
      lg: "h-10 px-4 text-[13px] gap-2 rounded-xl",
    } as const;

    const base =
      "inline-flex items-center justify-center font-semibold border-2 border-foreground transition-all " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-background " +
      "disabled:opacity-60 disabled:pointer-events-none [&_svg]:shrink-0";

    const styles =
      variant === "primary" || variant === "accent"
        ? cn(
            TONE_BG[tone],
            "text-[oklch(0.18_0.02_270)] font-bold shadow-pop",
            "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
          )
        : variant === "secondary"
          ? "bg-card text-foreground hover:bg-subtle active:bg-muted"
          : "bg-transparent text-foreground hover:bg-subtle active:bg-muted";

    return (
      <button ref={ref} className={cn(base, sizes[size], styles, className)} {...props}>
        {children}
      </button>
    );
  },
);
PopButton.displayName = "PopButton";
