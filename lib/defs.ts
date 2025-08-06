import { milestoneAchievementRates, milestoneCategories, validators, milestoneVideos, apiKeys, testResults } from "@/db/schema";
import { accessRequest } from "@/db/auth-schema";

export type Milestone = {
    id: number;
    name: string;
    category: MilestoneCategory;
    ageStatuses: Map<number, MilestoneAchievementRate>
  }
  
export type MilestoneCategory = (typeof milestoneCategories.enumValues)[number];

export type MilestoneAchievementRate = (typeof milestoneAchievementRates.enumValues)[number];

export type Validator = typeof validators.$inferSelect;
export type ValidatorInsert = typeof validators.$inferInsert;

export type MilestoneVideo = typeof milestoneVideos.$inferSelect;
export type MilestoneVideoInsert = typeof milestoneVideos.$inferInsert;

export type AccessRequest = typeof accessRequest.$inferSelect;

export type ApiKeyOwner = {
  name: string;
  email: string;
  avatar?: string | null;
};

export type ApiKey = {
  id: number;
  key: string;
  owner: ApiKeyOwner;
  name: string;
  createdAt: Date;
  lastUsedAt: Date | null;
  isActive: boolean;
};

export type ApiKeyInsert = typeof apiKeys.$inferInsert;

export type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TestResult = typeof testResults.$inferSelect;
export type TestResultInsert = typeof testResults.$inferInsert;
