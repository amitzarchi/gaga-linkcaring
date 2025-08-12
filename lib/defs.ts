import { milestoneAchievementRates, milestoneCategories, validators, milestoneVideos, apiKeys, testResults, policies, models, milestones, responseStats } from "@/db/schema";
import { accessRequest } from "@/db/auth-schema";

export type Milestone = {
    id: number;
    name: string;
    category: MilestoneCategory;
    ageStatuses: Map<number, MilestoneAchievementRate>;
    policyId: number | null;
  }

export type MilestoneInsert = typeof milestones.$inferInsert;
  
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

export type Policy = typeof policies.$inferSelect;
export type PolicyInsert = typeof policies.$inferInsert;

export type Model = typeof models.$inferSelect;
export type ModelInsert = typeof models.$inferInsert;

export type ResponseStat = typeof responseStats.$inferSelect;
