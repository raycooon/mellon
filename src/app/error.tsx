"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorRoute({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-card border border-line bg-surface p-6 md:p-8">
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-control bg-surface-subtle text-warning"
      >
        <AlertTriangle size={20} strokeWidth={1.75} />
      </span>
      <h1 className="text-page-title font-semibold text-ink">Something went wrong</h1>
      <p className="max-w-[60ch] text-body text-ink-muted">
        This screen could not be displayed. You can try again, or return home. No data
        was changed.
      </p>
      {/* The digest is a safe, non-sensitive reference — never render error.message. */}
      {error.digest ? (
        <p className="text-supporting text-ink-faint">Reference: {error.digest}</p>
      ) : null}
      <Button size="lg" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
