import { db } from "@/lib/db";
import { models } from "@/db/schema";

export async function seedModels() {
  // If there is already at least one model, assume seeded and skip
  const existing = await db.select().from(models).limit(1);
  if (existing.length) return existing;

  const values = [
    {
      name: "Gemini 2.5 Pro",
      model: "gemini-2.5-pro",
      isActive: false,
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/8/8f/Google-gemini-icon.svg",
      description: "Higher quality model for complex reasoning and generation.",
    },
    {
      name: "Gemini 2.5 Flash",
      model: "gemini-2.5-flash",
      isActive: true,
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/8/8f/Google-gemini-icon.svg",
      description: "Fast and accurate model for most tasks.",
    },
    {
      name: "Gemini 2.5 Flash Lite",
      model: "gemini-2.5-flash-lite",
      isActive: false,
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/8/8f/Google-gemini-icon.svg",
      description: "Lightweight and cost-efficient variant for simple tasks.",
    },
  ];

  const result = await db.insert(models).values(values).returning();
  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedModels()
    .then(() => {
      console.log("Seeded models successfully");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Failed to seed models", err);
      process.exit(1);
    });
}
