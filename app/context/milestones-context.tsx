"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { Milestone } from "@/lib/defs";

type MilestonesContextType = {
  milestones: Milestone[];
  setMilestones: (milestones: Milestone[]) => void;
};

const MilestonesContext = createContext<MilestonesContextType | undefined>(
  undefined
);

export function MilestonesProvider({
  milestonesData,
  children,
}: {
  milestonesData: Milestone[];
  children: ReactNode;
}) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  useEffect(() => {
    setMilestones(milestonesData);
  }, [milestonesData]);
  return (
    <MilestonesContext.Provider
      value={{
        milestones,
        setMilestones,
      }}
    >
      {children}
    </MilestonesContext.Provider>
  );
}

export function useMilestones() {
  const context = useContext(MilestonesContext);
  if (context === undefined) {
    throw new Error("useMilestones must be used within a MilestoneProvider");
  }
  return context;
}
