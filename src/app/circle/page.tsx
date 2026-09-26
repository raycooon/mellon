import type { Metadata } from "next";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SurfacePlaceholder } from "@/components/shell/surface-placeholder";

export const metadata: Metadata = { title: "Circle" };

export default function CirclePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Circle"
        description="A small circle for gentle accountability. Sparse, chronological, and private by default."
      />
      <SurfacePlaceholder
        icon={Users}
        title="Circle activity"
        purpose="Circle will show a short, chronological list of explicitly shared milestones, focus sessions, and reflections from people you choose."
        available="There is no backend configured, so no invites can be sent and no real activity exists. This screen shows nothing rather than simulated people."
      />
    </div>
  );
}
