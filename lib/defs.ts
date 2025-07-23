import { milestoneAchievementRates, milestoneCategories, validators, milestoneVideos } from "@/db/schema";

export type Milestone = {
    id: number;
    name: string;
    category: MilestoneCategory;
    ageStatuses: Map<number, MilestoneAchievementRate>
  }
  
export type MilestoneCategory = (typeof milestoneCategories.enumValues)[number];

export type MilestoneAchievementRate = (typeof milestoneAchievementRates.enumValues)[number];

export type Validator = typeof validators.$inferSelect;

export type MilestoneVideo = typeof milestoneVideos.$inferSelect;
