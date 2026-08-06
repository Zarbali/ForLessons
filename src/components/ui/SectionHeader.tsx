import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl space-y-2", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className="font-display text-xs font-semibold tracking-[0.22em] uppercase text-[var(--brand)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-balance text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="text-pretty text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
