"use client";

import { useState, useRef } from "react";
import { analyzeMilestoneVideo } from "@/lib/endpoints";
import { useMilestones } from "../../context/milestones-context";
import { useMilestoneVideos } from "../../context/milestone-videos-context";
import { useTestResults } from "../../context/test-results-context";
import { AnalyzeResult, MilestoneVideo } from "@/lib/defs";

import Lottie from "lottie-react";
import forwardIconAnimation from "@/public/forwardIcon.json";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Upload,
  Play,
  Video,
  Loader2,
  X,
  TestTube,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  PlusIcon,
  FlaskConical,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { MilestoneSelector } from "@/components/milestone-selector";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { IconWithBadge } from "@/components/icon-with-badge";
import VideoUploader from "@/components/video-uploader";
import { VideoHistoryModal, MilestoneHistoryModal } from "@/components/test-history";

interface TestResult {
  success: boolean;
  result: boolean;
  confidence: number;
  error?: string;
}

interface VideoTestResult extends MilestoneVideo {
  testResult?: TestResult;
  isRunning?: boolean;
}

export default function TestRunnerPage() {
  const { milestones, selectedMilestone, setSelectedMilestone } =
    useMilestones();
  const { milestoneVideos, addMilestoneVideo, removeMilestoneVideo } =
    useMilestoneVideos();
  const { testResults, addTestResult } = useTestResults();

  // Add video form state
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState("");
  const [achievedMilestone, setAchievedMilestone] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);

  // Testing state
  const [videoResults, setVideoResults] = useState<
    Map<number, VideoTestResult>
  >(new Map());
  const [isRunningBulkTest, setIsRunningBulkTest] = useState(false);

  // Delete state
  const [deletingVideoId, setDeletingVideoId] = useState<number | null>(null);

  // History modal state
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedVideoForHistory, setSelectedVideoForHistory] = useState<MilestoneVideo | null>(null);
  
  // Milestone history modal state
  const [milestoneHistoryModalOpen, setMilestoneHistoryModalOpen] = useState(false);
  
  // Drawer state for mobile video details
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedVideoForDrawer, setSelectedVideoForDrawer] = useState<MilestoneVideo | null>(null);

  // Filter videos for the selected milestone
  const filteredVideos = selectedMilestone
    ? milestoneVideos.filter((v) => v.milestoneId === selectedMilestone.id)
    : [];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      setVideoName(file.name.split(".")[0]);
    } else {
      setVideoName("");
    }
  };

  const handleAddVideo = async () => {
    if (!selectedFile || !videoName.trim() || !selectedMilestone || achievedMilestone === undefined) {
      toast.error(
        "Please select a file, enter a video name, select a milestone, and specify if the milestone was achieved"
      );
      return;
    }

    setIsUploading(true);
    try {
      await addMilestoneVideo({
        milestoneId: selectedMilestone.id,
        achievedMilestone: achievedMilestone,
        videoFile: selectedFile,
        videoName: videoName.trim(),
      });

      // Reset form
      setSelectedFile(null);
      setVideoName("");
      setAchievedMilestone(undefined);
      setIsAddingVideo(false);
    } catch (error) {
      console.error("Error adding video:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const runSingleTest = async (video: MilestoneVideo) => {
    if (!selectedMilestone) return;

    // Set loading state
    setVideoResults(
      (prev) =>
        new Map(
          prev.set(video.id, {
            ...video,
            isRunning: true,
          })
        )
    );

    try {
      const data: AnalyzeResult = await analyzeMilestoneVideo({
        videoPath: video.videoPath,
        milestoneId: selectedMilestone.id,
      });

      // Handle error-shaped result
      if ("error" in data) {
        const testResult: TestResult = {
          success: false,
          result: false,
          confidence: 0,
          error: data.error,
        };

        setVideoResults(
          (prev) =>
            new Map(
              prev.set(video.id, {
                ...video,
                testResult,
                isRunning: false,
              })
            )
        );

        // Do not persist unsuccessful responses
        toast.error(`API error for ${video.videoPath.split("_")[0]}`);
        return;
      }

      // Success-shaped result
      const testResult: TestResult = {
        success: data.result === (video.achievedMilestone === "true"),
        result: data.result,
        confidence: data.confidence,
      };

      setVideoResults(
        (prev) =>
          new Map(
            prev.set(video.id, {
              ...video,
              testResult,
              isRunning: false,
            })
          )
      );

      // Only persist successful test runs
      if (testResult.success) {
        try {
          await addTestResult({
            milestoneId: selectedMilestone.id,
            videoId: video.id,
            success: true,
            result: testResult.result,
            confidence:
              typeof testResult.confidence === "number"
                ? Math.round(testResult.confidence * 100)
                : null,
            error: null,
          });
        } catch (dbError) {
          console.error("Failed to save test result to database:", dbError);
        }
        toast.success(`Test passed for ${video.videoPath.split("_")[0]}`);
      } else {
        toast.error(`Test failed for ${video.videoPath.split("_")[0]}`);
      }
    } catch (error) {
      const testResult: TestResult = {
        success: false,
        result: false,
        confidence: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };

      setVideoResults(
        (prev) =>
          new Map(
            prev.set(video.id, {
              ...video,
              testResult,
              isRunning: false,
            })
          )
      );

      // Do not persist unsuccessful responses
      toast.error(`API error for ${video.videoPath.split("_")[0]}`);
    }
  };

  const runBulkTest = async () => {
    if (!selectedMilestone || filteredVideos.length === 0) return;

    setIsRunningBulkTest(true);

    // Set all videos to loading state
    const loadingResults = new Map();
    filteredVideos.forEach((video) => {
      loadingResults.set(video.id, { ...video, isRunning: true });
    });
    setVideoResults(loadingResults);

    try {
      // Run tests for all videos in parallel
      await Promise.all(filteredVideos.map((video) => runSingleTest(video)));

      const passedTests = Array.from(videoResults.values()).filter(
        (v) => v.testResult?.success
      ).length;
      const totalTests = filteredVideos.length;

      toast.success(
        `Bulk test completed: ${passedTests}/${totalTests} tests passed`
      );
    } catch (error) {
      toast.error("Error running bulk test");
    } finally {
      setIsRunningBulkTest(false);
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    setDeletingVideoId(videoId);
    try {
      await removeMilestoneVideo(videoId);
      // Remove from videoResults state as well
      setVideoResults((prev) => {
        const newMap = new Map(prev);
        newMap.delete(videoId);
        return newMap;
      });
    } catch (error) {
      console.error("Error deleting video:", error);
    } finally {
      setDeletingVideoId(null);
    }
  };

  const getResultIcon = (video: MilestoneVideo) => {
    const result = videoResults.get(video.id);

    if (result?.isRunning) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }

    if (result?.testResult) {
      return result.testResult.success ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      );
    }

    return <FlaskConical className="size-4 text-gray-600" />;
  };

  const getResultBadge = (video: MilestoneVideo) => {
    const result = videoResults.get(video.id);

    if (result?.isRunning) {
      return <Badge variant="secondary">Testing...</Badge>;
    }

    if (result?.testResult) {
      return (
        <Badge variant={result.testResult.success ? "default" : "destructive"}>
          {result.testResult.success ? "PASS" : "FAIL"}
        </Badge>
      );
    }

    return <Badge variant="outline">Not Tested</Badge>;
  };

  const handleShowHistory = (video: MilestoneVideo) => {
    setSelectedVideoForHistory(video);
    setHistoryModalOpen(true);
  };

  const handleShowMilestoneHistory = () => {
    setMilestoneHistoryModalOpen(true);
  };

  const handleShowVideoDetails = (video: MilestoneVideo) => {
    setSelectedVideoForDrawer(video);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="space-y-0 w-full">
        <h1 className="text-lg font-semibold w-full">
          Milestone Test Runner
        </h1>
        <p className="text-sm text-muted-foreground font-medium w-full">
          Manage videos and run tests.
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
        <div className="space-y-4 w-full">
          {/* Header with bulk actions */}
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-lg font-medium">Test Videos</h2>
              <p className="text-sm text-muted-foreground">
                {filteredVideos.length} videos • Test milestone completion
                accuracy
              </p>
            </div>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleShowMilestoneHistory}
                    className="size-9 rounded-full p-0 flex items-center justify-center cursor-pointer"
                    size="icon"
                    variant="outline"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View All Test History</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsAddingVideo(true)}
                    className="size-9 rounded-full p-0 flex items-center justify-center cursor-pointer"
                    size="icon"
                    variant="outline"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Video</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={runBulkTest}
                    disabled={filteredVideos.length === 0 || isRunningBulkTest}
                    className="size-9 rounded-full p-0 flex items-center justify-center cursor-pointer"
                    size="icon"
                  >
                    <ForwardIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Run All Tests</p>
                </TooltipContent>
              </Tooltip>

            </div>
          </div>
          <Separator className="w-full" />

          {/* Add Video Form */}
          {isAddingVideo && (
            <Card className="w-full py-6 px-0">
              <CardHeader>
                <CardTitle>Add Test Video</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Video Uploader */}
                <VideoUploader onFileChange={handleFileChange} />

                {/* Video Name and Achievement Toggle Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Video Name - 1/2 width */}
                  <div className="space-y-2">
                    <Label htmlFor="videoName">Video Name</Label>
                    <Input
                      id="videoName"
                      value={videoName}
                      onChange={(e) => setVideoName(e.target.value)}
                      placeholder="Enter video name..."
                    />
                  </div>

                  {/* Achievement Toggle - responsive */}
                  <div className="space-y-2">
                    <Label>Achievement Status</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        type="button"
                        variant={achievedMilestone === "true" ? "default" : "outline"}
                        onClick={() => setAchievedMilestone("true")}
                        className={cn(
                          "sm:flex-1 w-full sm:w-auto",
                          achievedMilestone === "true" 
                            ? "bg-green-600 hover:bg-green-700 border-green-600 text-white" 
                            : "border-green-600 text-green-600 hover:bg-green-50"
                        )}
                      >
                        Achieved
                      </Button>
                      <Button
                        type="button"
                        variant={achievedMilestone === "false" ? "default" : "outline"}
                        onClick={() => setAchievedMilestone("false")}
                        className={cn(
                          "sm:flex-1 w-full sm:w-auto",
                          achievedMilestone === "false" 
                            ? "bg-red-600 hover:bg-red-700 border-red-600 text-white" 
                            : "border-red-600 text-red-600 hover:bg-red-50"
                        )}
                      >
                        Not Achieved
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingVideo(false);
                      setSelectedFile(null);
                      setVideoName("");
                      setAchievedMilestone(undefined);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddVideo}
                    disabled={!selectedFile || !videoName.trim() || achievedMilestone === undefined || isUploading}
                    className="gap-2"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Add Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Videos List */}
          <div className="space-y-3 w-full">
            {filteredVideos.length === 0 ? (
              <div className="flex flex-col gap-6 items-center justify-center py-12">
                <IconWithBadge
                  icon={Video}
                  badgeText="0"
                  badgeColor="yellow"
                  size="lg"
                />
                <div className="flex flex-col gap-0 text-md items-center justify-center">
                  <h2 className=" font-medium">No Videos</h2>
                  <p className="text-muted-foreground font-medium text-center">
                    No videos found for this milestone.
                  </p>
                </div>
                <Button
                  className="font-semibold"
                  onClick={() => setIsAddingVideo(true)}
                >
                  Add First Video
                </Button>
              </div>
            ) : (
              filteredVideos.map((video) => (
                <Card key={video.id} className="w-full">
                  <CardContent className="p-4">
                    {/* Desktop Layout (lg and up) */}
                    <div className="hidden lg:block">
                      <div className="grid grid-cols-12 gap-6">
                        {/* Video Preview - 1/3 width (4 columns) */}
                        <div className="col-span-4 space-y-3">
                          <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            <video
                              controls
                              className="w-full h-full object-contain"
                              src={`/api/files/${video.videoPath}`}
                            >
                              Your browser does not support video playback.
                            </video>
                          </div>
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
                        </div>

                        {/* Test Section - 1/2 of remaining width (6 columns) */}
                        <div className="col-span-6 flex flex-col justify-between">
                          {/* Test Result */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getResultIcon(video)}
                                <span className="text-sm font-medium">
                                  Test Result
                                </span>
                              </div>
                              {getResultBadge(video)}
                            </div>

                            {videoResults.get(video.id)?.testResult && (
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>API Result:</span>
                                  <Badge variant="outline">
                                    {videoResults.get(video.id)?.testResult
                                      ?.result
                                      ? "Completed"
                                      : "Not Completed"}
                                  </Badge>
                                </div>
                                {videoResults.get(video.id)?.testResult
                                  ?.confidence && (
                                  <div className="flex justify-between">
                                    <span>Confidence:</span>
                                    <span>
                                      {(
                                        videoResults.get(video.id)?.testResult
                                          ?.confidence! * 100
                                      ).toFixed(1)}
                                      %
                                    </span>
                                  </div>
                                )}
                                {videoResults.get(video.id)?.testResult
                                  ?.error && (
                                  <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                      {
                                        videoResults.get(video.id)?.testResult
                                          ?.error
                                      }
                                    </AlertDescription>
                                  </Alert>
                                )}
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={() => runSingleTest(video)}
                            disabled={videoResults.get(video.id)?.isRunning}
                            className="w-full"
                            variant="outline"
                          >
                            {videoResults.get(video.id)?.isRunning ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                            Run Test
                          </Button>
                        </div>

                        {/* Actions - Remaining width (2 columns) */}
                        <div className="col-span-2 space-y-1">
                          <Button
                            variant="outline"
                            onClick={() => handleShowHistory(video)}
                            className="w-full h-2/3 gap-2 text-sm"
                          >
                            <History className="h-3 w-3" />
                            History
                          </Button>

                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteVideo(video.id)}
                            disabled={deletingVideoId === video.id}
                            className="w-full h-1/3 gap-2 text-sm"
                          >
                            {deletingVideoId === video.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile/Tablet Layout (below lg) */}
                    <div className="lg:hidden">
                      <div 
                        className="cursor-pointer"
                        onClick={() => handleShowVideoDetails(video)}
                      >
                        <div className="space-y-3">
                          {/* Video Preview */}
                          <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            <video
                              className="w-full h-full object-contain pointer-events-none"
                              src={`/api/files/${video.videoPath}`}
                            >
                              Your browser does not support video playback.
                            </video>
                          </div>
                          
                          {/* Video Info Row */}
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                              <h3 className="font-medium text-sm">
                                {video.videoPath.split("_")[0]}
                              </h3>
                              <div className="flex items-center gap-2">
                                {getResultIcon(video)}
                                {getResultBadge(video)}
                              </div>
                            </div>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {!selectedMilestone && (
        <div className="flex justify-center">
          <Card className="w-full">
            <CardContent className="p-6 text-center">
              <TestTube className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Please select a milestone to start testing videos.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* History Modals */}
      <VideoHistoryModal
        video={selectedVideoForHistory}
        open={historyModalOpen}
        onOpenChange={setHistoryModalOpen}
      />
      
      <MilestoneHistoryModal
        milestone={selectedMilestone}
        open={milestoneHistoryModalOpen}
        onOpenChange={setMilestoneHistoryModalOpen}
      />

      {/* Video Details Drawer for Mobile */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>
              {selectedVideoForDrawer?.videoPath.split("_")[0]}
            </DrawerTitle>
            <DrawerDescription>
              Video details and test results
            </DrawerDescription>
          </DrawerHeader>
          
          {selectedVideoForDrawer && (
            <div className="px-4 pb-4 space-y-4 overflow-y-auto">
              {/* Video Player */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  controls
                  className="w-full h-full object-contain"
                  src={`/api/files/${selectedVideoForDrawer.videoPath}`}
                >
                  Your browser does not support video playback.
                </video>
              </div>

              {/* Video Info */}
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">
                  {selectedVideoForDrawer.videoPath.split("_")[0]}
                </h3>
                <Badge
                  variant={
                    selectedVideoForDrawer.achievedMilestone === "true"
                      ? "default"
                      : "secondary"
                  }
                >
                  {selectedVideoForDrawer.achievedMilestone === "true"
                    ? "Achieved"
                    : "Not Achieved"}
                </Badge>
              </div>

              {/* Test Results */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getResultIcon(selectedVideoForDrawer)}
                    <span className="text-sm font-medium">Test Result</span>
                  </div>
                  {getResultBadge(selectedVideoForDrawer)}
                </div>

                {videoResults.get(selectedVideoForDrawer.id)?.testResult && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>API Result:</span>
                      <Badge variant="outline">
                        {videoResults.get(selectedVideoForDrawer.id)?.testResult
                          ?.result
                          ? "Completed"
                          : "Not Completed"}
                      </Badge>
                    </div>
                    {videoResults.get(selectedVideoForDrawer.id)?.testResult
                      ?.confidence && (
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <span>
                          {(
                            videoResults.get(selectedVideoForDrawer.id)?.testResult
                              ?.confidence! * 100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    )}
                    {videoResults.get(selectedVideoForDrawer.id)?.testResult
                      ?.error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {
                            videoResults.get(selectedVideoForDrawer.id)?.testResult
                              ?.error
                          }
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <DrawerFooter>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => selectedVideoForDrawer && runSingleTest(selectedVideoForDrawer)}
                disabled={selectedVideoForDrawer ? videoResults.get(selectedVideoForDrawer.id)?.isRunning : false}
                variant="outline"
                className="gap-2"
              >
                {selectedVideoForDrawer && videoResults.get(selectedVideoForDrawer.id)?.isRunning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Run Test
              </Button>
              
              <Button
                variant="outline"
                onClick={() => selectedVideoForDrawer && handleShowHistory(selectedVideoForDrawer)}
                className="gap-2"
              >
                <History className="h-4 w-4" />
                History
              </Button>

              <Button
                variant="destructive"
                onClick={() => selectedVideoForDrawer && handleDeleteVideo(selectedVideoForDrawer.id)}
                disabled={selectedVideoForDrawer ? deletingVideoId === selectedVideoForDrawer.id : false}
                className="gap-2"
              >
                {selectedVideoForDrawer && deletingVideoId === selectedVideoForDrawer.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </Button>
            </div>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function ForwardIcon() {
  return (
    <Lottie
      animationData={forwardIconAnimation}
      style={{ width: 20, height: 20, strokeWidth: 5 }}
      loop={false}
      autoplay={true}
      
    />
  );
}
