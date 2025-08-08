import { db } from "@/lib/db";
import { policies } from "@/db/schema";

export async function seedPolicies() {
  const existing = await db.select().from(policies).limit(1);
  if (existing.length) return existing;

  const result = await db
    .insert(policies)
    .values([
      {
        minValidatorsPassed: 80,
        minConfidence: 80,
        isDefault: true,
      },
    ])
    .returning();
  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedPolicies().then(() => process.exit(0)).catch(() => process.exit(1));
}


