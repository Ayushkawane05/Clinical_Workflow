import teleglobalLogo from "@/assets/partners/teleglobal-logo.webp";
import { cn } from "@/lib/utils";

type Variant = "sidebar" | "footer" | "inline" | "auth";

export function CollaboratingPartner({
  variant = "footer",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  if (variant === "sidebar") {
    return (
      <div
        className={cn(
          "rounded-lg border border-sidebar-border bg-surface-muted/60 px-3 py-2.5",
          className,
        )}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Collaborating partner
        </p>
        <div className="mt-2 flex items-center gap-2.5">
          <img
            src={teleglobalLogo}
            alt="Teleglobal Internationals"
            className="h-8 w-auto max-w-[140px] object-contain object-left"
          />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-xs font-semibold text-foreground">Teleglobal Internationals</p>
            <p className="truncate text-[10px] text-muted-foreground">Cloud · AI · Clinical IT</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground sm:inline">
          Partner
        </span>
        <img
          src={teleglobalLogo}
          alt="Teleglobal Internationals — collaborating partner"
          className="h-7 w-auto max-w-[120px] object-contain"
        />
      </div>
    );
  }

  if (variant === "auth") {
    return (
      <div className={cn("border-t border-border pt-4", className)}>
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          In collaboration with
        </p>
        <div className="mt-3 flex flex-col items-center gap-2">
          <img
            src={teleglobalLogo}
            alt="Teleglobal Internationals"
            className="h-10 w-auto max-w-[180px] object-contain"
          />
          <p className="text-xs font-medium text-foreground">Teleglobal Internationals</p>
        </div>
      </div>
    );
  }

  return (
    <footer
      className={cn(
        "mt-auto border-t border-border bg-surface/80 px-4 py-3 backdrop-blur-sm lg:px-8",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          ClinicalFlow AI · Secure clinical workflow assistant
        </p>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Collaborating partner
          </span>
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5">
            <img
              src={teleglobalLogo}
              alt="Teleglobal Internationals"
              className="h-6 w-auto max-w-[110px] object-contain"
            />
            <span className="hidden text-xs font-medium text-foreground sm:inline">
              Teleglobal Internationals
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
