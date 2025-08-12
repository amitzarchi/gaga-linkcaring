"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { Milestone } from "@/lib/defs";
import { toast } from "sonner";
import {
  createMilestone as createMilestoneServer,
  updateMilestone as updateMilestoneServer,
  deleteMilestone as deleteMilestoneServer,
} from "@/db/queries/milestones-queries";

type MilestonesContextType = {
  milestones: Milestone[];
  setMilestones: (milestones: Milestone[]) => void;
  selectedMilestone: Milestone | null;
  setSelectedMilestone: (milestone: Milestone | null) => void;
  addMilestone: (data: { name: string; category: Milestone["category"] }) => Promise<void>;
  removeMilestone: (id: number) => Promise<void>;
  editMilestone: (
    id: number,
    updates: Partial<Pick<Milestone, "name" | "category">>
  ) => Promise<void>;
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

  const addMilestone: MilestonesContextType["addMilestone"] = async (data) => {
    try {
      const created = await createMilestoneServer({ name: data.name, category: data.category });
      setMilestones((curr) => [
        ...curr,
        {
          id: created.id,
          name: created.name,
          category: created.category,
          policyId: created.policyId ?? null,
          ageStatuses: new Map(),
        },
      ]);
      toast.success("Milestone added");
    } catch (error) {
      toast.error("Failed to add milestone");
    }
  };

  const removeMilestone: MilestonesContextType["removeMilestone"] = async (id) => {
    const previousMilestones = milestones;
    const previousSelected = selectedMilestone;
    const nextMilestones = milestones.filter((m) => m.id !== id);
    setMilestones(nextMilestones);
    if (selectedMilestone?.id === id) {
      setSelectedMilestone(nextMilestones[0] ?? null);
    }
    try {
      await deleteMilestoneServer(id);
      toast.success("Milestone removed");
    } catch (error) {
      toast.error("Failed to remove milestone");
      setMilestones(previousMilestones);
      setSelectedMilestone(previousSelected ?? null);
    }
  };

  const editMilestone: MilestonesContextType["editMilestone"] = async (id, updates) => {
    const previousMilestones = milestones;
    const previousSelected = selectedMilestone;
    setMilestones(
      milestones.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      )
    );
    if (selectedMilestone?.id === id) {
      setSelectedMilestone({ ...selectedMilestone, ...updates });
    }
    try {
      await updateMilestoneServer(id, {
        name: updates.name,
        category: updates.category,
      });
      toast.success("Milestone updated");
    } catch (error) {
      toast.error("Failed to update milestone");
      setMilestones(previousMilestones);
      setSelectedMilestone(previousSelected ?? null);
    }
  };

  return (
    <MilestonesContext.Provider
      value={{
        milestones,
        setMilestones,
        selectedMilestone,
        setSelectedMilestone,
        addMilestone,
        removeMilestone,
        editMilestone,
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
