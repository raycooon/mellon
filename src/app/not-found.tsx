import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4 rounded-card border border-line bg-surface p-6 md:p-8">
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-control bg-accent-wash text-accent-strong"
      >
        <Compass size={20} strokeWidth={1.75} />
      </span>
      <h1 className="text-page-title font-semibold text-ink">Nothing here</h1>
      <p className="max-w-[60ch] text-body text-ink-muted">
        That page does not exist. Return home to see where you are today.
      </p>
      <Button asChild size="lg">
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  );
}
