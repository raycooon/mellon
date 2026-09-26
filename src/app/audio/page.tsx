import type { Metadata } from "next";
import { AudioLines } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SurfacePlaceholder } from "@/components/shell/surface-placeholder";

export const metadata: Metadata = { title: "Audio" };

export default function AudioPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Build a place to return to"
        description="A simple mixer: a few sounds, kept honest, so a session has somewhere to sit."
      />
      <SurfacePlaceholder
        icon={AudioLines}
        title="Soundscape mixer"
        purpose="The mixer will offer Nature, Noise, Music, and Environments with per-track volume, a master level, and locally saved presets."
        available="No audio sources are bundled yet, so playback is not available. No controls are shown and nothing plays."
      />
    </div>
  );
}
