import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Activity, AlertTriangle, Send, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/common/KpiCard";
import { Disclaimer } from "@/components/common/Disclaimer";
import { EmptyState } from "@/components/common/EmptyState";
import { ReferralStatusBadge, SeverityBadge, WorkflowStatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { referralsQuery, usePatients, workflowsQuery } from "@/hooks/useClinicalQueries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clinical Dashboard — ClinicalFlow AI" },
      {
        name: "description",
        content:
          "Operational dashboard for the agentic clinical workflow: patient volume, flagged issues, referrals and workflow analytics.",
      },
      { property: "og:title", content: "Clinical Dashboard — ClinicalFlow AI" },
      {
        property: "og:description",
        content: "KPIs and analytics for EHR extraction, AI summarisation and referral orchestration.",
      },
    ],
  }),
  component: Dashboard,
});

const RISK_COLORS = ["var(--destructive)", "var(--warning)", "var(--success)"];

function Dashboard() {
  const { data: patients, isLoading } = usePatients();
  const { data: referrals } = useQuery(referralsQuery());
  const { data: workflows } = useQuery(workflowsQuery());

  const stats = useMemo(() => {
    const list = patients ?? [];
    const refs = referrals ?? [];
    const runs = workflows ?? [];
    const durations = runs.map((w) => w.duration_ms ?? 0).filter(Boolean);
    return {
      patients: list.length,
      issues: list.reduce((sum, p) => sum + p.issues_count, 0),
      referrals: refs.length,
      pending: refs.filter((r) => r.status === "Pending" || r.status === "Created").length,
      completedRuns: runs.filter((w) => w.status === "Completed").length,
      avgSeconds: durations.length
        ? (durations.reduce((a, b) => a + b, 0) / durations.length / 1000).toFixed(1)
        : "0.0",
      risk: (["High", "Medium", "Low"] as const).map((level) => ({
        name: level,
        value: list.filter((p) => p.risk === level).length,
      })),
      specialty: Object.entries(
        refs.reduce<Record<string, number>>((acc, r) => {
          acc[r.specialist_type] = (acc[r.specialist_type] ?? 0) + 1;
          return acc;
        }, {}),
      ).map(([name, value]) => ({ name, value })),
    };
  }, [patients, referrals, workflows]);

  const recentRuns = (workflows ?? []).slice(0, 5);
  const recentReferrals = (referrals ?? []).slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Clinical Dashboard"
        description="Operational overview of patients, agent workflow executions and specialist referrals."
        actions={
          <Button asChild>
            <Link to="/patients">Open patient roster</Link>
          </Button>
        }
      />
      <Disclaimer />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total patients" value={stats.patients} icon={Users} hint="Synthetic records" />
        <KpiCard
          label="Flagged issues"
          value={stats.issues}
          icon={AlertTriangle}
          tone="warning"
          hint="Detected by summary agent"
        />
        <KpiCard
          label="Referrals generated"
          value={stats.referrals}
          icon={Send}
          tone="success"
          hint={`${stats.pending} awaiting scheduling`}
        />
        <KpiCard
          label="Workflows completed"
          value={stats.completedRuns}
          icon={Activity}
          hint={`Avg ${stats.avgSeconds}s per run`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Patient risk distribution</CardTitle>
            <CardDescription>Risk stratification across the synthetic cohort.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.risk} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                  {stats.risk.map((entry, i) => (
                    <Cell key={entry.name} fill={RISK_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Referrals by specialty</CardTitle>
            <CardDescription>Where the orchestrator agent is routing patients.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {stats.specialty.length === 0 ? (
              <EmptyState
                icon={Send}
                title="No referrals yet"
                description="Run a clinical workflow on a patient to generate the first referral."
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.specialty}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <Tooltip
                    cursor={{ fill: "var(--surface-muted)" }}
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Recent workflow runs</CardTitle>
            <CardDescription>Latest agent executions this session.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRuns.length === 0 ? (
              <EmptyState
                icon={Activity}
                title="No workflow runs yet"
                description="Open a patient record and run the clinical workflow to populate this feed."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRuns.map((w) => (
                    <TableRow key={w.workflow_id}>
                      <TableCell className="font-medium">{w.patient_name}</TableCell>
                      <TableCell>
                        <WorkflowStatusBadge status={w.status} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {w.duration_ms != null ? `${(w.duration_ms / 1000).toFixed(1)}s` : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Recent referrals</CardTitle>
            <CardDescription>Newest specialist assignments.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentReferrals.length === 0 ? (
              <EmptyState
                icon={Send}
                title="No referrals yet"
                description="Referrals appear here as soon as the orchestrator agent triggers a clinical rule."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Specialist</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReferrals.map((r) => (
                    <TableRow key={r.referral_id}>
                      <TableCell className="font-medium">{r.patient_name}</TableCell>
                      <TableCell className="text-muted-foreground">{r.specialist_type}</TableCell>
                      <TableCell>
                        <SeverityBadge severity={r.priority} />
                      </TableCell>
                      <TableCell>
                        <ReferralStatusBadge status={r.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
