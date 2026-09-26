import type { Metadata } from "next";
import { Sun } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SurfacePlaceholder } from "@/components/shell/surface-placeholder";

export const metadata: Metadata = { title: "Home" };

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Today"
        title="How am I doing today?"
        description="A two-second read on today: the next useful action, your progress, and the journey you are building."
      />
      <SurfacePlaceholder
        icon={Sun}
        title="Today"
        purpose="Home will show today's short task list, one dominant next action, progress derived from your own records, and a single long-term journey preview."
        available="Nothing is shown yet because tasks and progress are not implemented. This page intentionally contains no simulated numbers and no controls that do not work."
      />
    </div>
  );
}
