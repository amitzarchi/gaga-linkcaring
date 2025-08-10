"use server";

import { headers } from "next/headers";
import { getFileFromR2 } from "@/lib/actions";

function inferMimeType(filename: string, fallback?: string): string {
  const ext = (filename.split(".").pop() || "").toLowerCase();
  const map: Record<string, string> = {
    mp4: "video/mp4",
    mov: "video/quicktime",
    webm: "video/webm",
    mpeg: "video/mpeg",
    mpg: "video/mpeg",
    m4v: "video/mp4",
    qt: "video/quicktime",
    "3gp": "video/3gpp",
    "3gpp": "video/3gpp",
    "3g2": "video/3gpp2",
    "3gpp2": "video/3gpp2",
  };
  return map[ext] || fallback || "video/mp4";
}

export async function analyzeMilestoneVideo(params: {
  videoPath: string;
  milestoneId: number;
}) {
  const { videoPath, milestoneId } = params;

  const apiKey = process.env.GAGA_API_KEY;
  if (!apiKey) {
    return { error: "Internal server error" };
  }

  // Fetch file bytes directly from R2 (avoids client round-trip)
  const startTime = performance.now();
  console.log(`starting to get file from R2`);
  const { buffer, contentType } = await getFileFromR2(videoPath);
  const endTime = performance.now();
  console.log(`Time taken to get file from R2: ${((endTime - startTime) / 1000).toFixed(2)}s`);
  
  const filename = videoPath.split("/").pop() || `video_${Date.now()}.mp4`;
  const mimeType = contentType && contentType !== "application/octet-stream"
    ? contentType
    : inferMimeType(filename, contentType);

  const blob = new Blob([buffer], { type: mimeType });
  const formData = new FormData();
  formData.append("video", blob, filename);
  formData.append("milestoneId", String(milestoneId));

  // Build absolute base URL from current request context
  const hdrs = await headers();
  const host = hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") || (host?.startsWith("localhost") ? "http" : "https");
  const baseUrl = host ? `${proto}://${host}` : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/analyze`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
    // Important to opt-out of caching for actions
    cache: "no-store",
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = { error: "Invalid response" };
  }

  if (!res.ok) {
    return { error: data?.error || "Internal server error" };
  }
  return data;
}


