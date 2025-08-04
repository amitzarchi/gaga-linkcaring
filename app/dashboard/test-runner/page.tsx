"use client";

import { useState, useRef } from "react";
import { useMilestones } from "../../context/milestones-context";
import { useMilestoneVideos } from "../../context/milestone-videos-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { Milestone, MilestoneVideo } from "@/lib/defs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ChevronDownIcon, 
  CheckIcon, 
  Upload, 
  Play, 
  Video,
  Loader2,
  X,
  TestTube,
  PlayCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MilestoneSelectorProps {
  selectedMilestone: Milestone | null;
  onSelect: (milestone: Milestone) => void;
}

function MilestoneSelector({ selectedMilestone, onSelect }: MilestoneSelectorProps) {
  const { milestones } = useMilestones();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const triggerContent = (
    <div className={cn(
      "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-6 py-4 text-left shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px]",
      "cursor-pointer"
    )}>
      <div className="flex flex-col gap-1">
        {selectedMilestone ? (
          <>
            <span className="font-medium text-lg">{selectedMilestone.name}</span>
            <Badge variant="secondary" className="w-fit">
              {selectedMilestone.category}
            </Badge>
          </>
        ) : (
          <span className="text-muted-foreground text-lg">Select a milestone...</span>
        )}
      </div>
      <ChevronDownIcon className="h-5 w-5 opacity-50" />
    </div>
  );

  const milestoneList = (
    <ScrollArea className="h-[400px] p-4">
      <div className="space-y-2">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
            onClick={() => {
              onSelect(milestone);
              setOpen(false);
            }}
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium">{milestone.name}</span>
              <Badge variant="outline" className="w-fit text-xs">
                {milestone.category}
              </Badge>
            </div>
            {selectedMilestone?.id === milestone.id && (
              <CheckIcon className="h-4 w-4 text-primary" />
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <div>{triggerContent}</div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select Milestone</DrawerTitle>
          </DrawerHeader>
          {milestoneList}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>{triggerContent}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Milestone</DialogTitle>
        </DialogHeader>
        {milestoneList}
      </DialogContent>
    </Dialog>
  );
}

interface TestResult {
  success: boolean;
  result: boolean;
  confidence?: number;
  error?: string;
}

interface VideoTestResult extends MilestoneVideo {
  testResult?: TestResult;
  isRunning?: boolean;
}

export default function TestRunnerPage() {
  const { milestones, selectedMilestone, setSelectedMilestone } = useMilestones();
  const { milestoneVideos, addMilestoneVideo, removeMilestoneVideo } = useMilestoneVideos();
  
  // Add video form state
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState("");
  const [achievedMilestone, setAchievedMilestone] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Testing state
  const [videoResults, setVideoResults] = useState<Map<number, VideoTestResult>>(new Map());
  const [isRunningBulkTest, setIsRunningBulkTest] = useState(false);
  
  // Delete state
  const [deletingVideoId, setDeletingVideoId] = useState<number | null>(null);

  // Filter videos for the selected milestone
  const filteredVideos = selectedMilestone
    ? milestoneVideos.filter((v) => v.milestoneId === selectedMilestone.id)
    : [];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setVideoName(file.name.split('.')[0]);
      } else {
        toast.error('Please select a valid video file');
      }
    }
  };

  const handleAddVideo = async () => {
    if (!selectedFile || !videoName.trim() || !selectedMilestone) {
      toast.error('Please select a file, enter a video name, and select a milestone');
      return;
    }

    setIsUploading(true);
    try {
      await addMilestoneVideo({
        milestoneId: selectedMilestone.id,
        achievedMilestone: achievedMilestone ? "true" : "false",
        videoFile: selectedFile,
        videoName: videoName.trim(),
      });

      // Reset form
      setSelectedFile(null);
      setVideoName("");
      setAchievedMilestone(false);
      setIsAddingVideo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error('Error adding video:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const runSingleTest = async (video: MilestoneVideo) => {
    if (!selectedMilestone) return;

    // Set loading state
    setVideoResults(prev => new Map(prev.set(video.id, { 
      ...video, 
      isRunning: true 
    })));

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/test-milestone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoPath: video.videoPath,
          milestoneId: selectedMilestone.id,
          achievedMilestone: video.achievedMilestone === "true"
        }),
      });

      const data = await response.json();
      
      const testResult: TestResult = {
        success: data.result === (video.achievedMilestone === "true"),
        result: data.result,
        confidence: data.confidence,
        error: data.error
      };

      setVideoResults(prev => new Map(prev.set(video.id, {
        ...video,
        testResult,
        isRunning: false
      })));

      if (testResult.success) {
        toast.success(`Test passed for ${video.videoPath}`);
      } else {
        toast.error(`Test failed for ${video.videoPath}`);
      }
    } catch (error) {
      const testResult: TestResult = {
        success: false,
        result: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      setVideoResults(prev => new Map(prev.set(video.id, {
        ...video,
        testResult,
        isRunning: false
      })));

      toast.error(`API error for ${video.videoPath}`);
    }
  };

  const runBulkTest = async () => {
    if (!selectedMilestone || filteredVideos.length === 0) return;

    setIsRunningBulkTest(true);
    
    // Set all videos to loading state
    const loadingResults = new Map();
    filteredVideos.forEach(video => {
      loadingResults.set(video.id, { ...video, isRunning: true });
    });
    setVideoResults(loadingResults);

    try {
      // Run tests for all videos in parallel
      await Promise.all(filteredVideos.map(video => runSingleTest(video)));
      
      const passedTests = Array.from(videoResults.values()).filter(v => v.testResult?.success).length;
      const totalTests = filteredVideos.length;
      
      toast.success(`Bulk test completed: ${passedTests}/${totalTests} tests passed`);
    } catch (error) {
      toast.error('Error running bulk test');
    } finally {
      setIsRunningBulkTest(false);
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    setDeletingVideoId(videoId);
    try {
      await removeMilestoneVideo(videoId);
      // Remove from videoResults state as well
      setVideoResults(prev => {
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
      return result.testResult.success 
        ? <CheckCircle2 className="h-4 w-4 text-green-500" />
        : <XCircle className="h-4 w-4 text-red-500" />;
    }
    
    return <TestTube className="h-4 w-4 text-gray-400" />;
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

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Milestone Test Runner</h1>
        <p className="text-muted-foreground">
          Select a milestone to view videos and run AI tests
        </p>
      </div>

      {/* Milestone Selector */}
      <MilestoneSelector
        selectedMilestone={selectedMilestone}
        onSelect={setSelectedMilestone}
      />

      {selectedMilestone && (
        <div className="space-y-6">
          {/* Header with bulk actions */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Videos for {selectedMilestone.name}
              </h2>
              <p className="text-muted-foreground">
                {filteredVideos.length} videos • Test milestone completion accuracy
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={runBulkTest}
                disabled={filteredVideos.length === 0 || isRunningBulkTest}
                className="gap-2"
              >
                {isRunningBulkTest ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlayCircle className="h-4 w-4" />
                )}
                Run All Tests
              </Button>
              <Button
                onClick={() => setIsAddingVideo(true)}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Add Video
              </Button>
            </div>
          </div>

          {/* Add Video Form */}
          {isAddingVideo && (
            <Card>
              <CardHeader>
                <CardTitle>Add Test Video</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="videoFile">Video File</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      ref={fileInputRef}
                      className="flex-1"
                    />
                    {selectedFile && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Video className="h-4 w-4" />
                        {formatFileSize(selectedFile.size)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoName">Video Name</Label>
                  <Input
                    id="videoName"
                    value={videoName}
                    onChange={(e) => setVideoName(e.target.value)}
                    placeholder="Enter video name..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="achievedMilestone"
                    checked={achievedMilestone}
                    onCheckedChange={setAchievedMilestone}
                  />
                  <Label htmlFor="achievedMilestone">
                    Baby completed the milestone in this video
                  </Label>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleAddVideo}
                    disabled={!selectedFile || !videoName.trim() || isUploading}
                    className="gap-2"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Add Video
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingVideo(false);
                      setSelectedFile(null);
                      setVideoName("");
                      setAchievedMilestone(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Videos List */}
          <div className="space-y-4">
            {filteredVideos.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    No videos found for this milestone.
                  </p>
                  <Button onClick={() => setIsAddingVideo(true)}>
                    Add First Video
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredVideos.map((video) => (
                <Card key={video.id}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Video Preview */}
                      <div className="space-y-3">
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
                          <div className="flex items-center gap-2">
                            <Badge variant={video.achievedMilestone === "true" ? "default" : "secondary"}>
                              {video.achievedMilestone === "true" ? "Completed" : "Not Completed"}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(video.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{video.videoPath.split('_')[0]}</h3>
                            <p className="text-sm text-muted-foreground">
                              Expected: {video.achievedMilestone === "true" ? "Milestone completed" : "Milestone not completed"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteVideo(video.id)}
                            disabled={deletingVideoId === video.id}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            {deletingVideoId === video.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Test Results */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getResultIcon(video)}
                            <span className="text-sm font-medium">Test Result</span>
                          </div>
                          {getResultBadge(video)}
                        </div>

                        {videoResults.get(video.id)?.testResult && (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>API Result:</span>
                              <Badge variant="outline">
                                {videoResults.get(video.id)?.testResult?.result ? "Completed" : "Not Completed"}
                              </Badge>
                            </div>
                            {videoResults.get(video.id)?.testResult?.confidence && (
                              <div className="flex justify-between">
                                <span>Confidence:</span>
                                <span>{(videoResults.get(video.id)?.testResult?.confidence! * 100).toFixed(1)}%</span>
                              </div>
                            )}
                            {videoResults.get(video.id)?.testResult?.error && (
                              <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                  {videoResults.get(video.id)?.testResult?.error}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        )}

                        <Button
                          onClick={() => runSingleTest(video)}
                          disabled={videoResults.get(video.id)?.isRunning}
                          className="w-full gap-2"
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
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {!selectedMilestone && (
        <Card>
          <CardContent className="p-8 text-center">
            <TestTube className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Please select a milestone to start testing videos.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}