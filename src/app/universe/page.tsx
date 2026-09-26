import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SurfacePlaceholder } from "@/components/shell/surface-placeholder";

export const metadata: Metadata = { title: "Universe" };

export default function UniversePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Universe"
        description="Your real progress, rendered as a quiet landscape that starts nearly empty."
      />
      <SurfacePlaceholder
        icon={Sparkles}
        title="Your world"
        purpose="The world will be drawn from actual completed activity: structures that map back to a named goal or event, with a text alternative beside them."
        available="There is no world to show yet, because no progress exists. No decorative scenery is drawn, and nothing implies achievements you have not earned."
      />
    </div>
  );
}
