import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "brand" | "cyan" | "muted" | "warning";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

const variants: Record<BadgeVariant, string> = {
  default: "bg-[var(--surface-elevated)] text-[var(--foreground)] border border-[var(--border)]",
  brand: "bg-[color-mix(in_oklab,var(--brand)_18%,transparent)] text-[var(--brand)] border border-[color-mix(in_oklab,var(--brand)_30%,transparent)]",
  cyan: "bg-[color-mix(in_oklab,var(--accent-cyan)_18%,transparent)] text-[var(--accent-cyan)] border border-[color-mix(in_oklab,var(--accent-cyan)_30%,transparent)]",
  muted: "bg-[var(--muted)] text-[var(--muted-foreground)] border border-transparent",
  warning: "bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/25",
};

export function Badge({ children, className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
