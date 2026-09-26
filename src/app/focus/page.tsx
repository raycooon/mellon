import type { Metadata } from "next";
import { Timer } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SurfacePlaceholder } from "@/components/shell/surface-placeholder";

export const metadata: Metadata = { title: "Focus" };

export default function FocusSetupPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Focus"
        description="The quietest surface in Mellon. Set a session and let everything else fall away."
      />
      <SurfacePlaceholder
        icon={Timer}
        title="Session setup"
        purpose="Setup will offer an optional task or goal, duration presets, a soundscape summary, and one dominant Begin focus control."
        available="The focus timer is not implemented yet. No timer is shown and nothing simulates a running session."
      />
    </div>
  );
}
