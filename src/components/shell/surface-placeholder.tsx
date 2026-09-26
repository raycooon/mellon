import type { LucideIcon } from "lucide-react";
import { StatusChip } from "@/components/ui/status-chip";

export interface SurfacePlaceholderProps {
  icon: LucideIcon;
  /** What this surface will do. */
  title: string;
  /** One sentence describing the surface's purpose. */
  purpose: string;
  /** What is genuinely available today. */
  available?: string;
}

/**
 * Explicit "not yet functional" panel. Used during phased construction so that
 * scaffolding never presents fake controls or simulated data as working
 * features. No buttons are rendered because none of the actions work yet.
 */
export function SurfacePlaceholder({
  icon: Icon,
  title,
  purpose,
  available,
}: SurfacePlaceholderProps) {
  return (
    <section
      aria-labelledby={`placeholder-${title.replace(/\s+/g, "-").toLowerCase()}`}
      className="rounded-card border border-dashed border-line-strong bg-surface p-6 md:p-8"
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-surface-subtle text-ink-muted"
        >
          <Icon size={20} strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id={`placeholder-${title.replace(/\s+/g, "-").toLowerCase()}`}
              className="text-card-title font-semibold text-ink"
            >
              {title}
            </h2>
            <StatusChip tone="neutral">Not yet available</StatusChip>
          </div>
          <p className="mt-2 max-w-[65ch] text-body text-ink-muted">{purpose}</p>
          <p className="mt-2 max-w-[65ch] text-body text-ink-muted">
            {available ??
              "This surface is scaffolded but not functional yet. It is built in a later phase, and nothing here simulates progress or data."}
          </p>
        </div>
      </div>
    </section>
  );
}
