"use client";

import { useMemo } from "react";
import { useResponseStats } from "@/app/context/response-stats-context";
import { useApiKeys } from "@/app/context/api-keys-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  BarChart,
  Bar,
    RadialBarChart,
    RadialBar,
    PolarRadiusAxis,
    Label,
} from "recharts";

export default function ResponseStatsDashboard() {
  const { responseStats, responseStatsCount } = useResponseStats();
  const { apiKeys } = useApiKeys();

  const apiKeyIdToName = useMemo(() => {
    const map = new Map<number, string>();
    apiKeys.forEach((k) => map.set(k.id, k.name));
    return map;
  }, [apiKeys]);

  const metrics = useMemo(() => {
    const rows = responseStats || [];
    let success = 0;
    let error = 0;
    let resultTrue = 0;
    let resultFalse = 0;
    let confidenceSum = 0;
    let confidenceCount = 0;
    let processingSum = 0;
    let processingCount = 0;

    const byDay: Record<
      string,
      { success: number; error: number; tokens: number }
    > = {};
    const tokensByApiKey: Record<string, number> = {};

    for (const r of rows) {
      const createdAt = new Date((r as any).createdAt);
      const dayKey = createdAt.toISOString().slice(0, 10);
      if (!byDay[dayKey]) {
        byDay[dayKey] = { success: 0, error: 0, tokens: 0 };
      }

      if (r.status === "SUCCESS") {
        success += 1;
        byDay[dayKey].success += 1;
      } else {
        error += 1;
        byDay[dayKey].error += 1;
      }

      if (typeof r.totalTokenCount === "number") {
        byDay[dayKey].tokens += r.totalTokenCount || 0;
        const keyName = r.apiKeyId
          ? apiKeyIdToName.get(r.apiKeyId) || `API Key ${r.apiKeyId}`
          : "Unknown";
        tokensByApiKey[keyName] =
          (tokensByApiKey[keyName] || 0) + (r.totalTokenCount || 0);
      }

      if (typeof r.result === "boolean") {
        if (r.result) resultTrue += 1;
        else resultFalse += 1;
      }

      if (typeof r.confidence === "number") {
        confidenceSum += r.confidence;
        confidenceCount += 1;
      }

      if (typeof r.processingMs === "number") {
        processingSum += r.processingMs;
        processingCount += 1;
      }
    }

    const timeline = Object.entries(byDay)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, v]) => ({
        date,
        success: v.success,
        error: v.error,
        tokens: v.tokens,
      }));

    const tokensPerApiKey = Object.entries(tokensByApiKey)
      .sort((a, b) => b[1] - a[1])
      .map(([name, tokens]) => ({ name, tokens }));

    const totalRows = rows.length;
    const totalRowsToday = rows.filter(
      (r) =>
        new Date((r as any).createdAt).toISOString().slice(0, 10) ===
        new Date().toISOString().slice(0, 10)
    ).length;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const rowsLast100 = rows.slice(0, 100);
    const rowsLast7Days = rows.filter((r) => {
      const createdAt = new Date((r as any).createdAt);
      return createdAt >= sevenDaysAgo;
    });
    const avgConfidenceThisWeek = rowsLast7Days.length
      ? rowsLast7Days.reduce(
          (acc, r) =>
            acc + (typeof r.confidence === "number" ? r.confidence : 0),
          0
        ) / rowsLast7Days.length
      : 0;
    const avgConfidence = confidenceCount ? confidenceSum / confidenceCount : 0;
    const avgProcessingMs = processingCount
      ? processingSum / processingCount
      : 0;
    const avgProcessingLast100 = rowsLast100.length
      ? rowsLast100.reduce(
          (acc, r) =>
            acc + (typeof r.processingMs === "number" ? r.processingMs : 0),
          0
        ) / rowsLast100.length
      : 0;
    const successRate = totalRows ? (success / totalRows) * 100 : 0;

    return {
      totalRows,
      totalRowsToday,
      counts: { success, error },
      results: { true: resultTrue, false: resultFalse },
      avgConfidence,
      avgConfidenceThisWeek,
      avgProcessingMs,
      avgProcessingLast100,
      successRate,
      timeline,
      tokensPerApiKey,
    };
  }, [responseStats, apiKeyIdToName]);

  const pieColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="lg:hidden">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Requests</span>
              <span className="text-base font-semibold">
                {Intl.NumberFormat().format(responseStatsCount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <span className="text-base font-semibold">
                {metrics.successRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg Confidence</span>
              <span className="text-base font-semibold">
                {metrics.avgConfidence.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg Response Time</span>
              <span className="text-base font-semibold">
                {(metrics.avgProcessingMs / 1000).toFixed(1)} sec
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="hidden lg:grid lg:grid-cols-4 gap-4">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Intl.NumberFormat().format(responseStatsCount)}
            </div>
            <div className="text-xs text-muted-foreground">
              {metrics.totalRowsToday} today
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {metrics.successRate.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {metrics.counts.success} success / {metrics.counts.error} error
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Avg Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {metrics.avgConfidence.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {metrics.avgConfidenceThisWeek.toFixed(1)}% this week
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-0">
            <CardTitle>Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(metrics.avgProcessingMs / 1000).toFixed(1)} sec
            </div>
            <div className="text-xs text-muted-foreground">
              {(metrics.avgProcessingLast100 / 1000).toFixed(1)} sec last 100
              requests
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card className="min-h-[320px]">
          <CardHeader>
            <CardTitle>Total tokens over time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ tokens: { label: "Tokens", color: "var(--chart-1)" } }}
              className="aspect-auto h-[250px] w-full"
            >
              <LineChart
                accessibilityLayer
                data={metrics.timeline}
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value as any)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="tokens"
                      labelFormatter={(value) => {
                        return new Date(value as any).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      }}
                    />
                  }
                />
                <Line
                  dataKey="tokens"
                  type="monotone"
                  stroke={`var(--color-tokens)`}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="min-h-[200px]">
          <CardHeader>
            <CardTitle>Tokens by API key</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ tokens: { label: "Tokens", color: "var(--chart-4)" } }}
              className="w-full h-[160px]"
            >
              <BarChart accessibilityLayer data={metrics.tokensPerApiKey}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => String(value).slice(0, 12)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="tokens" fill="var(--color-tokens)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="min-h-[200px]">
          <CardHeader>
            <CardTitle>Result distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[160px]">
              <ChartContainer
                config={{
                  false: { label: "False", color: "var(--chart-2)" },
                  true: { label: "True", color: "var(--chart-1)" },
                }}
                className="mx-auto aspect-square w-full max-w-[200px]"
              >
                <RadialBarChart
                  data={[
                    {
                      name: "Results",
                      true: metrics.results.true,
                      false: metrics.results.false,
                    },
                  ]}
                  startAngle={0}
                  endAngle={180}
                  innerRadius={60}
                  outerRadius={100}
                >
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          const totalResults =
                            (metrics.results.true || 0) + (metrics.results.false || 0)
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 16}
                                className="fill-foreground text-2xl font-bold"
                              >
                                {totalResults.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 4}
                                className="fill-muted-foreground"
                              >
                                Results
                              </tspan>
                            </text>
                          )
                        }
                        return null
                      }}
                    />
                  </PolarRadiusAxis>
                  <RadialBar
                    dataKey="true"
                    stackId="a"
                    cornerRadius={5}
                    fill="var(--color-true)"
                    className="stroke-transparent stroke-2"
                  />
                  <RadialBar
                    dataKey="false"
                    fill="var(--color-false)"
                    stackId="a"
                    cornerRadius={5}
                    className="stroke-transparent stroke-2"
                  />
                </RadialBarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
