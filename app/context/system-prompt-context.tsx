"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createSystemPrompt, getCurrentSystemPrompt, listSystemPromptHistory, restoreSystemPrompt } from "@/db/queries/system-prompt-queries";
import { toast } from "sonner";

export type SystemPromptSnapshot = {
  id: number;
  content: string;
  changeNote: string | null;
  createdAt: string; // drizzle returns Date or string depending on driver; keep as string in client state
  createdBy: string | null;
};

type SystemPromptContextType = {
  current: SystemPromptSnapshot | null;
  history: SystemPromptSnapshot[];
  refresh: () => Promise<void>;
  save: (params: { content: string; changeNote?: string | null; userId?: string }) => Promise<void>;
  restore: (id: number, userId?: string, note?: string) => Promise<void>;
};

const SystemPromptContext = createContext<SystemPromptContextType | undefined>(undefined);

export function SystemPromptProvider({ initialCurrent, children }: { initialCurrent: SystemPromptSnapshot | null; children: React.ReactNode }) {
  const [current, setCurrent] = useState<SystemPromptSnapshot | null>(initialCurrent);
  const [history, setHistory] = useState<SystemPromptSnapshot[]>([]);

  const refresh = async () => {
    const cur = await getCurrentSystemPrompt();
    setCurrent(cur as any);
    const list = await listSystemPromptHistory(50, 0);
    setHistory(list as any);
  };

  useEffect(() => {
    (async () => {
      const list = await listSystemPromptHistory(50, 0);
      setHistory(list as any);
    })();
  }, []);

  const save: SystemPromptContextType["save"] = async ({ content, changeNote, userId }) => {
    await createSystemPrompt({ content, changeNote: changeNote ?? null, createdBy: userId });
    await refresh();
    toast.success("System prompt saved");
  };

  const restore: SystemPromptContextType["restore"] = async (id, userId, note) => {
    const row = await restoreSystemPrompt(id, userId, note);
    if (!row) {
      toast.error("Failed to restore system prompt");
      return;
    }
    await refresh();
    toast.success("System prompt restored");
  };

  return (
    <SystemPromptContext.Provider value={{ current, history, refresh, save, restore }}>
      {children}
    </SystemPromptContext.Provider>
  );
}

export function useSystemPrompt() {
  const ctx = useContext(SystemPromptContext);
  if (!ctx) throw new Error("useSystemPrompt must be used within a SystemPromptProvider");
  return ctx;
}


