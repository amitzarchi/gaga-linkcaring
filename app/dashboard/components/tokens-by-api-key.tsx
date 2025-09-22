"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, CartesianGrid, XAxis, Bar } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TokensPerApiKey = { name: string; tokens: number };

type RangeKey = "all" | "7d" | "mtd";

export function TokensByApiKey({
  dataByRange,
}: {
  dataByRange: Record<RangeKey, TokensPerApiKey[]>;
}) {
  const [range, setRange] = useState<RangeKey>("mtd");
  const data = dataByRange[range] || [];
  return (
    <Card className="min-h-[200px]">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Tokens by API key</CardTitle>
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
          config={{ tokens: { label: "Tokens", color: "var(--chart-4)" } }}
          className="w-full h-[160px]"
        >
          <BarChart accessibilityLayer data={data}>
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
  );
}

