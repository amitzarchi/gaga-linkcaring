"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ResponseStat } from "@/lib/defs";

type ResponseStatsContextType = {
  responseStats: ResponseStat[];
  setResponseStats: (rows: ResponseStat[]) => void;
};

const ResponseStatsContext = createContext<ResponseStatsContextType | undefined>(
  undefined
);

export function ResponseStatsProvider({
  responseStatsData,
  children,
}: {
  responseStatsData: ResponseStat[];
  children: React.ReactNode;
}) {
  const [responseStats, setResponseStats] = useState<ResponseStat[]>(
    responseStatsData
  );

  useEffect(() => {
    setResponseStats(responseStatsData);
  }, [responseStatsData]);

  return (
    <ResponseStatsContext.Provider value={{ responseStats, setResponseStats }}>
      {children}
    </ResponseStatsContext.Provider>
  );
}

export function useResponseStats() {
  const ctx = useContext(ResponseStatsContext);
  if (!ctx) throw new Error("useResponseStats must be used within a ResponseStatsProvider");
  return ctx;
}


