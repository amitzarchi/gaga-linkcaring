"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ResponseStat } from "@/lib/defs";

type ResponseStatsContextType = {
  responseStats: ResponseStat[];
  setResponseStats: (rows: ResponseStat[]) => void;
  responseStatsCount: number;
  setResponseStatsCount: (count: number) => void;
};

const ResponseStatsContext = createContext<ResponseStatsContextType | undefined>(
  undefined
);

export function ResponseStatsProvider({
  responseStatsData,
  responseStatsCountData,
  children,
}: {
  responseStatsData: ResponseStat[];
  responseStatsCountData: number;
  children: React.ReactNode;
}) {
  const [responseStats, setResponseStats] = useState<ResponseStat[]>(
    responseStatsData
  );
  const [responseStatsCount, setResponseStatsCount] = useState<number>(responseStatsCountData);
  useEffect(() => {
    setResponseStats(responseStatsData);
  }, [responseStatsData]);

  useEffect(() => {
    if (responseStatsCount) {
      setResponseStatsCount(responseStatsCount);
    }
  }, [responseStatsCount]);

  return (
    <ResponseStatsContext.Provider value={{ responseStats, setResponseStats, responseStatsCount, setResponseStatsCount }}>
      {children}
    </ResponseStatsContext.Provider>
  );
}

export function useResponseStats() {
  const ctx = useContext(ResponseStatsContext);
  if (!ctx) throw new Error("useResponseStats must be used within a ResponseStatsProvider");
  return ctx;
}


