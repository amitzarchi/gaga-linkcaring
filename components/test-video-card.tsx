"use client";

import { useState } from "react";
import { MilestoneVideo, AnalyzeResult } from "@/lib/defs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  History,
  FlaskConical,
  Shield,
  ListChecks,
} from "lucide-react";

interface VideoTestResult extends MilestoneVideo {
  testResult?: AnalyzeResult;
  isRunning?: boolean;
}

interface TestVideoCardProps {
  video: MilestoneVideo;
  videoUrl?: string;
  videoResult?: VideoTestResult;
  onRunTest: (video: MilestoneVideo) => void;
  onShowHistory: (video: MilestoneVideo) => void;
  onDelete: (videoId: number) => void;
  onShowDetails: (video: MilestoneVideo) => void;
  isDeleting: boolean;
}

export function TestVideoCard({
  video,
  videoUrl,
  videoResult,
  onRunTest,
  onShowHistory,
  onDelete,
  onShowDetails,
  isDeleting,
}: TestVideoCardProps) {
  const getResultIcon = () => {
    if (videoResult?.isRunning) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }

    if (videoResult?.testResult) {
      // Check if it's an error result
      if ("error" in videoResult.testResult) {
        return <XCircle className="h-4 w-4 text-red-700" />;
      }
      
      // Success result - check if API result matches expected milestone achievement
      const expectedResult = video.achievedMilestone === "true";
      const actualResult = videoResult.testResult.result;
      const isCorrect = expectedResult === actualResult;
      
      return isCorrect ? (
        <CheckCircle2 className="h-4 w-4 text-green-700" />
      ) : (
        <XCircle className="h-4 w-4 text-red-700" />
      );
    }

    // This should never be reached now since we handle no results in the main conditional
    return <FlaskConical className="size-4 text-gray-600" />;
  };

  const getResultBadge = () => {
    if (videoResult?.isRunning) {
      return <Badge variant="secondary">Testing...</Badge>;
    }

    if (videoResult?.testResult) {
      // Check if it's an error result
      if ("error" in videoResult.testResult) {
        return <Badge variant="destructive">ERROR</Badge>;
      }
      
      // Success result - check if API result matches expected milestone achievement
      const expectedResult = video.achievedMilestone === "true";
      const actualResult = videoResult.testResult.result;
      const isCorrect = expectedResult === actualResult;
      
      return (
        <Badge variant={isCorrect ? "default" : "destructive"}>
          {isCorrect ? "PASS" : "FAIL"}
        </Badge>
      );
    }

    // This should never be reached now since we handle no results in the main conditional
    return null;
  };

  return (
    <Card className="w-full rounded-md">
      <CardContent className="px-4">
        {/* Desktop Layout (lg and up) */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-4">
            {/* Video Preview - 1/3 width (4 columns) */}
            <div className="col-span-4 space-y-3">
              <div className="aspect-video bg-black rounded-sm overflow-hidden">
                <video
                  controls
                  className="w-full h-full object-contain"
                  src={videoUrl || undefined}
                >
                  Your browser does not support video playback.
                </video>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <h3 className="font-medium text-muted-foreground text-xs">
                  {video.videoPath.split("_")[0]}
                </h3>
                <Badge
                  variant={
                    video.achievedMilestone === "true"
                      ? "default"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {video.achievedMilestone === "true"
                    ? "Achieved"
                    : "Not Achieved"}
                </Badge>
              </div>
            </div>

            {/* Test Section - 1/2 of remaining width (6 columns) */}
            <div className="col-span-7 flex flex-col justify-between bg-muted rounded-sm p-2 border border-border">
              {/* Test Result */}
              {videoResult?.testResult ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getResultIcon()}
                      <span className="text-sm font-medium">
                        Test Result
                      </span>
                    </div>
                    {getResultBadge()}
                  </div>

                  <ScrollArea type="auto" className="h-32 w-full pb-2">
                    <div className="space-y-3 text-sm pr-3 leading-relaxed">
                      {/* Handle error results */}
                      {"error" in videoResult.testResult ? (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="break-words text-wrap">
                            {videoResult.testResult.error}
                          </AlertDescription>
                        </Alert>
                      ) : (
                        /* Handle success results */
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>API Result:</span>
                            <Badge variant="outline">
                              {videoResult.testResult.result
                                ? "Achieved"
                                : "Not Achieved"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Confidence:</span>
                            <span>
                              {(videoResult.testResult.confidence * 100).toFixed(1)}%
                            </span>
                          </div>

                          {/* Validators Information - moved above policy */}
                          {videoResult.testResult.validators.length > 0 && (
                            <>
                              <div className="flex items-center gap-2 pt-1">
                                <ListChecks className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  Validators ({videoResult.testResult.validators.filter(v => v.result).length}/{videoResult.testResult.validators.length} passed):
                                </span>
                              </div>
                              <div className="pl-5 space-y-1">
                                {videoResult.testResult.validators.map((validator, index) => (
                                  <div key={index} className="flex items-start gap-2 text-xs">
                                    {validator.result ? (
                                      <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                                    ) : (
                                      <XCircle className="h-3 w-3 text-red-600 flex-shrink-0 mt-0.5" />
                                    )}
                                    <span className="break-words text-wrap leading-tight" title={validator.description}>
                                      {validator.description}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                          
                          {/* Policy Information - moved below validators */}
                          <div className="flex items-center gap-2 pt-1">
                            <Shield className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Policy:</span>
                          </div>
                          <div className="pl-5 space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Min Validators:</span>
                              <span>{videoResult.testResult.policy.minValidatorsPassed}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Min Confidence:</span>
                              <span>{videoResult.testResult.policy.minConfidence}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                /* Placeholder for no test results - replaces entire header */
                <div className="flex items-center justify-center flex-1">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FlaskConical className="h-8 w-8" />
                    <div className="text-center">
                      <p className="text-sm font-medium">Not Tested</p>
                      <p className="text-xs">Run a test to see detailed results</p>
                    </div>
                  </div>
                </div>
              )}
              <Button
                onClick={() => onRunTest(video)}
                disabled={videoResult?.isRunning}
                className="w-full h-8"
                variant="outline"
              >
                {videoResult?.isRunning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Run Test
              </Button>
            </div>

            {/* Actions - Remaining width (2 columns) */}
            <div className="col-span-1 flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => onShowHistory(video)}
                className="w-full h-12 gap-2 text-sm"
              >
                <History className="h-3 w-3" />
                
              </Button>

              <Button
                variant="outline"
                onClick={() => onDelete(video.id)}
                disabled={isDeleting}
                className="w-full h-12 gap-2 text-sm rounded-sm bg-muted p-2 border border-red-700/30 hover:bg-red-700/10"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 text-red-700 hover:text-red-900" />
                )}
                
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout (below lg) */}
        <div className="lg:hidden">
          <div className="space-y-4">
            {/* Video Preview */}
            <div className="aspect-video bg-black rounded-sm overflow-hidden">
              <video
                controls
                className="w-full h-full object-contain"
                src={videoUrl || undefined}
              >
                Your browser does not support video playback.
              </video>
            </div>
            
            {/* Video Info Row */}
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-muted-foreground text-xs">
                {video.videoPath.split("_")[0]}
              </h3>
              <Badge
                variant={
                  video.achievedMilestone === "true"
                    ? "default"
                    : "secondary"
                }
                className="text-xs"
              >
                {video.achievedMilestone === "true"
                  ? "Achieved"
                  : "Not Achieved"}
              </Badge>
            </div>

            {/* Test Results Section - Mobile */}
            <div className="bg-muted rounded-sm p-3 border border-border space-y-3">
              {videoResult?.testResult ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getResultIcon()}
                      <span className="text-sm font-medium">
                        Test Result
                      </span>
                    </div>
                    {getResultBadge()}
                  </div>

                  <ScrollArea type="auto" className="h-24 w-full">
                    <div className="space-y-2 text-sm pr-2 leading-relaxed">
                      {/* Handle error results */}
                      {"error" in videoResult.testResult ? (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs break-words text-wrap">
                            {videoResult.testResult.error}
                          </AlertDescription>
                        </Alert>
                      ) : (
                        /* Handle success results */
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs">API Result:</span>
                            <Badge variant="outline" className="text-xs">
                              {videoResult.testResult.result
                                ? "Achieved"
                                : "Not Achieved"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs">Confidence:</span>
                            <span className="text-xs">
                              {(videoResult.testResult.confidence * 100).toFixed(1)}%
                            </span>
                          </div>

                          {/* Validators Information - Compact for mobile */}
                          {videoResult.testResult.validators.length > 0 && (
                            <>
                              <div className="flex items-center gap-2 pt-1">
                                <ListChecks className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  Validators ({videoResult.testResult.validators.filter(v => v.result).length}/{videoResult.testResult.validators.length}):
                                </span>
                              </div>
                              <div className="pl-4 space-y-1">
                                {videoResult.testResult.validators.map((validator, index) => (
                                  <div key={index} className="flex items-start gap-2 pt-1 text-xs">
                                    {validator.result ? (
                                      <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                                    ) : (
                                      <XCircle className="h-3 w-3 text-red-600 flex-shrink-0 mt-0.5" />
                                    )}
                                    <span className="break-words text-wrap leading-tight" title={validator.description}>
                                      {validator.description}
                                    </span>
                                  </div>
                                ))}
                                    
                              </div>
                            </>
                          )}
                          
                          {/* Policy Information - Compact */}
                          <div className="flex items-center gap-2 pt-1">
                            <Shield className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Policy:</span>
                          </div>
                          <div className="pl-4 space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Min Validators:</span>
                              <span>{videoResult.testResult.policy.minValidatorsPassed}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Min Confidence:</span>
                              <span>{videoResult.testResult.policy.minConfidence}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                /* Placeholder for no test results */
                <div className="flex items-center justify-center py-4">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FlaskConical className="h-6 w-6" />
                    <div className="text-center">
                      <p className="text-xs font-medium">Not Tested</p>
                      <p className="text-xs">Tap "Run Test" to see results</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons - Mobile */}
            <div className="flex gap-2">
              <Button
                onClick={() => onRunTest(video)}
                disabled={videoResult?.isRunning}
                className="flex-1 h-10 gap-2"
                variant="outline"
              >
                {videoResult?.isRunning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Run Test
              </Button>

              <Button
                variant="outline"
                onClick={() => onShowHistory(video)}
                className="h-10 px-3"
              >
                <History className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() => onDelete(video.id)}
                disabled={isDeleting}
                className="h-10 px-3 border-red-700/30 hover:bg-red-700/10"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 text-red-700" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
