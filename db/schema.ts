import { integer, pgEnum, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";


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
    milestoneId: integer("milestone_id").notNull().references(() => milestones.id),
    description: text("description").notNull(),
  });
  
  export const milestoneAchievementRates = pgEnum("milestone_achievement_rates", [
    "GREEN",
    "YELLOW",
    "ORANGE",
    "RED",
  ]);
  
  export type MilestoneAchievementRate = typeof milestoneAchievementRates.enumValues[number];
  
  export const milestoneAgeStatuses = pgTable("milestone_age_statuses", {
    milestoneId: integer('milestone_id').notNull().references(() => milestones.id),
    month: integer('month').notNull(), // Age in months
    achievementRate: milestoneAchievementRates('achievement_rate').notNull(),
  }, (table) => [
    primaryKey({ columns: [table.milestoneId, table.month] }),
  ]);

  export const milestoneVideos = pgTable("milestone_videos", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    milestoneId: integer("milestone_id").notNull().references(() => milestones.id),
    achievedMilestone: text("achieved_milestone").notNull(),
    storagePath: text("storage_path").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
  
  