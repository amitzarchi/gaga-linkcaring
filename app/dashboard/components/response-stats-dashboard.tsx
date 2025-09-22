"use client";

import { useMemo } from "react";
import { useResponseStats } from "@/app/context/response-stats-context";
import { useApiKeys } from "@/app/context/api-keys-context";
import { useModels } from "@/app/context/models-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TotalTokensOverTime } from "./total-tokens-over-time";
import { ErrorRateOverTime } from "./error-rate-over-time";
import { AvgConfidenceOverTime } from "./avg-confidence-over-time";
import { TokensByApiKey } from "./tokens-by-api-key";
import { TokensByModel } from "./tokens-by-model";
import { CostByApiKey } from "./cost-by-api-key";
import { CostByModel } from "./cost-by-model";
import { MonthlyCostOverTime } from "./monthly-cost-over-time";
import { ResultDistribution } from "./result-distribution";
import { TestsPassRate } from "./tests-pass-rate";
import { MilestonePassRates } from "./milestone-pass-rates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ResponseStatsDashboard() {
  const { responseStats, responseStatsCount } = useResponseStats();
  const { apiKeys } = useApiKeys();
  const { models } = useModels();

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

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    let requestsThisMonth = 0;
    let requestsLastMonth = 0;
    let tokensThisMonth = 0;
    let tokensLastMonth = 0;

    const byDay: Record<
      string,
      { success: number; error: number; tokens: number; total: number; errorCodeCount: number; confidenceSum: number; confidenceCount: number }
    > = {};
    const tokensByApiKey: Record<string, number> = {};
    const tokensByModel: Record<string, number> = {};

    // Time range thresholds for toggles
    const sevenDaysAgoForTokens = new Date(now);
    sevenDaysAgoForTokens.setDate(now.getDate() - 7);

    const tokensByApiKey7d: Record<string, number> = {};
    const tokensByApiKeyMTD: Record<string, number> = {};
    const tokensByModel7d: Record<string, number> = {};
    const tokensByModelMTD: Record<string, number> = {};

    // Cost aggregations
    const costByApiKeyAll: Record<string, number> = {};
    const costByApiKey7d: Record<string, number> = {};
    const costByApiKeyMTD: Record<string, number> = {};
    // Monthly cost aggregations (group by month)
    const monthlyCostByMonth: Record<string, number> = {};

    // Build a map of model -> price per 1M tokens (USD)
    const modelPriceMap = new Map<string, number>();
    (models || []).forEach((m: any) => {
      modelPriceMap.set(m.model, typeof m.inputPrice === "number" ? m.inputPrice : 0);
    });

    for (const r of rows) {
      const createdAt = new Date((r as any).createdAt);
      const dayKey = createdAt.toISOString().slice(0, 10);
      if (!byDay[dayKey]) {
        byDay[dayKey] = { success: 0, error: 0, tokens: 0, total: 0, errorCodeCount: 0, confidenceSum: 0, confidenceCount: 0 };
      }

      byDay[dayKey].total += 1;
      if ((r as any).errorCode != null) {
        byDay[dayKey].errorCodeCount += 1;
      }

      if (r.status === "SUCCESS") {
        success += 1;
        byDay[dayKey].success += 1;
      } else {
        error += 1;
        byDay[dayKey].error += 1;
      }

      if (typeof r.totalTokenCount === "number") {
        const tokenCount = r.totalTokenCount || 0;
        byDay[dayKey].tokens += tokenCount;
        const keyName = r.apiKeyId
          ? apiKeyIdToName.get(r.apiKeyId) || `API Key ${r.apiKeyId}`
          : "Unknown";
        tokensByApiKey[keyName] = (tokensByApiKey[keyName] || 0) + tokenCount;

        const modelName = r.model || "Unknown";
        tokensByModel[modelName] = (tokensByModel[modelName] || 0) + tokenCount;

        // Cost accumulations (per API key require per-row model price)
        const pricePerMillion = modelPriceMap.get(modelName) || 0;
        const rowCost = (tokenCount / 1_000_000) * pricePerMillion;
        costByApiKeyAll[keyName] = (costByApiKeyAll[keyName] || 0) + rowCost;
        // Monthly accumulation
        const monthStart = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1);
        const monthKey = monthStart.toISOString().slice(0, 10);
        monthlyCostByMonth[monthKey] = (monthlyCostByMonth[monthKey] || 0) + rowCost;

        // Range accumulations
        if (createdAt >= sevenDaysAgoForTokens) {
          tokensByApiKey7d[keyName] = (tokensByApiKey7d[keyName] || 0) + tokenCount;
          tokensByModel7d[modelName] = (tokensByModel7d[modelName] || 0) + tokenCount;
          costByApiKey7d[keyName] = (costByApiKey7d[keyName] || 0) + rowCost;
        }
        if (createdAt >= currentMonthStart && createdAt < nextMonthStart) {
          tokensByApiKeyMTD[keyName] = (tokensByApiKeyMTD[keyName] || 0) + tokenCount;
          tokensByModelMTD[modelName] = (tokensByModelMTD[modelName] || 0) + tokenCount;
          costByApiKeyMTD[keyName] = (costByApiKeyMTD[keyName] || 0) + rowCost;
        }
      }

      if (typeof r.result === "boolean") {
        if (r.result) resultTrue += 1;
        else resultFalse += 1;
      }

      if (typeof r.confidence === "number") {
        confidenceSum += r.confidence;
        confidenceCount += 1;
        byDay[dayKey].confidenceSum += r.confidence;
        byDay[dayKey].confidenceCount += 1;
      }

      if (typeof r.processingMs === "number") {
        processingSum += r.processingMs;
        processingCount += 1;
      }

      // Monthly aggregations
      if (createdAt >= currentMonthStart && createdAt < nextMonthStart) {
        requestsThisMonth += 1;
        if (typeof r.totalTokenCount === "number") {
          tokensThisMonth += r.totalTokenCount || 0;
        }
      } else if (createdAt >= prevMonthStart && createdAt < currentMonthStart) {
        requestsLastMonth += 1;
        if (typeof r.totalTokenCount === "number") {
          tokensLastMonth += r.totalTokenCount || 0;
        }
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

    const errorRateTimeline = Object.entries(byDay)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, v]) => ({
        date,
        errorRate: v.total ? (v.errorCodeCount / v.total) * 100 : 0,
      }));

    const avgConfidenceTimeline = Object.entries(byDay)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, v]) => ({
        date,
        avgConfidence: v.confidenceCount ? v.confidenceSum / v.confidenceCount : 0,
      }));

    const sortAndFormat = (obj: Record<string, number>) =>
      Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .map(([name, tokens]) => ({ name, tokens }));

    const tokensPerApiKey = sortAndFormat(tokensByApiKey);
    const tokensPerModel = sortAndFormat(tokensByModel);
    const tokensPerApiKeyByRange = {
      all: tokensPerApiKey,
      "7d": sortAndFormat(tokensByApiKey7d),
      mtd: sortAndFormat(tokensByApiKeyMTD),
    } as const;
    const tokensPerModelByRange = {
      all: tokensPerModel,
      "7d": sortAndFormat(tokensByModel7d),
      mtd: sortAndFormat(tokensByModelMTD),
    } as const;

    const sortAndFormatCost = (obj: Record<string, number>) =>
      Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .map(([name, cost]) => ({ name, cost }));

    // Monthly cost timeline
    const monthlyCostTimeline = Object.entries(monthlyCostByMonth)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, cost]) => ({ date, cost }));

    // Cost by Model can be derived from tokens-by-model * price
    const costByModelAll: Record<string, number> = {};
    const costByModel7d: Record<string, number> = {};
    const costByModelMTD: Record<string, number> = {};
    for (const [modelName, tokens] of Object.entries(tokensByModel)) {
      const price = modelPriceMap.get(modelName) || 0;
      costByModelAll[modelName] = (tokens / 1_000_000) * price;
    }
    for (const [modelName, tokens] of Object.entries(tokensByModel7d)) {
      const price = modelPriceMap.get(modelName) || 0;
      costByModel7d[modelName] = (tokens / 1_000_000) * price;
    }
    for (const [modelName, tokens] of Object.entries(tokensByModelMTD)) {
      const price = modelPriceMap.get(modelName) || 0;
      costByModelMTD[modelName] = (tokens / 1_000_000) * price;
    }

    const costPerApiKeyByRange = {
      all: sortAndFormatCost(costByApiKeyAll),
      "7d": sortAndFormatCost(costByApiKey7d),
      mtd: sortAndFormatCost(costByApiKeyMTD),
    } as const;
    const costPerModelByRange = {
      all: sortAndFormatCost(costByModelAll),
      "7d": sortAndFormatCost(costByModel7d),
      mtd: sortAndFormatCost(costByModelMTD),
    } as const;

    // Estimated billing for this month: sum over models (tokens/1M * pricePer1M)
    const estimatedBillingThisMonth = Object.entries(tokensByModelMTD).reduce(
      (sum, [modelName, tokens]) => {
        const pricePerMillion = modelPriceMap.get(modelName) || 0;
        return sum + ((tokens || 0) / 1_000_000) * pricePerMillion;
      },
      0
    );

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

    const requestsThisMonthChangePct = requestsLastMonth
      ? ((requestsThisMonth - requestsLastMonth) / requestsLastMonth) * 100
      : 0;
    const tokensThisMonthChangePct = tokensLastMonth
      ? ((tokensThisMonth - tokensLastMonth) / tokensLastMonth) * 100
      : 0;

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
      tokensPerApiKeyByRange,
      tokensPerModel,
      tokensPerModelByRange,
      errorRateTimeline,
      avgConfidenceTimeline,
      // Monthly metrics
      requestsThisMonth,
      requestsLastMonth,
      requestsThisMonthChangePct,
      tokensThisMonth,
      tokensLastMonth,
      tokensThisMonthChangePct,
      // Billing metrics
      estimatedBillingThisMonth,
      costPerApiKeyByRange,
      costPerModelByRange,
      monthlyCostTimeline,
    };
  }, [responseStats, apiKeyIdToName, models]);

  return (
    <div className="flex flex-col gap-6 w-full pb-5">
      <Tabs defaultValue="usage" className="w-full">
        <ScrollArea type="auto" className="w-full">
          <TabsList className="mb-4 text-foreground h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1 w-max whitespace-nowrap justify-start">
            <TabsTrigger
              value="usage"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Usage
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Billing (Estimated)
            </TabsTrigger>
            <TabsTrigger
              value="tests"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Tests & Results
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="usage" className="space-y-6">
          <div className="lg:hidden">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total requests (all time)</span>
                  <span className="text-base font-semibold">
                    {Intl.NumberFormat().format(responseStatsCount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Requests this month</span>
                  <div className="text-right">
                    <div className="text-base font-semibold">
                      {Intl.NumberFormat().format(metrics.requestsThisMonth)}
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {metrics.requestsThisMonthChangePct >= 0 ? "Up " : "Down "}
                      {Math.abs(metrics.requestsThisMonthChangePct).toFixed(0)}% from last month
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total tokens this month</span>
                  <div className="text-right">
                    <div className="text-base font-semibold">
                      {Intl.NumberFormat().format(metrics.tokensThisMonth)}
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {metrics.tokensThisMonthChangePct >= 0 ? "Up " : "Down "}
                      {Math.abs(metrics.tokensThisMonthChangePct).toFixed(0)}% from last month
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="hidden lg:grid lg:grid-cols-3 gap-4">
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>Total requests (all time)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Intl.NumberFormat().format(responseStatsCount)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">&nbsp;</div>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>Requests this month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Intl.NumberFormat().format(metrics.requestsThisMonth)}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 whitespace-nowrap">
                  {metrics.requestsThisMonthChangePct >= 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span>
                        Up {Math.abs(metrics.requestsThisMonthChangePct).toFixed(0)}% from last month
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 text-red-600" />
                      <span>
                        Down {Math.abs(metrics.requestsThisMonthChangePct).toFixed(0)}% from last month
                      </span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>Total tokens this month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Intl.NumberFormat().format(metrics.tokensThisMonth)}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 whitespace-nowrap">
                  {metrics.tokensThisMonthChangePct >= 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span>
                        Up {Math.abs(metrics.tokensThisMonthChangePct).toFixed(0)}% from last month
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 text-red-600" />
                      <span>
                        Down {Math.abs(metrics.tokensThisMonthChangePct).toFixed(0)}% from last month
                      </span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <TotalTokensOverTime data={metrics.timeline} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TokensByApiKey dataByRange={metrics.tokensPerApiKeyByRange as any} />
            <TokensByModel dataByRange={metrics.tokensPerModelByRange as any} />
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Alert>
            <AlertCircle />
            <AlertTitle>Estimate only</AlertTitle>
            <AlertDescription>
              The amounts shown estimate AI model usage costs only. They exclude compute, storage, hosting, and other
              infrastructure charges (typically negligible).
            </AlertDescription>
          </Alert>
          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estimated cost</span>
                <span className="text-base font-semibold">
                  {Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(metrics.estimatedBillingThisMonth || 0)}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <MonthlyCostOverTime data={metrics.monthlyCostTimeline as any} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CostByApiKey dataByRange={metrics.costPerApiKeyByRange as any} />
            <CostByModel dataByRange={metrics.costPerModelByRange as any} />
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TestsPassRate />
            <ResultDistribution results={metrics.results} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ErrorRateOverTime data={metrics.errorRateTimeline as any} />
            <AvgConfidenceOverTime data={metrics.avgConfidenceTimeline as any} />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <MilestonePassRates />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
