import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-medium motion-control " +
  "transition-colors disabled:cursor-not-allowed disabled:opacity-55 " +
  "focus-visible:outline-none";

const variants: Record<ButtonVariant, string> = {
  // White on accent-strong measures 6.0:1 — AA safe for label text.
  primary: "bg-accent-strong text-white hover:bg-accent hover:text-white",
  secondary: "border border-line-strong bg-surface text-ink hover:bg-surface-subtle",
  quiet: "text-ink-muted hover:bg-surface-hover hover:text-ink",
  danger: "border border-line-strong bg-surface text-danger hover:bg-surface-subtle",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-body",
  md: "h-10 px-4 text-body",
  // 44px minimum touch target for primary actions.
  lg: "min-h-11 px-5 text-body",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render as the child element (e.g. a Next.js Link) instead of a button. */
  asChild?: boolean;
  /** Optional reason shown when the button is disabled. */
  disabledReason?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", asChild, disabledReason, ...props },
    ref,
  ) {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        title={props.disabled && disabledReason ? disabledReason : props.title}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  },
);
