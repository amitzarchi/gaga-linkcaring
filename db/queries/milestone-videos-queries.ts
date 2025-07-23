"use server";

import { headers } from "next/dist/server/request/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { milestoneVideos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

// MILESTONE VIDEO CRUD OPERATIONS

export async function getMilestoneVideos() {
  const result = await db
    .select()
    .from(milestoneVideos)
  
  return result;
}

export async function createMilestoneVideo(data: {
  milestoneId: number;
  achievedMilestone: string;
  storagePath: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user?.id) {
    redirect("/sign-up")
  }
  const result = await db.insert(milestoneVideos).values(data).returning({id: milestoneVideos.id});
  return result[0].id;
}

export async function updateMilestoneVideo(
  id: number,
  data: Partial<{
    achievedMilestone: string;
    storagePath: string;
  }>
) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user?.id) {
    redirect("/sign-up")
  }
  const result = await db
    .update(milestoneVideos)
    .set(data)
    .where(eq(milestoneVideos.id, id))
    .returning();
  return result[0];
}

export async function deleteMilestoneVideo(id: number) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user?.id) {
    redirect("/sign-up")
  }
  
  const result = await db
    .delete(milestoneVideos)
    .where(eq(milestoneVideos.id, id))
    .returning();
  return result[0];
}