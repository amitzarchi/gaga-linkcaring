"use server";

import { db } from "@/lib/db";
import { systemPromptHistory } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getCurrentSystemPrompt() {
  const rows = await db
    .select()
    .from(systemPromptHistory)
    .orderBy(desc(systemPromptHistory.id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createSystemPrompt(params: {
  content: string;
  createdBy?: string;
  changeNote?: string | null;
}) {
  const [row] = await db
    .insert(systemPromptHistory)
    .values({
      content: params.content,
      createdBy: params.createdBy,
      changeNote: params.changeNote ?? null,
    })
    .returning();
  return row;
}

export async function listSystemPromptHistory(limit = 50, offset = 0) {
  return db
    .select()
    .from(systemPromptHistory)
    .orderBy(desc(systemPromptHistory.id))
    .limit(limit)
    .offset(offset);
}

export async function restoreSystemPrompt(
  id: number,
  userId?: string,
  note?: string
) {
  const [row] = await db
    .select()
    .from(systemPromptHistory)
    .where(eq(systemPromptHistory.id, id))
    .limit(1);
  if (!row) return null;
  const [restored] = await db
    .insert(systemPromptHistory)
    .values({
      content: row.content,
      changeNote: note ?? "Restored from history",
      createdBy: userId,
    })
    .returning();
  return restored;
}


