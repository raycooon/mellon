"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, UserRound } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  isActivePath,
  primaryNav,
  secondaryNav,
  type NavItem,
} from "@/lib/navigation";
import { Tooltip } from "@/components/ui/tooltip";
import { IconButton } from "@/components/ui/icon-button";

function Wordmark({ collapsed }: { collapsed: boolean }) {
  return (
    <Link
      href="/"
      className="flex min-h-11 items-center gap-2 rounded-control px-2 focus-visible:outline-none"
      aria-label="Mellon — home"
    >
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control bg-accent-wash text-body font-semibold text-accent-strong"
      >
        M
      </span>
      <span
        className={cn(
          "text-card-title font-semibold text-ink",
          collapsed ? "sr-only" : "sr-only lg:not-sr-only",
        )}
      >
        Mellon
      </span>
    </Link>
  );
}

function NavEntry({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const active = isActivePath(pathname, item.href);
  const Icon = item.icon;
  return (
    <li>
      <Tooltip content={item.label} side="right">
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={cn(
            "relative flex min-h-11 items-center gap-3 rounded-control px-3 text-body motion-control transition-colors",
            active
              ? "bg-accent-wash font-medium text-ink"
              : "text-ink-muted hover:bg-surface-hover hover:text-ink",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-accent transition-opacity",
              active ? "opacity-100" : "opacity-0",
            )}
          />
          <Icon size={20} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
          <span className={collapsed ? "sr-only" : "sr-only lg:not-sr-only"}>
            {item.label}
          </span>
        </Link>
      </Tooltip>
    </li>
  );
}

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export function Sidebar({ collapsed, onToggleCollapsed }: SidebarProps) {
  const labelVisibility = collapsed ? "sr-only" : "sr-only lg:not-sr-only";
  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-line bg-surface md:flex md:w-[76px]",
        collapsed ? "lg:w-[76px]" : "lg:w-[240px]",
        "transition-[width] motion-panel",
      )}
    >
      <div className="flex h-16 items-center px-2">
        <Wordmark collapsed={collapsed} />
      </div>

      <ul className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 pb-4">
        {primaryNav.map((item) => (
          <NavEntry key={item.href} item={item} collapsed={collapsed} />
        ))}

        <li aria-hidden="true" className="my-2 h-px bg-line" />

        {secondaryNav.map((item) => (
          <NavEntry key={item.href} item={item} collapsed={collapsed} />
        ))}
      </ul>

      <div className="border-t border-line p-2">
        <div className="flex items-center gap-2">
          <Tooltip content="Profile and settings" side="right">
            <Link
              href="/settings"
              className="flex min-h-11 flex-1 items-center gap-3 rounded-control px-3 text-body text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink"
            >
              <UserRound size={20} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
              <span className={labelVisibility}>Profile</span>
            </Link>
          </Tooltip>
          <IconButton
            label={collapsed ? "Expand navigation" : "Collapse navigation"}
            size="sm"
            onClick={onToggleCollapsed}
            aria-expanded={!collapsed}
            className="hidden shrink-0 lg:inline-flex"
          >
            {collapsed ? (
              <PanelLeftOpen size={18} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <PanelLeftClose size={18} strokeWidth={1.75} aria-hidden="true" />
            )}
          </IconButton>
        </div>
      </div>
    </nav>
  );
}
