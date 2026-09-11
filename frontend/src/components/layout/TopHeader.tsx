import { useNavigate } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CollaboratingPartner } from "@/components/common/CollaboratingPartner";
import { Pill } from "@/components/common/StatusBadge";
import { ENVIRONMENT_LABEL } from "@/api/config";
import { usePatients } from "@/hooks/useClinicalQueries";
import { useSession } from "@/hooks/useSession";
import type { Role } from "@/types/clinical";

export function TopHeader() {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: patients = [] } = usePatients();
  const { user, setRole } = useSession();

  const results = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return [];
    return patients
      .filter((p) => p.name.toLowerCase().includes(q) || p.patient_id.toLowerCase().includes(q))
      .slice(0, 6);
  }, [term, patients]);

  const notifications = useMemo(
    () => patients.filter((p) => p.issues_count > 0).slice(0, 5),
    [patients],
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur-md lg:px-6">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          placeholder="Search patients by name or ID…"
          aria-label="Global patient search"
          className="h-10 border-border/80 bg-background/80 pl-9 shadow-none"
        />
        {open && term.trim() ? (
          <div className="absolute left-0 right-0 top-11 overflow-hidden rounded-lg border border-border bg-popover shadow-elevated">
            {results.length === 0 ? (
              <p className="px-3 py-3 text-sm text-muted-foreground">No patients match “{term}”.</p>
            ) : (
              results.map((p) => (
                <button
                  key={p.patient_id}
                  type="button"
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-accent"
                  onMouseDown={() => {
                    setTerm("");
                    setOpen(false);
                    navigate({ to: "/patients/$patientId", params: { patientId: p.patient_id } });
                  }}
                >
                  <span className="font-medium">{p.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{p.patient_id}</span>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden md:block">
          <CollaboratingPartner variant="inline" />
        </div>

        <Pill tone="info" className="hidden sm:inline-flex">
          {ENVIRONMENT_LABEL}
        </Pill>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="size-4" />
              {notifications.length > 0 ? (
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Clinical notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                No flagged issues yet. Run a clinical workflow to generate alerts.
              </p>
            ) : (
              notifications.map((p) => (
                <DropdownMenuItem
                  key={p.patient_id}
                  onSelect={() =>
                    navigate({ to: "/patients/$patientId", params: { patientId: p.patient_id } })
                  }
                >
                  <span className="truncate">
                    {p.issues_count} issue(s) flagged — {p.name}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 gap-2 border-border/80 bg-background/80">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                {user.initials}
              </span>
              <span className="hidden text-sm sm:inline">{user.name}</span>
              <Pill tone="info" className="hidden md:inline-flex">
                {user.role}
              </Pill>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Switch demo role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(["Clinician", "Care Coordinator"] as Role[]).map((role) => (
              <DropdownMenuItem key={role} onSelect={() => setRole(role)}>
                {role}
                {user.role === role ? (
                  <span className="ml-auto text-xs text-muted-foreground">Active</span>
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
