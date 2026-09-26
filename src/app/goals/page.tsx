import type { Metadata } from "next";
import { Target } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SurfacePlaceholder } from "@/components/shell/surface-placeholder";

export const metadata: Metadata = { title: "Goals" };

export default function GoalsPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Goals"
        description="Long-term goals are journeys, not checklists. This is where daily goals and the journeys behind them live."
      />
      <SurfacePlaceholder
        icon={Target}
        title="Journeys and daily goals"
        purpose="Goals will separate actionable daily goals from long-term journeys, each showing its purpose, current milestone, and next step."
        available="Goal creation and milestone progress are not implemented yet. No example journeys are seeded into this screen."
      />
    </div>
  );
}
