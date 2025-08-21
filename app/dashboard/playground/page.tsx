"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MilestoneSelector } from "@/components/milestone-selector";
import VideoUploader from "@/components/video-uploader";
import { useMilestones } from "@/app/context/milestones-context";
import { analyzeMilestoneVideoFile } from "@/lib/endpoints";
import { AnalyzeResult } from "@/lib/defs";
import {
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FlaskConical,
  Shield,
  ListChecks,
} from "lucide-react";

export default function PlaygroundPage() {
  const { selectedMilestone, setSelectedMilestone } = useMilestones();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<AnalyzeResult | null>(null);

  const handleRunTest = async () => {
    if (!uploadedFile || !selectedMilestone) {
      return;
    }

    setIsRunning(true);
    setTestResult(null);

    try {
      const result = await analyzeMilestoneVideoFile({
        videoFile: uploadedFile,
        milestoneId: selectedMilestone.id,
      });
      setTestResult(result);
    } catch (error) {
      setTestResult({ error: "Internal server error" });
    } finally {
      setIsRunning(false);
    }
  };

  const getResultIcon = () => {
    if (isRunning) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }

    if (testResult) {
      if ("error" in testResult) {
        return <XCircle className="h-4 w-4 text-red-700" />;
      }
      
      return testResult.result ? (
        <CheckCircle2 className="h-4 w-4 text-green-700" />
      ) : (
        <XCircle className="h-4 w-4 text-orange-600" />
      );
    }

    return <FlaskConical className="size-4 text-gray-600" />;
  };

  const getResultBadge = () => {
    if (isRunning) {
      return <Badge variant="secondary">Testing...</Badge>;
    }

    if (testResult) {
      if ("error" in testResult) {
        return <Badge variant="destructive">ERROR</Badge>;
      }
      
      return (
        <Badge variant={testResult.result ? "default" : "secondary"}>
          {testResult.result ? "ACHIEVED" : "NOT ACHIEVED"}
        </Badge>
      );
    }

    return null;
  };

  const canRunTest = uploadedFile && selectedMilestone && !isRunning;

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="space-y-0 w-full">
        <h1 className="text-lg font-semibold w-full">
          Playground
        </h1>
        <p className="text-sm text-muted-foreground font-medium w-full">
          Test milestone analysis with your own videos.
        </p>
      </div>

      {/* Milestone Selector */}
      <div className="flex justify-center">
        <MilestoneSelector
          selectedMilestone={selectedMilestone}
          onSelect={setSelectedMilestone}
        />
      </div>

      {selectedMilestone && (
        <div className="space-y-6 w-full">
          {/* Video Upload Section */}
          <div className="space-y-4">
            <VideoUploader onFileChange={setUploadedFile} />
            
            {uploadedFile && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{uploadedFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <Button
                  onClick={handleRunTest}
                  disabled={!canRunTest}
                  className="gap-2"
                  size="sm"
                >
                  {isRunning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {isRunning ? "Analyzing..." : "Run Analysis"}
                </Button>
              </div>
            )}
          </div>


          {/* Results Section */}
          {(testResult || isRunning) && (
            <Card className="w-full">
              <CardContent className="">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getResultIcon()}
                    <span className="text-lg font-medium">Analysis Results</span>
                  </div>
                  {getResultBadge()}
                </div>

                <ScrollArea type="auto" className="h-[400px] w-full">
                  {testResult ? (
                    <div className="space-y-4 pr-4">
                      {/* Handle error results */}
                      {"error" in testResult ? (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            {testResult.error}
                          </AlertDescription>
                        </Alert>
                      ) : (
                        /* Handle success results */
                        <div className="space-y-4">
                          {/* Main Result */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Result</div>
                              <Badge variant="outline" className="w-fit">
                                {testResult.result ? "Achieved" : "Not Achieved"}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Confidence</div>
                              <div className="text-xl font-semibold">
                                {(testResult.confidence * 100).toFixed(1)}%
                              </div>
                            </div>
                          </div>

                          {/* Validators Information */}
                          {testResult.validators.length > 0 && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <ListChecks className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  Validators ({testResult.validators.filter(v => v.result).length}/{testResult.validators.length} passed)
                                </span>
                              </div>
                              <div className="space-y-2">
                                {testResult.validators.map((validator, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                                  >
                                    <div className="flex-shrink-0 mt-0.5">
                                      {validator.result ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <XCircle className="h-4 w-4 text-red-600" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm">
                                        {validator.description}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Policy Information */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Policy</span>
                            </div>
                            <div className="bg-muted rounded-lg p-3 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Min Validators:</span>
                                <span className="font-medium">{testResult.policy.minValidatorsPassed}%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Min Confidence:</span>
                                <span className="font-medium">{testResult.policy.minConfidence}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Loading state */
                    <div className="flex items-center justify-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p className="text-sm">Analyzing video...</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      )}

    </div>
  );
}
