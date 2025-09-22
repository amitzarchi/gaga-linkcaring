"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { RadialBarChart, RadialBar, PolarRadiusAxis, Label } from "recharts";

export function ResultDistribution({ results }: { results: { true: number; false: number } }) {
  return (
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
                  true: results.true,
                  false: results.false,
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
                      const totalResults = (results.true || 0) + (results.false || 0)
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-2xl font-bold">
                            {totalResults.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                            Results
                          </tspan>
                        </text>
                      )
                    }
                    return null
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar dataKey="true" stackId="a" cornerRadius={5} fill="var(--color-true)" className="stroke-transparent stroke-2" />
              <RadialBar dataKey="false" fill="var(--color-false)" stackId="a" cornerRadius={5} className="stroke-transparent stroke-2" />
            </RadialBarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

