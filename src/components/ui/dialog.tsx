"use client";

import * as React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixDialog.Content> {
  title: string;
  description?: string;
}

/**
 * Accessible dialog. Radix handles focus trapping, scroll locking, Escape, and
 * focus restoration. The title is required so the dialog always has an
 * accessible name.
 */
export function DialogContent({
  className,
  children,
  title,
  description,
  ...props
}: DialogContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-50 bg-ink/30 motion-panel data-[state=open]:animate-fade-in" />
      <RadixDialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2",
          "overflow-y-auto rounded-panel border border-line bg-surface p-6 shadow-floating motion-panel",
          "focus:outline-none",
          className,
        )}
        {...props}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <RadixDialog.Title className="text-section font-semibold text-ink">
              {title}
            </RadixDialog.Title>
            {description ? (
              <RadixDialog.Description className="mt-1 text-body text-ink-muted">
                {description}
              </RadixDialog.Description>
            ) : null}
          </div>
          <RadixDialog.Close
            aria-label="Close dialog"
            className="-mr-1 -mt-1 inline-flex h-9 w-9 items-center justify-center rounded-control text-ink-muted hover:bg-surface-subtle hover:text-ink"
          >
            <X size={20} strokeWidth={1.75} aria-hidden="true" />
          </RadixDialog.Close>
        </div>
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
