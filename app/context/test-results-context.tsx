"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { createTestResult, deleteTestResult, deleteTestResultsByVideo } from "@/db/queries/test-results-queries";
import { TestResultInsert } from "@/lib/defs";

export type TestResultWithDetails = {
  id: number;
  milestoneId: number;
  videoId: number;
  success: boolean;
  result: boolean;
  confidence: number | null;
  error: string | null;
  createdAt: Date;
  milestoneName: string | null;
  videoPath: string | null;
  achievedMilestone: string | null;
};

type TestResultsContextType = {
  testResults: TestResultWithDetails[];
  setTestResults: (testResults: TestResultWithDetails[]) => void;
  addTestResult: (testResult: TestResultInsert) => Promise<number>;
  removeTestResult: (id: number) => Promise<void>;
  removeTestResultsByVideo: (videoId: number) => Promise<void>;
  getTestResultsByMilestone: (milestoneId: number) => TestResultWithDetails[];
  getTestResultsByVideo: (videoId: number) => TestResultWithDetails[];
};

const TestResultsContext = createContext<TestResultsContextType | undefined>(
  undefined
);

export function TestResultsProvider({
  testResultsData,
  children,
}: {
  testResultsData: TestResultWithDetails[];
  children: ReactNode;
}) {
  const [testResults, setTestResults] = useState<TestResultWithDetails[]>([]);

  // Update test results data
  useEffect(() => {
    setTestResults(testResultsData);
  }, [testResultsData]);

  const addTestResult = async (testResult: TestResultInsert): Promise<number> => {
    const newId = await createTestResult(testResult);
    
    // Create a new test result object with details for immediate UI update
    const newTestResult: TestResultWithDetails = {
      id: newId,
      milestoneId: testResult.milestoneId,
      videoId: testResult.videoId,
      success: testResult.success,
      result: testResult.result,
      confidence: testResult.confidence || null,
      error: testResult.error || null,
      createdAt: new Date(),
      milestoneName: null, // Will be populated on next fetch
      videoPath: null, // Will be populated on next fetch
      achievedMilestone: null, // Will be populated on next fetch
    };
    
    setTestResults((prev) => [newTestResult, ...prev]);
    return newId;
  };

  const removeTestResult = async (id: number): Promise<void> => {
    await deleteTestResult(id);
    setTestResults((prev) => prev.filter((tr) => tr.id !== id));
  };

  const removeTestResultsByVideo = async (videoId: number): Promise<void> => {
    await deleteTestResultsByVideo(videoId);
    setTestResults((prev) => prev.filter((tr) => tr.videoId !== videoId));
  };

  const getTestResultsByMilestone = (milestoneId: number): TestResultWithDetails[] => {
    return testResults.filter((tr) => tr.milestoneId === milestoneId);
  };

  const getTestResultsByVideo = (videoId: number): TestResultWithDetails[] => {
    return testResults.filter((tr) => tr.videoId === videoId);
  };

  return (
    <TestResultsContext.Provider
      value={{
        testResults,
        setTestResults,
        addTestResult,
        removeTestResult,
        removeTestResultsByVideo,
        getTestResultsByMilestone,
        getTestResultsByVideo,
      }}
    >
      {children}
    </TestResultsContext.Provider>
  );
}

export function useTestResults() {
  const context = useContext(TestResultsContext);
  if (context === undefined) {
    throw new Error("useTestResults must be used within a TestResultsProvider");
  }
  return context;
}