"use server";

import { headers } from "next/dist/server/request/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  milestones,
  milestoneAgeStatuses,
  milestoneCategories,
  milestoneAchievementRates,
  MilestoneAchievementRate,
} from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Milestone } from "@/lib/defs";  

// MILESTONE CRUD OPERATIONS

export async function getMilestones(): Promise<Milestone[]> {
  // 1. Fetch all milestones
  const allMilestones = await db
    .select({
      id: milestones.id,
      name: milestones.name,
      category: milestones.category,
    })
    .from(milestones)
    .orderBy(asc(milestones.id));

  // 2. Fetch all age statuses
  const allStatuses = await db
    .select({
      milestoneId: milestoneAgeStatuses.milestoneId,
      month: milestoneAgeStatuses.month,
      achievementRate: milestoneAgeStatuses.achievementRate,
    })
    .from(milestoneAgeStatuses);

  // 3. Group statuses by milestoneId
  const statusMap = new Map<number, Map<number, MilestoneAchievementRate>>();
  for (const { milestoneId, month, achievementRate } of allStatuses) {
    if (!statusMap.has(milestoneId)) {
      statusMap.set(milestoneId, new Map());
    }
    statusMap.get(milestoneId)!.set(month, achievementRate);
  }

  // 4. Assemble Milestone[] with ageStatuses maps
  return allMilestones.map(({ id, name, category }) => ({
    id,
    name,
    category,
    ageStatuses: statusMap.get(id) ?? new Map(),
  }));
}




export async function createMilestone(data: {
  id: number;
  name: string;
  category: typeof milestoneCategories.enumValues[number];
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user?.id) {
    redirect("/sign-up")
  }
  const result = await db.insert(milestones).values(data).returning();
  return result[0];
}

export async function updateMilestone(
  id: number,
  data: Partial<{
    name: string;
    category: typeof milestoneCategories.enumValues[number];
  }>
) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user?.id) {
    redirect("/sign-up")
  }
  const result = await db
    .update(milestones)
    .set(data)
    .where(eq(milestones.id, id))
    .returning();
  return result[0];
}

export async function deleteMilestone(id: number) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user?.id) {
    redirect("/sign-up")
  }
  
  // Then delete the milestone
  const result = await db
    .delete(milestones)
    .where(eq(milestones.id, id))
    .returning();
  return result[0];
}


export async function createMilestoneAgeStatus(data: {
  milestoneId: number;
  month: number;
  achievementRate: typeof milestoneAchievementRates.enumValues[number];
}) {
  const result = await db.insert(milestoneAgeStatuses).values(data).returning();
  return result[0];
}

export async function updateMilestoneAgeStatus(
  milestoneId: number,
  month: number,
  data: Partial<{
    achievementRate: typeof milestoneAchievementRates.enumValues[number];
  }>
) { 
  const result = await db
    .update(milestoneAgeStatuses)
    .set(data)
    .where(
      and(
        eq(milestoneAgeStatuses.milestoneId, milestoneId),
        eq(milestoneAgeStatuses.month, month)
      )
    )
    .returning();
  return result[0];
}

export async function deleteMilestoneAgeStatus(
  milestoneId: number,
  month: number
) {
  const result = await db
    .delete(milestoneAgeStatuses)
    .where(
      and(
        eq(milestoneAgeStatuses.milestoneId, milestoneId),
        eq(milestoneAgeStatuses.month, month)
      )
    )
    .returning();
  return result[0];
} 