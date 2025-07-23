"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { MilestoneVideo } from "@/lib/defs";

type MilestoneVideosContextType = {
  milestoneVideos: MilestoneVideo[];
  setMilestoneVideos: (milestoneVideos: MilestoneVideo[]) => void;
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
  return (
    <MilestoneVideosContext.Provider
      value={{
        milestoneVideos,
        setMilestoneVideos,
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