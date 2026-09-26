import type { Metadata } from "next";
import { Milestone } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SurfacePlaceholder } from "@/components/shell/surface-placeholder";

export const metadata: Metadata = { title: "Goal" };

export default function GoalDetailPage({
  params,
}: {
  params: { goalId: string };
}) {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Journey"
        title="Goal journey"
        description="A single goal, rendered as a calm connected path of milestones."
      />
      <SurfacePlaceholder
        icon={Milestone}
        title="Milestones and next step"
        purpose="This page will show the goal's purpose, target horizon, milestone path, and one clear next step."
        available={`No goal with the id "${params.goalId}" exists yet, because goals are not implemented. It is shown here only to confirm the route resolves.`}
      />
    </div>
  );
}
