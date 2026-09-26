import type { Metadata } from "next";
import { Timer } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SurfacePlaceholder } from "@/components/shell/surface-placeholder";

export const metadata: Metadata = { title: "Focus session" };

export default function FocusSessionPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Focus"
        title="Session"
        description="The active session surface: nearly empty, with one clear control."
      />
      <SurfacePlaceholder
        icon={Timer}
        title="Active session"
        purpose="A calm, nearly full-screen view with a timestamp-derived countdown, the selected task, a thin progress indicator, and one primary control."
        available="There is no session running. This page deliberately shows no countdown and no controls, because the timer engine does not exist yet."
      />
    </div>
  );
}
