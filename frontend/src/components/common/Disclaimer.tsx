import { ShieldAlert } from "lucide-react";
import { AI_DISCLAIMER } from "@/api/config";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        {AI_DISCLAIMER}
      </p>
    );
  }
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-warning/35 bg-warning/10 px-4 py-3 text-xs leading-relaxed text-foreground">
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning-foreground" aria-hidden />
      <span>{AI_DISCLAIMER}</span>
    </div>
  );
}