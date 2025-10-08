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

    const formData = await request.formData();
    const milestoneId = formData.get('milestoneId') as string;
    const videoFile = formData.get('video') as File;

    if (!milestoneId || !videoFile) {
      return NextResponse.json({ error: "Missing milestoneId or video" }, { status: 400 });
    }

    const apiKey = process.env.GAGA_API_KEY;
    const baseUrl = process.env.GAGA_API_URL;
    
    if (!apiKey) {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    if (!baseUrl) {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    const apiFormData = new FormData();
    apiFormData.append('milestoneId', milestoneId);
    apiFormData.append('video', videoFile);
    
    const res: Response = await fetch(`${baseUrl}/api/analyze`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: apiFormData,
      cache: "no-store",
    });
    
    const result = await res.json() as AnalyzeResult;
    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Error in analyze-milestone-file API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

