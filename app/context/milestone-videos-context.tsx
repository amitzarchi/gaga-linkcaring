"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { MilestoneVideo } from "@/lib/defs";
import { createMilestoneVideo, deleteMilestoneVideo } from "@/db/queries/milestone-videos-queries";
import { toast } from "sonner";
import { createPresignedUpload, removeVideoFromR2 } from "@/lib/actions";

type MilestoneVideosContextType = {
  milestoneVideos: MilestoneVideo[];
  setMilestoneVideos: (milestoneVideos: MilestoneVideo[]) => void;
  addMilestoneVideo: (milestoneVideo: {milestoneId: number, achievedMilestone: string, videoFile: File, videoName: string}) => Promise<void>;
  removeMilestoneVideo: (milestoneVideoId: number) => Promise<void>;
};

const MilestoneVideosContext = createContext<MilestoneVideosContextType | undefined>(
  undefined
);

export function MilestoneVideosProvider({
  milestoneVideosData,
  children,
}: {
  milestoneVideosData: MilestoneVideo[];
  children: ReactNode;
}) {
  const [milestoneVideos, setMilestoneVideos] = useState<MilestoneVideo[]>([]);
  useEffect(() => {
    setMilestoneVideos(milestoneVideosData);
  }, [milestoneVideosData]);

  const addMilestoneVideo = async ({milestoneId, achievedMilestone, videoFile, videoName}: {milestoneId: number, achievedMilestone: string, videoFile: File, videoName: string}) => {
    try {
        const ext = videoFile.name.split(".").pop() || "mp4";
        const { url, key } = await createPresignedUpload({
          baseName: videoName,
          extension: ext,
          contentType: videoFile.type || "video/mp4",
        });

        const putRes = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": videoFile.type || "video/mp4",
          },
          body: videoFile,
        });
        if (!putRes.ok) {
          throw new Error(`Upload failed with status ${putRes.status}`);
        }
        const videoPath = key;
        const newMilestoneVideoId = await createMilestoneVideo({
          milestoneId,
          achievedMilestone,
          videoPath
        });
        
        const milestoneVideo: MilestoneVideo = {
          id: newMilestoneVideoId,
          milestoneId,
          achievedMilestone,
          videoPath,
          createdAt: new Date(),
        }
        
        setMilestoneVideos((prev) => [...prev, milestoneVideo]);
        toast.success("Milestone video added successfully");
    } catch (error) {
      console.error("Error adding milestone video:", error);
      toast.error("Error adding milestone video");
    }
  }

  const removeMilestoneVideo = async (milestoneVideoId: number) => {
    try {
      // Find the milestone video to get the video path
      const milestoneVideo = milestoneVideos.find(mv => mv.id === milestoneVideoId);
      if (!milestoneVideo) {
        toast.error("Milestone video not found");
        return;
      }

      // Remove from R2 storage
      await removeVideoFromR2(milestoneVideo.videoPath);
      
      // Remove from database
      await deleteMilestoneVideo(milestoneVideoId);
      
      // Update local state
      setMilestoneVideos((prev) => prev.filter(mv => mv.id !== milestoneVideoId));
      toast.success("Milestone video removed successfully");
    } catch (error) {
      console.error("Error removing milestone video:", error);
      toast.error("Error removing milestone video");
    }
  };
    
  return (
    <MilestoneVideosContext.Provider
      value={{
        milestoneVideos,
        setMilestoneVideos,
        addMilestoneVideo,
        removeMilestoneVideo,
      }}
    >
      {children}
    </MilestoneVideosContext.Provider>
  );
}

export function useMilestoneVideos() {
  const context = useContext(MilestoneVideosContext);
  if (context === undefined) {
    throw new Error("useMilestoneVideos must be used within a MilestoneVideosProvider");
  }
  return context;
}