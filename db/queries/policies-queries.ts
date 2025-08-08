"use server";

import { db } from "@/lib/db";
import { policies, milestones, milestoneCategories } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";

export async function getPolicies() {
  const rows = await db.select().from(policies).orderBy(asc(policies.id));
  return rows;
}

export async function getDefaultPolicy() {
  const rows = await db
    .select()
    .from(policies)
    .where(eq(policies.isDefault, true))
    .limit(1);
  return rows[0] ?? null;
}

export async function createPolicy(data: {
  minValidatorsPassed: number;
  minConfidence: number;
  isDefault?: boolean;
}) {
  const [row] = await db
    .insert(policies)
    .values({
      minValidatorsPassed: data.minValidatorsPassed,
      minConfidence: data.minConfidence,
      isDefault: data.isDefault ?? false,
    })
    .returning();
  return row;
}

export async function updatePolicy(
  id: number,
  data: Partial<{
    minValidatorsPassed: number;
    minConfidence: number;
    isDefault: boolean;
  }>
) {
  const [row] = await db
    .update(policies)
    .set(data)
    .where(eq(policies.id, id))
    .returning();
  return row;
}

export async function deletePolicy(id: number) {
  const [row] = await db.delete(policies).where(eq(policies.id, id)).returning();
  return row;
}

export async function setDefaultPolicy(id: number) {
  // Unset all defaults, then set the target as default
  await db.update(policies).set({ isDefault: false });
  const [row] = await db
    .update(policies)
    .set({ isDefault: true })
    .where(eq(policies.id, id))
    .returning();
  return row;
}

export async function assignPolicyToMilestone(
  milestoneId: number,
  policyId: number | null
) {
  const [row] = await db
    .update(milestones)
    .set({ policyId })
    .where(eq(milestones.id, milestoneId))
    .returning();
  return row;
}

export async function assignPolicyToCategory(
  category: (typeof milestoneCategories.enumValues)[number],
  policyId: number | null
) {
  const rows = await db
    .update(milestones)
    .set({ policyId })
    .where(eq(milestones.category, category))
    .returning();
  return rows;
}


