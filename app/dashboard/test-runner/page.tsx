"use client";

import { useState, useRef, useEffect } from "react";
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
// Drawer imports removed - mobile now shows full functionality inline
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
import { TestVideoCard } from "@/components/test-video-card";
import { createPresignedGet } from "@/lib/actions";

interface VideoTestResult extends MilestoneVideo {
  testResult?: AnalyzeResult;
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
  
  // Note: Mobile drawer removed - mobile cards now show full functionality inline

  // Filter videos for the selected milestone
  const filteredVideos = selectedMilestone
    ? milestoneVideos.filter((v) => v.milestoneId === selectedMilestone.id)
    : [];

  const idsKey = filteredVideos.map((v) => `${v.id}:${v.videoPath}`).join("|");

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const [videoUrls, setVideoUrls] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (filteredVideos.length === 0) {
        setVideoUrls(new Map());
        return;
      }
      try {
        const entries = await Promise.all(
          filteredVideos.map(async (v) => {
            const { url } = await createPresignedGet({ key: v.videoPath, expiresIn: 3600 });
            return [v.id, url] as const;
          })
        );
        if (!cancelled) setVideoUrls(new Map(entries));
      } catch (e) {
        console.error("Failed to fetch presigned URLs", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [idsKey]);

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

  // New function that returns results instead of updating state
  const runSingleTestForResult = async (video: MilestoneVideo) => {
    if (!selectedMilestone) {
      return {
        video,
        testResult: { error: "Internal server error" } as AnalyzeResult,
      };
    }

    try {
      const url = videoUrls.get(video.id);
      if (!url) {
        return {
          video,
          testResult: { error: "Internal server error" } as AnalyzeResult,
        };
      }

      const data: AnalyzeResult = await analyzeMilestoneVideo({
        videoUrl: url,
        milestoneId: selectedMilestone.id,
      });

      // For successful results, persist to database
      if (!("error" in data)) {
        const expectedResult = video.achievedMilestone === "true";
        const actualResult = data.result;
        const isCorrect = expectedResult === actualResult;
        
        try {
          await addTestResult({
            milestoneId: selectedMilestone.id,
            videoId: video.id,
            success: isCorrect,
            result: actualResult,
            confidence: Math.round(data.confidence * 100),
            error: null,
          });
        } catch (dbError) {
          console.error("Failed to save test result to database:", dbError);
        }
      }

      return { video, testResult: data };
    } catch (error) {
      return {
        video,
        testResult: { error: "Internal server error" } as AnalyzeResult,
      };
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

    const { testResult } = await runSingleTestForResult(video);

    // Update state with result
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

    // Show toast notifications
    if ("error" in testResult) {
      toast.error(`API error for ${video.videoPath.split("_")[0]}`);
    } else {
      const expectedResult = video.achievedMilestone === "true";
      const actualResult = testResult.result;
      const isCorrect = expectedResult === actualResult;
      
      if (isCorrect) {
        toast.success(`Test passed for ${video.videoPath.split("_")[0]}`);
      } else {
        toast.error(`Test failed for ${video.videoPath.split("_")[0]}`);
      }
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
      // Run tests for all videos in parallel and collect results
      const results = await Promise.all(
        filteredVideos.map((video) => runSingleTestForResult(video))
      );

      // Update state with all results at once
      const newResults = new Map();
      results.forEach(({ video, testResult }) => {
        newResults.set(video.id, {
          ...video,
          testResult,
          isRunning: false,
        });
      });
      setVideoResults(newResults);

      // Count results from actual data
      const passedTests = results.filter(({ video, testResult }) => {
        if ("error" in testResult) return false;
        const expectedResult = video.achievedMilestone === "true";
        const actualResult = testResult.result;
        return expectedResult === actualResult;
      }).length;
      const totalTests = filteredVideos.length;

      // Show individual toast notifications
      results.forEach(({ video, testResult }) => {
        if ("error" in testResult) {
          toast.error(`API error for ${video.videoPath.split("_")[0]}`);
        } else {
          const expectedResult = video.achievedMilestone === "true";
          const actualResult = testResult.result;
          const isCorrect = expectedResult === actualResult;
          
          if (isCorrect) {
            toast.success(`Test passed for ${video.videoPath.split("_")[0]}`);
          } else {
            toast.error(`Test failed for ${video.videoPath.split("_")[0]}`);
          }
        }
      });

      // Show summary toast
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



  const handleShowHistory = (video: MilestoneVideo) => {
    setSelectedVideoForHistory(video);
    setHistoryModalOpen(true);
  };

  const handleShowMilestoneHistory = () => {
    setMilestoneHistoryModalOpen(true);
  };

  // Mobile video details now shown inline - no drawer needed

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
                <TestVideoCard
                  key={video.id}
                  video={video}
                  videoUrl={videoUrls.get(video.id)}
                  videoResult={videoResults.get(video.id)}
                  onRunTest={runSingleTest}
                  onShowHistory={handleShowHistory}
                  onDelete={handleDeleteVideo}
                  onShowDetails={() => {}} // No longer needed - mobile shows details inline
                  isDeleting={deletingVideoId === video.id}
                />
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

      {/* Mobile drawer removed - all functionality now available inline in mobile cards */}
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
