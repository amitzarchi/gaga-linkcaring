"use server";

import { db } from "@/lib/db";
import { models } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getModels() {
  const rows = await db.select().from(models).orderBy(asc(models.name));
  return rows;
}

export async function setActiveModel(modelKey: string) {
  // Unset all active models, then set the target as active
  await db.update(models).set({ isActive: false });
  const [row] = await db
    .update(models)
    .set({ isActive: true })
    .where(eq(models.model, modelKey))
    .returning();
  return row;
}


