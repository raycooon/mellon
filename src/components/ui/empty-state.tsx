import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: React.ReactNode;
  /** Optional primary/secondary actions. Only render actions that really work. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Calm empty state. Explains the next step rather than leaving a blank panel.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 rounded-card border border-line bg-surface p-6 md:p-8",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-control bg-accent-wash text-accent-strong"
      >
        <Icon size={20} strokeWidth={1.75} />
      </span>
      <h2 className="text-card-title font-semibold text-ink">{title}</h2>
      <p className="max-w-[60ch] text-body text-ink-muted">{description}</p>
      {children ? <div className="mt-1 flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}
