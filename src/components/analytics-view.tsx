import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { fmtMoney } from "@/lib/format";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";

export interface MetricDef {
  label: string;
  table: string;
  aggregate?: "count" | "sum";
  field?: string;
  filter?: Record<string, string | number | boolean>;
  format?: "money" | "number";
  color?: string;
}

export interface GroupChartDef {
  title: string;
  table: string;
  groupBy: string;
  field?: string;
  aggregate?: "count" | "sum";
  type?: "bar" | "pie";
  labelMap?: { table: string; labelField: string };
  limit?: number;
}

export interface AnalyticsViewProps {
  title: string;
  description?: string;
  metrics: MetricDef[];
  charts?: GroupChartDef[];
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))", "hsl(var(--muted-foreground))"];

export function AnalyticsView({ title, description, metrics, charts = [] }: AnalyticsViewProps) {
  const [values, setValues] = useState<(number | null)[]>([]);
  const [chartData, setChartData] = useState<Record<string, { name: string; value: number }[]>>({});
  const [loading, setLoading] = useState(true);
  const key = useMemo(() => JSON.stringify({ metrics, charts }), [metrics, charts]);

  useEffect(() => {
    (async () => {
      setLoading(true);

      // Metrics — one RPC per metric, all in parallel
      const metricCalls = metrics.map((m) => {
        const filters = m.filter ?? {};
        if (m.aggregate === "sum" && m.field) {
          return supabase.rpc("kpi_sum" as never, { p_table: m.table, p_field: m.field, p_filters: filters } as never);
        }
        return supabase.rpc("kpi_count" as never, { p_table: m.table, p_filters: filters } as never);
      });

      // Charts — one RPC per chart, all in parallel
      const chartCalls = charts.map((c) =>
        supabase.rpc("kpi_group" as never, {
          p_table: c.table,
          p_group: c.groupBy,
          p_field: c.field ?? null,
          p_agg: c.aggregate ?? "count",
          p_limit: c.limit ?? 10,
        } as never),
      );

      const [metricRes, chartRes] = await Promise.all([Promise.all(metricCalls), Promise.all(chartCalls)]);

      setValues(metricRes.map((r) => (r.error ? null : Number(r.data ?? 0))));

      // Resolve label maps (one .in() query per chart that needs it)
      const cd: Record<string, { name: string; value: number }[]> = {};
      await Promise.all(
        charts.map(async (c, i) => {
          const raw = (chartRes[i].data as { name: string; value: number }[] | null) ?? [];
          if (!c.labelMap || raw.length === 0) {
            cd[c.title] = raw;
            return;
          }
          const ids = raw.map((r) => r.name).filter((x) => x && x !== "—");
          if (!ids.length) { cd[c.title] = raw; return; }
          const { data: lm } = await supabase
            .from(c.labelMap.table as never)
            .select(`id, ${c.labelMap.labelField}`)
            .in("id", ids);
          const map = new Map(((lm as Record<string, unknown>[]) ?? []).map((r) => [String(r.id), String(r[c.labelMap!.labelField] ?? "—")]));
          cd[c.title] = raw.map((r) => ({ name: map.get(r.name) ?? r.name, value: Number(r.value) }));
        }),
      );
      setChartData(cd);
      setLoading(false);
    })();
  }, [key]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((m, i) => {
          const v = values[i];
          const display = v == null ? "—" : m.format === "money" ? fmtMoney(v) : new Intl.NumberFormat("fr-FR").format(v);
          return (
            <Card key={m.label} className="p-5">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{m.label}</div>
              <div className="mt-2 text-2xl font-bold" style={{ color: m.color ?? "hsl(var(--primary))" }}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : display}
              </div>
            </Card>
          );
        })}
      </div>

      {charts.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {charts.map((c) => {
            const data = chartData[c.title] ?? [];
            return (
              <Card key={c.title} className="p-5">
                <h2 className="font-semibold">{c.title}</h2>
                <div className="mt-4 h-64">
                  {loading ? (
                    <div className="grid h-full place-items-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                  ) : data.length === 0 ? (
                    <div className="grid h-full place-items-center text-sm text-muted-foreground">Aucune donnée</div>
                  ) : c.type === "pie" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
                          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
