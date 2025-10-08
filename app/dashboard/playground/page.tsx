"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MilestoneSelector } from "@/components/milestone-selector";
import { useMilestones } from "@/app/context/milestones-context";
import { AnalyzeResult } from "@/lib/defs";
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import {
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FlaskConical,
  Shield,
  ListChecks,
  FileUpIcon,
  FileIcon,
  VideoIcon,
} from "lucide-react";

// Client-side function to call the API route for parallel execution
const analyzeMilestoneVideoFileClient = async (params: {
  videoFile: File;
  milestoneId: number;
}): Promise<AnalyzeResult> => {
  try {
    const formData = new FormData();
    formData.append('milestoneId', params.milestoneId.toString());
    formData.append('video', params.videoFile);

    const response = await fetch("/api/analyze-milestone-file", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return { error: "Internal server error" };
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling analyze-milestone-file API:", error);
    return { error: "Internal server error" };
  }
};

interface VideoAnalysis {
  fileId: string;
  isAnalyzing: boolean;
  result: AnalyzeResult | null;
}

export default function PlaygroundPage() {
  const { selectedMilestone, setSelectedMilestone } = useMilestones();
  const [videoAnalyses, setVideoAnalyses] = useState<Map<string, VideoAnalysis>>(new Map());
  
  const maxSize = 100 * 1024 * 1024; // 100MB
  const maxFiles = 10;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    accept: "video/*",
  });

  // Function that returns the analysis result
  const analyzeVideoForResult = async (fileId: string, file: File) => {
    if (!selectedMilestone) {
      return {
        fileId,
        result: { error: "Internal server error" } as AnalyzeResult,
      };
    }

    try {
      const result = await analyzeMilestoneVideoFileClient({
        videoFile: file,
        milestoneId: selectedMilestone.id,
      });
      return { fileId, result };
    } catch (error) {
      return {
        fileId,
        result: { error: "Internal server error" } as AnalyzeResult,
      };
    }
  };

  const handleAnalyzeVideo = async (fileId: string, file: File) => {
    // Set loading state
    setVideoAnalyses(prev => {
      const newMap = new Map(prev);
      newMap.set(fileId, { fileId, isAnalyzing: true, result: null });
      return newMap;
    });

    const { result } = await analyzeVideoForResult(fileId, file);

    // Update state with result
    setVideoAnalyses(prev => {
      const newMap = new Map(prev);
      newMap.set(fileId, { fileId, isAnalyzing: false, result });
      return newMap;
    });
  };

  const handleAnalyzeAll = async () => {
    if (!selectedMilestone) return;

    // Set all videos to loading state first
    const loadingAnalyses = new Map();
    files.forEach((file) => {
      if (file.file instanceof File) {
        loadingAnalyses.set(file.id, { 
          fileId: file.id, 
          isAnalyzing: true, 
          result: null 
        });
      }
    });
    setVideoAnalyses(loadingAnalyses);

    try {
      // Run analyses for all videos in parallel, updating UI as each finishes
      const promises = files
        .filter((file) => file.file instanceof File)
        .map((file) =>
          analyzeVideoForResult(file.id, file.file as File).then(({ fileId, result }) => {
            // Update per-result immediately as each finishes
            setVideoAnalyses((prev) => {
              const next = new Map(prev);
              next.set(fileId, { fileId, isAnalyzing: false, result });
              return next;
            });
          })
        );

      // Wait for all to finish
      await Promise.all(promises);
    } catch (error) {
      console.error('Error in batch analysis:', error);
    }
  };

  const getResultIcon = (analysis?: VideoAnalysis) => {
    if (analysis?.isAnalyzing) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }

    if (analysis?.result) {
      if ("error" in analysis.result) {
        return <XCircle className="h-4 w-4 text-red-700" />;
      }
      
      return analysis.result.result ? (
        <CheckCircle2 className="h-4 w-4 text-green-700" />
      ) : (
        <XCircle className="h-4 w-4 text-orange-600" />
      );
    }

    return null;
  };

  const getResultBadge = (analysis?: VideoAnalysis) => {
    if (analysis?.isAnalyzing) {
      return <Badge variant="secondary">Analyzing...</Badge>;
    }

    if (analysis?.result) {
      if ("error" in analysis.result) {
        return <Badge variant="destructive">ERROR</Badge>;
      }
      
      return (
        <Badge variant={analysis.result.result ? "default" : "secondary"}>
          {analysis.result.result ? "ACHIEVED" : "NOT ACHIEVED"}
        </Badge>
      );
    }

    return null;
  };

  const isAnyAnalyzing = Array.from(videoAnalyses.values()).some(a => a.isAnalyzing);

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="space-y-0 w-full">
        <h1 className="text-lg font-semibold w-full">
          Playground
        </h1>
        <p className="text-sm text-muted-foreground font-medium w-full">
          Test milestone analysis with your own videos in batch.
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
          <div className="flex flex-col gap-2">
            {/* Drop area */}
            <div
              role="button"
              onClick={openFileDialog}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-dragging={isDragging || undefined}
              className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
            >
              <input
                {...getInputProps()}
                className="sr-only"
                aria-label="Upload videos"
              />

              <div className="flex flex-col items-center justify-center text-center">
                <div
                  className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                  aria-hidden="true"
                >
                  <FileUpIcon className="size-4 opacity-60" />
                </div>
                <p className="mb-1.5 text-sm font-medium">Upload videos</p>
                <p className="text-muted-foreground mb-2 text-xs">
                  Drag & drop or click to browse
                </p>
                <div className="text-muted-foreground/70 flex flex-wrap justify-center gap-1 text-xs">
                  <span>Video files only</span>
                  <span>∙</span>
                  <span>Max {maxFiles} files</span>
                  <span>∙</span>
                  <span>Up to {formatBytes(maxSize)}</span>
                </div>
              </div>
            </div>

            {errors.length > 0 && (
              <div
                className="text-destructive flex items-center gap-1 text-xs"
                role="alert"
              >
                <AlertCircle className="size-3 shrink-0" />
                <span>{errors[0]}</span>
              </div>
            )}

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-2">
                {/* Analyze All Button */}
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">{files.length} video{files.length > 1 ? 's' : ''} uploaded</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={clearFiles}
                    >
                      Clear All
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAnalyzeAll}
                      disabled={isAnyAnalyzing}
                      className="gap-2"
                    >
                      {isAnyAnalyzing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      Analyze All
                    </Button>
                  </div>
                </div>

                {/* Video Cards */}
                {files.map((file) => {
                  const analysis = videoAnalyses.get(file.id);
                  const isFile = file.file instanceof File;
                  const fileName = isFile ? file.file.name : file.file.name;
                  const fileSize = isFile ? file.file.size : file.file.size;

                  return (
                    <Card key={file.id} className="w-full">
                      <CardContent className="p-4">
                        {/* File Header */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-3 overflow-hidden flex-1">
                            <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                              <VideoIcon className="size-4 opacity-60" />
                            </div>
                            <div className="flex min-w-0 flex-col gap-0.5">
                              <p className="truncate text-[13px] font-medium">
                                {fileName}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {formatBytes(fileSize)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {getResultBadge(analysis)}
                            <Button
                              size="sm"
                              onClick={() => {
                                if (isFile) {
                                  handleAnalyzeVideo(file.id, file.file as File);
                                }
                              }}
                              disabled={analysis?.isAnalyzing || !isFile}
                              className="gap-2"
                            >
                              {analysis?.isAnalyzing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                              Analyze
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-muted-foreground/80 hover:text-foreground size-8"
                              onClick={() => removeFile(file.id)}
                              aria-label="Remove video"
                            >
                              <XCircle className="size-4" aria-hidden="true" />
                            </Button>
                          </div>
                        </div>

                        {/* Analysis Results */}
                        {analysis?.result && (
                          <div className="border-t pt-3 mt-3">
                            {"error" in analysis.result ? (
                              <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                  {analysis.result.error}
                                </AlertDescription>
                              </Alert>
                            ) : (
                              <div className="space-y-3">
                                {/* Main Result */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <div className="text-xs font-medium text-muted-foreground">Result</div>
                                    <div className="flex items-center gap-2">
                                      {getResultIcon(analysis)}
                                      <span className="text-sm font-medium">
                                        {analysis.result.result ? "Achieved" : "Not Achieved"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="text-xs font-medium text-muted-foreground">Confidence</div>
                                    <div className="text-lg font-semibold">
                                      {(analysis.result.confidence * 100).toFixed(1)}%
                                    </div>
                                  </div>
                                </div>

                                {/* Validators Summary */}
                                {analysis.result.validators.length > 0 && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <ListChecks className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-xs font-medium">
                                        Validators ({analysis.result.validators.filter(v => v.result).length}/{analysis.result.validators.length} passed)
                                      </span>
                                    </div>
                                    <div className="space-y-1.5">
                                      {analysis.result.validators.map((validator, index) => (
                                        <div
                                          key={index}
                                          className="flex items-start gap-2 p-2 bg-muted rounded text-xs"
                                        >
                                          <div className="flex-shrink-0 mt-0.5">
                                            {validator.result ? (
                                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                                            ) : (
                                              <XCircle className="h-3 w-3 text-red-600" />
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            {validator.description}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
