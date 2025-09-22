"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, CartesianGrid, XAxis, Bar, Cell } from "recharts";

type MonthlyPoint = { date: string; cost: number };

export function MonthlyCostOverTime({ data }: { data: MonthlyPoint[] }) {
    const barColors = [
        "var(--chart-4)",
        "var(--chart-5)",
        "var(--chart-2)",
        "var(--chart-3)",
        "var(--chart-1)",
      ];
    
  return (
    <Card className="min-h-[320px]">
      <CardHeader>
        <CardTitle>Monthly cost</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ cost: { label: "Cost (USD)", color: "var(--chart-6)" } }}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(value) => {
                const date = new Date(value as any);
                return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[160px]"
                  nameKey="cost"
                  labelFormatter={(value) => {
                    return new Date(value as any).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="cost" radius={6}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


