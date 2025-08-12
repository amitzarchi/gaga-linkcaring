"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Model } from "@/lib/defs";
import { getModels, setActiveModel } from "@/db/queries/models-queries";
import { toast } from "sonner";

type ModelsContextType = {
  models: Model[];
  activate: (modelKey: string) => Promise<void>;
};

const ModelsContext = createContext<ModelsContextType | undefined>(undefined);

export function ModelsProvider({
  modelsData,
  children,
}: {
  modelsData: Model[];
  children: React.ReactNode;
}) {
  const [models, setModels] = useState<Model[]>(modelsData);

  useEffect(() => {
    setModels(modelsData);
  }, [modelsData]);

  const activate = async (modelKey: string) => {
    const oldActiveModel = models.find((m) => m.isActive);
    setModels(models.map((m) => ({ ...m, isActive: m.model === modelKey })));
    try {
      await setActiveModel(modelKey);
      toast.success("Model updated");
    } catch (error) {
      toast.error("Failed to update model");
      setModels(models.map((m) => ({ ...m, isActive: m.model === oldActiveModel?.model })));
    }
  };

  return (
    <ModelsContext.Provider value={{ models, activate }}>
      {children}
    </ModelsContext.Provider>
  );
}

export function useModels() {
  const ctx = useContext(ModelsContext);
  if (!ctx) throw new Error("useModels must be used within a ModelsProvider");
  return ctx;
}


