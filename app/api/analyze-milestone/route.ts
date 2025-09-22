import { NextRequest, NextResponse } from "next/server";
import { AnalyzeResult } from "@/lib/defs";
import { auth } from "@/lib/auth";
import { headers } from "next/dist/server/request/headers";

export async function POST(request: NextRequest) {
  try {

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }    

    const { videoUrl, milestoneId } = await request.json();

    const apiKey = process.env.GAGA_API_KEY;
    const baseUrl = process.env.GAGA_API_URL;
    
    if (!apiKey) {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    if (!baseUrl) {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    const formData = new FormData();
    formData.append('milestoneId', milestoneId.toString());
    formData.append('videoUrl', videoUrl);
    
    const res: Response = await fetch(`${baseUrl}/api/analyze`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
      cache: "no-store",
    });
    
    const result = await res.json() as AnalyzeResult;
    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Error in analyze-milestone API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
