"use server";

import { headers } from "next/dist/server/request/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { testResults, milestones, milestoneVideos } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { TestResultInsert } from "@/lib/defs";

export async function getTestResults() {
  const result = await db
    .select({
      id: testResults.id,
      milestoneId: testResults.milestoneId,
      videoId: testResults.videoId,
      success: testResults.success,
      result: testResults.result,
      confidence: testResults.confidence,
      error: testResults.error,
      createdAt: testResults.createdAt,
      milestoneName: milestones.name,
      videoPath: milestoneVideos.videoPath,
      achievedMilestone: milestoneVideos.achievedMilestone,
    })
    .from(testResults)
    .leftJoin(milestones, eq(testResults.milestoneId, milestones.id))
    .leftJoin(milestoneVideos, eq(testResults.videoId, milestoneVideos.id))
    .orderBy(desc(testResults.createdAt));
  
  return result;
}

export async function getTestResultsByMilestone(milestoneId: number) {
  const result = await db
    .select({
      id: testResults.id,
      milestoneId: testResults.milestoneId,
      videoId: testResults.videoId,
      success: testResults.success,
      result: testResults.result,
      confidence: testResults.confidence,
      error: testResults.error,
      createdAt: testResults.createdAt,
      milestoneName: milestones.name,
      videoPath: milestoneVideos.videoPath,
      achievedMilestone: milestoneVideos.achievedMilestone,
    })
    .from(testResults)
    .leftJoin(milestones, eq(testResults.milestoneId, milestones.id))
    .leftJoin(milestoneVideos, eq(testResults.videoId, milestoneVideos.id))
    .where(eq(testResults.milestoneId, milestoneId))
    .orderBy(desc(testResults.createdAt));
  
  return result;
}

export async function getTestResultsByVideo(videoId: number) {
  const result = await db
    .select({
      id: testResults.id,
      milestoneId: testResults.milestoneId,
      videoId: testResults.videoId,
      success: testResults.success,
      result: testResults.result,
      confidence: testResults.confidence,
      error: testResults.error,
      createdAt: testResults.createdAt,
      milestoneName: milestones.name,
      videoPath: milestoneVideos.videoPath,
      achievedMilestone: milestoneVideos.achievedMilestone,
    })
    .from(testResults)
    .leftJoin(milestones, eq(testResults.milestoneId, milestones.id))
    .leftJoin(milestoneVideos, eq(testResults.videoId, milestoneVideos.id))
    .where(eq(testResults.videoId, videoId))
    .orderBy(desc(testResults.createdAt));
  
  return result;
}

export async function createTestResult(data: TestResultInsert): Promise<number | null> {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user?.id) {
    redirect("/")
  }
  
  const result = await db.insert(testResults).values(data).returning({id: testResults.id});
  return result[0].id;
}

export async function deleteTestResult(id: number) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user?.id) {
    redirect("/")
  }
  
  const result = await db
    .delete(testResults)
    .where(eq(testResults.id, id))
    .returning();
  return result[0];
}

export async function deleteTestResultsByVideo(videoId: number) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user?.id) {
    redirect("/")
  }
  
  const result = await db
    .delete(testResults)
    .where(eq(testResults.videoId, videoId))
    .returning();
  return result;
}
