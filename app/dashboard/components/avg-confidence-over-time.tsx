"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";

type TimelinePoint = { date: string; avgConfidence: number };

export function AvgConfidenceOverTime({ data }: { data: TimelinePoint[] }) {
  return (
    <Card className="min-h-[320px]">
      <CardHeader>
        <CardTitle>Avg confidence</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ avgConfidence: { label: "Avg confidence (%)", color: "var(--chart-3)" } }}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart accessibilityLayer data={data} margin={{ left: 12, right: 12, top: 5 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value as any)
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="avgConfidence"
                  labelFormatter={(value) => {
                    return new Date(value as any).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Area dataKey="avgConfidence" type="monotone" stroke={`var(--color-avgConfidence)`} fill={`var(--color-avgConfidence)`} fillOpacity={0.2} strokeWidth={2} isAnimationActive={false} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


