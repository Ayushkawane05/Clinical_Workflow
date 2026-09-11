import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  ClipboardList,
  FileClock,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Send,
  Settings,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";
import { CollaboratingPartner } from "@/components/common/CollaboratingPartner";
import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, exact: true },
  { label: "Patients", to: "/patients", icon: Users, exact: false },
  { label: "Workflow Monitor", to: "/workflows", icon: Activity, exact: false },
  { label: "Referrals", to: "/referrals", icon: Send, exact: false },
  { label: "Specialists", to: "/specialists", icon: Stethoscope, exact: false },
  { label: "Referral Rules", to: "/rules", icon: ClipboardList, exact: false },
  { label: "Audit Trail", to: "/audit", icon: FileClock, exact: false },
  { label: "Settings", to: "/settings", icon: Settings, exact: false },
] as const;

export function AppSidebar() {
  const { user, signOut } = useSession();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <HeartPulse className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="text-sm font-semibold tracking-tight text-foreground">ClinicalFlow AI</p>
            <p className="text-[11px] text-muted-foreground">Clinical care workspace</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Clinical navigation
        </p>
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-sm ring-1 ring-primary/15"
                  : "text-sidebar-foreground hover:bg-surface-muted hover:text-foreground",
              )}
            >
              <item.icon
                className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground")}
                aria-hidden
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border px-3 py-3">
        <CollaboratingPartner variant="sidebar" />

        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {user.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.role}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            aria-label="Log out"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            <LogOut className="size-4" aria-hidden />
          </button>
        </div>
        <p className="flex items-center gap-1.5 px-2 text-[11px] text-muted-foreground">
          <UserRound className="size-3" aria-hidden />
          Cognito-ready session (mock)
        </p>
      </div>
    </aside>
  );
}
