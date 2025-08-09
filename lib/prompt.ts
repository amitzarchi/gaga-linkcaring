import { getCurrentSystemPrompt } from "@/db/queries/system-prompt-queries";

let cache: { value: string; ts: number } | null = null;
const TTL_MS = 60_000; // 1 minute

export async function getActiveSystemPrompt(): Promise<string> {
  if (cache && Date.now() - cache.ts < TTL_MS) return cache.value;
  const cur = await getCurrentSystemPrompt();
  if (!cur?.content) {
    throw new Error("System prompt is not configured. Please create one in the admin panel.");
  }
  cache = { value: cur.content, ts: Date.now() };
  return cur.content;
}


