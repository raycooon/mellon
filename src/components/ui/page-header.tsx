import * as React from "react";
import { cn } from "@/lib/cn";

export interface PageHeaderProps {
  /** Small muted line above the title, e.g. a date or section name. */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional actions rendered opposite the title on wide screens. */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Shared page header. The title renders as the page's `h1`, so every route has
 * exactly one top-level heading.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="max-w-[65ch]">
        {eyebrow ? (
          <p className="mb-1 text-supporting font-medium uppercase tracking-wide text-ink-faint">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-page-title font-semibold text-ink">{title}</h1>
        {description ? (
          <p className="mt-2 text-body text-ink-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}
