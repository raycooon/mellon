"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/shell/sidebar";
import { MobileNav } from "@/components/shell/mobile-nav";

/**
 * Responsive application frame.
 *
 * - Desktop (lg): 240px collapsible rail, content max width 1160px.
 * - Tablet (md): 76px icon rail.
 * - Mobile: bottom navigation for primary routes, secondary routes in "More".
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-canvas">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
        />

        <div
          className={cn(
            "min-h-screen motion-panel transition-[padding] md:pl-[76px]",
            collapsed ? "lg:pl-[76px]" : "lg:pl-[240px]",
          )}
        >
          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto w-full max-w-content px-5 pb-28 pt-6 md:px-7 md:pb-12 lg:px-10 lg:pt-10"
          >
            {children}
          </main>
        </div>

        <MobileNav />
      </div>
    </TooltipProvider>
  );
}
