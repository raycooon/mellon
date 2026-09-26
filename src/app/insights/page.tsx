import type { Metadata } from "next";
import { LineChart } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SurfacePlaceholder } from "@/components/shell/surface-placeholder";

export const metadata: Metadata = { title: "Insights" };

export default function InsightsPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Insights"
        description="A private weekly reflection: what moved, what helped, and what to change next week."
      />
      <SurfacePlaceholder
        icon={LineChart}
        title="Weekly reflection"
        purpose="Insights will show focus time, completed tasks, and consistency for the week, with explicit denominators and one reflection prompt."
        available="No week has been recorded yet. Nothing is charted here, and there is no productivity score."
      />
    </div>
  );
}
