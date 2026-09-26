"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";
import { isActivePath, primaryNav, secondaryNav } from "@/lib/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = React.useState(false);
  const moreActive = secondaryNav.some((item) => isActivePath(pathname, item.href));

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {primaryNav.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] motion-control transition-colors",
                  active ? "font-medium text-accent-strong" : "text-ink-muted",
                )}
              >
                <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <Dialog open={moreOpen} onOpenChange={setMoreOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex min-h-[56px] w-full flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] motion-control transition-colors",
                  moreActive ? "font-medium text-accent-strong" : "text-ink-muted",
                )}
                aria-haspopup="dialog"
              >
                <MoreHorizontal size={20} strokeWidth={1.75} aria-hidden="true" />
                More
              </button>
            </DialogTrigger>
            <DialogContent title="More" description="Additional destinations.">
              <ul className="flex flex-col gap-1">
                {secondaryNav.map((item) => {
                  const Icon = item.icon;
                  const active = isActivePath(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setMoreOpen(false)}
                        className={cn(
                          "flex min-h-11 items-center gap-3 rounded-control px-3 text-body transition-colors",
                          active
                            ? "bg-accent-wash font-medium text-ink"
                            : "text-ink-muted hover:bg-surface-hover hover:text-ink",
                        )}
                      >
                        <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                        <span className="flex flex-col">
                          <span>{item.label}</span>
                          <span className="text-supporting text-ink-faint">
                            {item.description}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </DialogContent>
          </Dialog>
        </li>
      </ul>
    </nav>
  );
}
