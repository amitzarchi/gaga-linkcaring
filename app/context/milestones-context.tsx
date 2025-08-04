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
  selectedMilestone: Milestone | null;
  setSelectedMilestone: (milestone: Milestone | null) => void;
};

const MilestonesContext = createContext<MilestonesContextType | undefined>(
  undefined
);

// localStorage key for persisting selected milestone
const SELECTED_MILESTONE_STORAGE_KEY = "selectedMilestone";

export function MilestonesProvider({
  milestonesData,
  children,
}: {
  milestonesData: Milestone[];
  children: ReactNode;
}) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedMilestone, setSelectedMilestoneState] = useState<Milestone | null>(null);

  // Load selected milestone from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SELECTED_MILESTONE_STORAGE_KEY);
      if (stored) {
        const parsedMilestone = JSON.parse(stored) as Milestone;
        // Verify the stored milestone still exists in current milestones
        const existingMilestone = milestonesData.find(m => m.id === parsedMilestone.id);
        if (existingMilestone) {
          setSelectedMilestoneState(existingMilestone);
          return;
        }
      }
    } catch (error) {
      console.warn("Failed to load selected milestone from localStorage:", error);
    }
    
    // Fallback to first milestone if no valid stored selection
    if (milestonesData.length > 0) {
      setSelectedMilestoneState(milestonesData[0]);
    }
  }, [milestonesData]);

  // Update milestones data
  useEffect(() => {
    setMilestones(milestonesData);
  }, [milestonesData]);

  // Custom setter that also persists to localStorage
  const setSelectedMilestone = (milestone: Milestone | null) => {
    setSelectedMilestoneState(milestone);
    
    try {
      if (milestone) {
        localStorage.setItem(SELECTED_MILESTONE_STORAGE_KEY, JSON.stringify(milestone));
      } else {
        localStorage.removeItem(SELECTED_MILESTONE_STORAGE_KEY);
      }
    } catch (error) {
      console.warn("Failed to save selected milestone to localStorage:", error);
    }
  };

  return (
    <MilestonesContext.Provider
      value={{
        milestones,
        setMilestones,
        selectedMilestone,
        setSelectedMilestone,
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
