import { db } from "@/lib/db";
import { systemPromptHistory } from "@/db/schema";
import fs from "fs/promises";
import path from "path";

const SYSTEM_PROMPT_FILE = path.join(process.cwd(), "system-prompt.md");
const CREATED_BY_USER_ID = "1Z3DbLFIb4mH3cxIjbaSoLKsQrQP6QR4";

export async function seedSystemPrompt() {
  try {
    console.log("🌱 Seeding system prompt from system-prompt.md...");

    const content = await fs.readFile(SYSTEM_PROMPT_FILE, "utf8");
    if (!content || content.trim().length === 0) {
      throw new Error("system-prompt.md is empty or not found");
    }

    const [row] = await db
      .insert(systemPromptHistory)
      .values({
        content,
        createdBy: CREATED_BY_USER_ID,
        changeNote: "Initial system prompt",
      })
      .returning();

    console.log(
      `✅ Inserted system prompt history row id=${row.id} createdBy=${CREATED_BY_USER_ID}`
    );
    return row;
  } catch (error) {
    console.error("❌ Failed to seed system prompt:", error);
    throw error;
  }
}

// Execute when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSystemPrompt()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}


