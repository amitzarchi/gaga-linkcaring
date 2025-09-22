"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { RadialBarChart, RadialBar, PolarRadiusAxis, Label } from "recharts";
import { useTestResults } from "@/app/context/test-results-context";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TestsPassRate() {
  const { testResults } = useTestResults();
  const [limit, setLimit] = useState<string>("100");

  const { passedCount, failedCount, passRatePct } = useMemo(() => {
    const sorted = [...testResults].sort((a, b) => {
      const aTime = new Date((a as any).createdAt).getTime();
      const bTime = new Date((b as any).createdAt).getTime();
      return bTime - aTime;
    });
    const limitNum = Number.parseInt(limit, 10);
    const subset = sorted.slice(0, Number.isFinite(limitNum) ? limitNum : sorted.length);
    const total = subset.length;
    const passed = subset.filter((tr) => tr.success).length;
    const failed = Math.max(0, total - passed);
    const pct = total > 0 ? Math.round((passed / total) * 100) : 0;
    return { passedCount: passed, failedCount: failed, passRatePct: pct };
  }, [testResults, limit]);

  return (
    <Card className="min-h-[200px]">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Tests pass rate</CardTitle>
          <Select value={limit} onValueChange={setLimit}>
            <SelectTrigger size="sm" aria-label="Select test window">
              <SelectValue placeholder="Latest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100">Latest 100</SelectItem>
              <SelectItem value="300">Latest 300</SelectItem>
              <SelectItem value="500">Latest 500</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[160px]">
          <ChartContainer
            config={{
              failed: { label: "Failed", color: "#C51E3A" },
              passed: { label: "Passed", color: "#00693E" },
            }}
            className="mx-auto aspect-square w-full max-w-[200px]"
          >
            <RadialBarChart
              data={[
                {
                  name: "PassRate",
                  passed: passedCount,
                  failed: failedCount,
                },
              ]}
              startAngle={0}
              endAngle={180}
              innerRadius={60}
              outerRadius={100}
            >
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-2xl font-bold">
                            {passRatePct}%
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                            Pass rate
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar dataKey="passed" stackId="a" cornerRadius={5} fill="var(--color-passed)" className="stroke-transparent stroke-2" />
              <RadialBar dataKey="failed" fill="var(--color-failed)" stackId="a" cornerRadius={5} className="stroke-transparent stroke-2" />
            </RadialBarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}


