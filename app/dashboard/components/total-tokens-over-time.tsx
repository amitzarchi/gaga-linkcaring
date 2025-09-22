"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis } from "recharts";

type TimelinePoint = { date: string; tokens: number };

export function TotalTokensOverTime({ data }: { data: TimelinePoint[] }) {
  return (
    <Card className="min-h-[320px]">
      <CardHeader>
        <CardTitle>Total tokens over time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ tokens: { label: "Tokens", color: "var(--chart-1)" } }}
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
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="tokens"
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
            <Line dataKey="tokens" type="monotone" stroke={`var(--color-tokens)`} strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

