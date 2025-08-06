"use client";

import { useTestResults, TestResultWithDetails } from "@/app/context/test-results-context";
import { MilestoneVideo } from "@/lib/defs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { CheckCircle2, XCircle, AlertCircle, History, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface VideoHistoryModalProps {
  video: MilestoneVideo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MilestoneHistoryModalProps {
  milestone: { id: number; name: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

function VideoHistoryContent({ video }: { video: MilestoneVideo }) {
  const { getTestResultsByVideo } = useTestResults();
  const videoHistory = getTestResultsByVideo(video.id);

  return (
    <ScrollArea className="h-[60vh] pr-4">
      {videoHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg mb-2">No Test History</h3>
          <p className="text-muted-foreground">
            No tests have been run for this video yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {videoHistory.map((result: TestResultWithDetails) => (
            <Card key={result.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">
                      {formatDate(result.createdAt)}
                    </span>
                  </div>
                  <Badge variant={result.success ? "default" : "destructive"}>
                    {result.success ? "PASS" : "FAIL"}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">API Result:</span>
                    <Badge variant="outline">
                      {result.result ? "Completed" : "Not Completed"}
                    </Badge>
                  </div>
                  
                  {result.confidence && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span>{result.confidence}%</span>
                    </div>
                  )}

                  {result.achievedMilestone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected:</span>
                      <Badge variant={result.achievedMilestone === "true" ? "default" : "secondary"}>
                        {result.achievedMilestone === "true" ? "Achieved" : "Not Achieved"}
                      </Badge>
                    </div>
                  )}
                  
                  {result.error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {result.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}

function MilestoneHistoryContent({ milestone }: { milestone: { id: number; name: string } }) {
  const { getTestResultsByMilestone } = useTestResults();
  const milestoneHistory = getTestResultsByMilestone(milestone.id);

  return (
    <ScrollArea className="h-[60vh] pr-4">
      {milestoneHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg mb-2">No Test History</h3>
          <p className="text-muted-foreground">
            No tests have been run for any videos in this milestone yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {milestoneHistory.map((result: TestResultWithDetails) => (
            <Card key={result.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {formatDate(result.createdAt)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {result.videoPath ? result.videoPath.split("_")[0] : 'Unknown Video'}
                      </span>
                    </div>
                  </div>
                  <Badge variant={result.success ? "default" : "destructive"}>
                    {result.success ? "PASS" : "FAIL"}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">API Result:</span>
                    <Badge variant="outline">
                      {result.result ? "Completed" : "Not Completed"}
                    </Badge>
                  </div>
                  
                  {result.confidence && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span>{result.confidence}%</span>
                    </div>
                  )}

                  {result.achievedMilestone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected:</span>
                      <Badge variant={result.achievedMilestone === "true" ? "default" : "secondary"}>
                        {result.achievedMilestone === "true" ? "Achieved" : "Not Achieved"}
                      </Badge>
                    </div>
                  )}
                  
                  {result.error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {result.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}

export function VideoHistoryModal({ video, open, onOpenChange }: VideoHistoryModalProps) {
  const isMobile = useIsMobile();

  if (!video) return null;

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Test History - {video.videoPath.split("_")[0]}
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <VideoHistoryContent video={video} />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl max-h-[85vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Test History - {video.videoPath.split("_")[0]}
              </DialogTitle>
            </DialogHeader>
            <VideoHistoryContent video={video} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export function MilestoneHistoryModal({ milestone, open, onOpenChange }: MilestoneHistoryModalProps) {
  const isMobile = useIsMobile();

  if (!milestone) return null;

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                All Test History - {milestone.name}
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <MilestoneHistoryContent milestone={milestone} />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-4xl max-h-[85vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                All Test History - {milestone.name}
              </DialogTitle>
            </DialogHeader>
            <MilestoneHistoryContent milestone={milestone} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}