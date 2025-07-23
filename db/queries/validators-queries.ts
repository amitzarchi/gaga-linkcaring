"use server";

import { headers } from "next/dist/server/request/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { validators, milestones } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

// VALIDATOR CRUD OPERATIONS

export async function getValidators() {
  const result = await db
    .select()
    .from(validators)
  
  return result;
}

export async function createValidator(data: {
  milestoneId: number;
  description: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user?.id) {
    redirect("/sign-up")
  }
  const result = await db.insert(validators).values(data).returning({id: validators.id});
  return result[0].id;
}

export async function updateValidator(
  id: number,
  data: Partial<{
    description: string;
  }>
) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user?.id) {
    redirect("/sign-up")
  }
  const result = await db
    .update(validators)
    .set(data)
    .where(eq(validators.id, id))
    .returning();
  return result[0];
}

export async function deleteValidator(id: number) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user?.id) {
    redirect("/sign-up")
  }
  
  const result = await db
    .delete(validators)
    .where(eq(validators.id, id))
    .returning();
  return result[0];
} 