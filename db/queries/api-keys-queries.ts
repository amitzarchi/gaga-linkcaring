"use server";

import { headers } from "next/dist/server/request/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiKeys } from "@/db/schema";
import { user } from "@/db/auth-schema";
import { asc, eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ApiKey } from "@/lib/defs";

// API KEYS CRUD OPERATIONS

export async function getApiKeys(): Promise<ApiKey[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    redirect("/");
  }

  const result = await db
    .select({
      id: apiKeys.id,
      key: apiKeys.key,
      name: apiKeys.name,
      createdAt: apiKeys.createdAt,
      lastUsedAt: apiKeys.lastUsedAt,
      isActive: apiKeys.isActive,
      owner: {
        name: user.name,
        email: user.email,
        avatar: user.image,
      },
    })
    .from(apiKeys)
    .innerJoin(user, eq(apiKeys.userId, user.id))
    .orderBy(desc(apiKeys.createdAt));

  return result.map((row) => ({
    id: row.id,
    key: row.key,
    name: row.name,
    createdAt: row.createdAt,
    lastUsedAt: row.lastUsedAt,
    isActive: row.isActive,
    owner: {
      name: row.owner.name,
      email: row.owner.email,
      avatar: row.owner.avatar,
    },
  }));
}

export async function getApiKeyById(id: number): Promise<ApiKey | undefined> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    redirect("/");
  }

  const result = await db
    .select({
      id: apiKeys.id,
      key: apiKeys.key,
      name: apiKeys.name,
      createdAt: apiKeys.createdAt,
      lastUsedAt: apiKeys.lastUsedAt,
      isActive: apiKeys.isActive,
      owner: {
        name: user.name,
        email: user.email,
        avatar: user.image,
      },
    })
    .from(apiKeys)
    .innerJoin(user, eq(apiKeys.userId, user.id))
    .where(eq(apiKeys.id, id))
    .limit(1);

  if (!result[0]) return undefined;

  const row = result[0];
  return {
    id: row.id,
    key: row.key,
    name: row.name,
    createdAt: row.createdAt,
    lastUsedAt: row.lastUsedAt,
    isActive: row.isActive,
    owner: {
      name: row.owner.name,
      email: row.owner.email,
      avatar: row.owner.avatar,
    },
  };
}

export async function createApiKey(data: {
  key: string;
  userId: string;
  name: string;
}): Promise<ApiKey> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    redirect("/");
  }

  const result = await db.insert(apiKeys).values(data).returning({
    id: apiKeys.id,
  });


  const apiKey = await getApiKeyById(result[0].id);
  if (!apiKey) {
    throw new Error("Failed to create API key");
  }
  return apiKey;
}

export async function updateApiKey(
  id: number,
  data: Partial<{
    name: string;
    lastUsedAt: Date;
    isActive: boolean;
  }>
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    redirect("/");
  }

  const result = await db
    .update(apiKeys)
    .set(data)
    .where(eq(apiKeys.id, id))
    .returning();
  return result[0];
}

export async function deleteApiKey(id: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    redirect("/");
  }

  const result = await db.delete(apiKeys).where(eq(apiKeys.id, id)).returning();
  return result[0];
}

export async function updateApiKeyLastUsed(id: number) {
  // This function can be called without auth since it's used by middleware
  const result = await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, id))
    .returning();
  return result[0];
}

export async function getApiKeyByKey(key: string) {
  // This function can be called without auth since it's used by middleware
  const result = await db
    .select({
      id: apiKeys.id,
      key: apiKeys.key,
      userId: apiKeys.userId,
      name: apiKeys.name,
      createdAt: apiKeys.createdAt,
      lastUsedAt: apiKeys.lastUsedAt,
      isActive: apiKeys.isActive,
    })
    .from(apiKeys)
    .where(eq(apiKeys.key, key))
    .limit(1);

  return result[0];
}
