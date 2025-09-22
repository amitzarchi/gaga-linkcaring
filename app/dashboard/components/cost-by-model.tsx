"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, CartesianGrid, XAxis, Bar, Cell } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CostPerModel = { name: string; cost: number };
type RangeKey = "all" | "7d" | "mtd";

export function CostByModel({
  dataByRange,
}: {
  dataByRange: Record<RangeKey, CostPerModel[]>;
}) {
  const [range, setRange] = useState<RangeKey>("mtd");
  const data = dataByRange[range] || [];
  const barColors = [
    "var(--chart-3)",
    "var(--chart-2)",
    "var(--chart-5)",
    "var(--chart-1)",
    "var(--chart-4)",
  ];
  return (
    <Card className="min-h-[200px]">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Cost by Model</CardTitle>
          <Tabs value={range} onValueChange={(v) => setRange(v as RangeKey)}>
            <TabsList>
              <TabsTrigger value="all">all</TabsTrigger>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="mtd">MTD</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ cost: { label: "Cost (USD)", color: "var(--chart-5)" } }}
          className="w-full h-[160px]"
        >
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => String(value).slice(0, 25)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="cost" fill="var(--color-cost)" radius={8}>
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



