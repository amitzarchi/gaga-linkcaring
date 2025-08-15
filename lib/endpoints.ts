"use server";

import { AnalyzeResult } from "./defs";

export async function analyzeMilestoneVideo(params: {
  videoUrl: string;
  milestoneId: number;
}): Promise<AnalyzeResult> {
  const { videoUrl, milestoneId } = params;

  const apiKey = process.env.GAGA_API_KEY;
  const baseUrl = process.env.GAGA_API_URL;
  if (!apiKey) {
    return { error: "Internal server error" };
  }

  if (!baseUrl) {
    return { error: "Internal server error" };
  }

  try {
    const formData = new FormData();
    formData.append('milestoneId', milestoneId.toString());
    formData.append('videoUrl', videoUrl);
    
    const res: Response = await fetch(`${baseUrl}/api/analyze`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        // Remove Content-Type header - let the browser set it for form data
      },
      body: formData, // Send form data instead of JSON
      cache: "no-store",
    });
    
    try {
      return (await res.json()) as AnalyzeResult;
    } catch {
      return { error: "Internal server error" };
    }
  } catch {
    return { error: "Internal server error" };
  }
}


