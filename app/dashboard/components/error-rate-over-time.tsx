"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";

type TimelinePoint = { date: string; errorRate: number };

export function ErrorRateOverTime({ data }: { data: TimelinePoint[] }) {
  return (
    <Card className="min-h-[320px]">
      <CardHeader>
        <CardTitle>Error rate</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ errorRate: { label: "Error rate (%)", color: "var(--chart-2)" } }}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
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
            <YAxis domain={[0, 100]} hide  />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="errorRate"
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
            <Line dataKey="errorRate" type="monotone" stroke={`var(--color-errorRate)`} strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


