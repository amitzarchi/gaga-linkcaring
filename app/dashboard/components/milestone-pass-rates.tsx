"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import { useMilestones } from "@/app/context/milestones-context";
import { useTestResults } from "@/app/context/test-results-context";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface MilestonePassRate {
  milestoneId: number;
  milestoneName: string;
  category: "SOCIAL" | "LANGUAGE" | "FINE_MOTOR" | "GROSS_MOTOR";
  totalTests: number;
  passedTests: number;
  passRate: number;
}

const categoryColors = {
  SOCIAL: "bg-pink-50 ring-[0.5px] ring-inset ring-pink-500/30 border-[0.5px] text-pink-950 shadow-sm",
  LANGUAGE: "bg-orange-50 ring-[0.5px] ring-inset ring-orange-500/30 border-[0.5px] text-orange-950 shadow-sm",
  FINE_MOTOR: "bg-blue-50 ring-[0.5px] ring-inset ring-blue-500/30 border-[0.5px] text-blue-950 shadow-sm",
  GROSS_MOTOR: "bg-green-50 ring-[0.5px] ring-inset ring-green-500/30 border-[0.5px] text-green-950 shadow-sm",
} as const;



const categoryLabels = {
  SOCIAL: "Social",
  LANGUAGE: "Language", 
  FINE_MOTOR: "Fine Motor",
  GROSS_MOTOR: "Gross Motor",
} as const;

export function MilestonePassRates() {
  const { milestones } = useMilestones();
  const { testResults, getTestResultsByMilestone } = useTestResults();

  const milestonePassRates = useMemo(() => {
    const rates: MilestonePassRate[] = milestones.map(milestone => {
      const milestoneTestResults = getTestResultsByMilestone(milestone.id);
      const totalTests = milestoneTestResults.length;
      const passedTests = milestoneTestResults.filter(tr => tr.success).length;
      const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

      return {
        milestoneId: milestone.id,
        milestoneName: milestone.name,
        category: milestone.category,
        totalTests,
        passedTests,
        passRate,
      };
    });

    // Sort by pass rate (descending), then by total tests (descending)
    return rates.sort((a, b) => {
      if (a.passRate !== b.passRate) {
        return b.passRate - a.passRate;
      }
      return b.totalTests - a.totalTests;
    });
  }, [milestones, testResults, getTestResultsByMilestone]);

  const getPassRateColor = (passRate: number) => {
    if (passRate >= 80) return "text-green-600";
    if (passRate >= 60) return "text-yellow-600";
    return "text-red-600";
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Pass Rate per Milestone</CardTitle>
      </CardHeader>
      <CardContent>
        {milestonePassRates.length === 0 ? (
          <div className="text-center text-muted-foreground h-24 flex items-center justify-center">
            No milestone data available
          </div>
        ) : (
          <ScrollArea type="auto" className="w-full h-[400px]">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Milestone</TableHead>
                  <TableHead className="w-[200px] text-center">Pass Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {milestonePassRates.map((milestone) => (
                  <TableRow key={milestone.milestoneId}>
                    <TableCell className="font-medium w-[300px]">
                      <div className="flex items-center gap-2">
                        <span>{milestone.milestoneName}</span>
                        <Badge 
                          variant="secondary" 
                          className={categoryColors[milestone.category]}
                        >
                          {categoryLabels[milestone.category]}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center w-[200px]">
                      <div className="flex flex-col items-center gap-2">
                        <Progress value={milestone.passRate} className="w-24 h-2" />
                        <div className="flex items-center gap-1">
                          <span className={`text-xs font-medium ${getPassRateColor(milestone.passRate)}`}>
                            {milestone.passRate.toFixed(1)}%
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({milestone.passedTests}/{milestone.totalTests})
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
