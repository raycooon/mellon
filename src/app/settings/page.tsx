import type { Metadata } from "next";
import { Settings as SettingsIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SurfacePlaceholder } from "@/components/shell/surface-placeholder";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Settings"
        description="Profile, preferences, privacy, and control over your data."
      />
      <SurfacePlaceholder
        icon={SettingsIcon}
        title="Profile and data"
        purpose="Settings will hold your profile, week start, timezone, reduced-motion and sound preferences, privacy defaults, and local data export or reset."
        available="Nothing is stored yet. This screen will state your actual storage mode (local, in this browser) once persistence exists."
      />
    </div>
  );
}
