import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required accessible name for icon-only controls. */
  label: string;
  size?: "sm" | "md";
  variant?: "quiet" | "secondary";
  asChild?: boolean;
}

/**
 * Icon-only control. `label` is mandatory because an icon alone is never a
 * sufficient accessible name.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { className, label, size = "md", variant = "quiet", asChild, children, ...props },
    ref,
  ) {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        aria-label={label}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-control motion-control " +
            "transition-colors disabled:cursor-not-allowed disabled:opacity-55",
          size === "sm" ? "h-8 w-8" : "h-11 w-11",
          variant === "quiet"
            ? "text-ink-muted hover:bg-surface-hover hover:text-ink"
            : "border border-line bg-surface text-ink-muted hover:bg-surface-subtle hover:text-ink",
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
