import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const milestoneCategories = pgEnum("milestone_categories", [
  "SOCIAL",
  "LANGUAGE",
  "FINE_MOTOR",
  "GROSS_MOTOR",
]);

export const milestones = pgTable("milestones", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  category: milestoneCategories("category").notNull(), // e.g., 'SOCIAL', 'LANGUAGE', 'FINE_MOTOR', 'GROSS_MOTOR'
});

export const validators = pgTable("validators", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  milestoneId: integer("milestone_id")
    .notNull()
    .references(() => milestones.id),
  description: text("description").notNull(),
});

export const milestoneAchievementRates = pgEnum("milestone_achievement_rates", [
  "GREEN",
  "YELLOW",
  "ORANGE",
  "RED",
]);

export type MilestoneAchievementRate =
  (typeof milestoneAchievementRates.enumValues)[number];

export const milestoneAgeStatuses = pgTable(
  "milestone_age_statuses",
  {
    milestoneId: integer("milestone_id")
      .notNull()
      .references(() => milestones.id),
    month: integer("month").notNull(), // Age in months
    achievementRate: milestoneAchievementRates("achievement_rate").notNull(),
  },
  (table) => [primaryKey({ columns: [table.milestoneId, table.month] })]
);

export const milestoneVideos = pgTable("milestone_videos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  milestoneId: integer("milestone_id")
    .notNull()
    .references(() => milestones.id),
  achievedMilestone: text("achieved_milestone").notNull(),
  videoPath: text("video_path").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const apiKeys = pgTable("api_keys", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  key: text("key").notNull(),
  userId: text("user_id").references(() => user.id).notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsedAt: timestamp("last_used_at"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const testResults = pgTable("test_results", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  milestoneId: integer("milestone_id")
    .notNull()
    .references(() => milestones.id, { onDelete: "cascade" }),
  videoId: integer("video_id")
    .notNull()
    .references(() => milestoneVideos.id, { onDelete: "cascade" }),
  success: boolean("success").notNull(),
  result: boolean("result").notNull(),
  confidence: integer("confidence"), // Store as integer percentage (0-100)
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
