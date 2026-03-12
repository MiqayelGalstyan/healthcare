"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type ActivityPoint = {
  date: string;
  patients: number;
  doctors: number;
};

const chartConfig = {
  date: {
    label: "Date",
  },
  patients: {
    label: "Patients",
    color: "var(--chart-1)",
  },
  doctors: {
    label: "Doctors",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function getEmptyChartData(): ActivityPoint[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return {
      date: d.toISOString().slice(0, 10),
      patients: 0,
      doctors: 0,
    };
  });
}

export function DashboardActivityChart() {
  const emptyChartData = useMemo(() => getEmptyChartData(), []);
  const [chartData, setChartData] = useState<ActivityPoint[]>(emptyChartData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/dashboard/activity")
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error("Failed to fetch")),
      )
      .then((body: { data: ActivityPoint[] }) => {
        if (!cancelled && Array.isArray(body.data) && body.data.length > 0) {
          setChartData(body.data);
        }
      })
      .catch(() => {
        if (!cancelled) setChartData(emptyChartData);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card className="mt-6 pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Last 7 days activity</CardTitle>
          <CardDescription>
            New signups: patients and doctors by day
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="aspect-auto h-[250px] w-full flex items-center justify-center text-muted-foreground text-sm">
            Loading…
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillPatients" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-patients)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-patients)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillDoctors" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-doctors)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-doctors)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="patients"
                type="natural"
                fill="url(#fillPatients)"
                stroke="var(--color-patients)"
                stackId="a"
              />
              <Area
                dataKey="doctors"
                type="natural"
                fill="url(#fillDoctors)"
                stroke="var(--color-doctors)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
