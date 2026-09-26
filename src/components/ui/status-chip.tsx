import * as React from "react";
import { cn } from "@/lib/cn";

export type ChipTone = "neutral" | "accent" | "success" | "warning";

const tones: Record<ChipTone, string> = {
  neutral: "border-line-strong bg-surface-subtle text-ink-muted",
  accent: "border-accent/40 bg-accent-wash text-accent-strong",
  success: "border-success/30 bg-surface-subtle text-success",
  warning: "border-warning/30 bg-surface-subtle text-warning",
};

export interface StatusChipProps {
  tone?: ChipTone;
  /** A short dot indicator; status is never conveyed by color alone. */
  withDot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function StatusChip({
  tone = "neutral",
  withDot = false,
  children,
  className,
}: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-supporting font-medium",
        tones[tone],
        className,
      )}
    >
      {withDot ? (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-current"
        />
      ) : null}
      {children}
    </span>
  );
}
