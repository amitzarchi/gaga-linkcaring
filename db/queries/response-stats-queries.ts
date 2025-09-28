"use server";

import { db } from "@/lib/db";
import { responseStats } from "@/db/schema";
import { desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function getResponseStatsCount(): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(responseStats);
  return row?.count ?? 0;
}

export async function getLatestResponseStats(limit = 10000) {
  const rows = await db
    .select()
    .from(responseStats)
    .orderBy(desc(responseStats.createdAt))
    .limit(limit);
  return rows;
}


