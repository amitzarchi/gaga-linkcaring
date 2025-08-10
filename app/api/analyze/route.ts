import { NextRequest, NextResponse } from "next/server";
import { withApiKeyAuth } from "@/lib/keys-middleware";
import { getMilestoneById } from "@/db/queries/milestones-queries";
import { getValidatorsByMilestone } from "@/db/queries/validators-queries";
import { getCurrentSystemPrompt } from "@/db/queries/system-prompt-queries";
import { GoogleGenAI, Type } from "@google/genai";
import { getPolicyById, getDefaultPolicy } from "@/db/queries/policies-queries";

export const dynamic = "force-dynamic";

export const POST = withApiKeyAuth(async (request: NextRequest) => {
    console.log("received request to /api/analyze");
  try {
    const formData = await request.formData();

    const video = formData.get("video");
    const milestoneIdRaw = formData.get("milestoneId");

    if (!(video instanceof File)) {
      return NextResponse.json(
        { error: "Missing or invalid 'video' file" },
        { status: 400 }
      );
    }

    let milestoneId: number | null = null;
    if (typeof milestoneIdRaw === "string") {
      const parsed = Number.parseInt(milestoneIdRaw, 10);
      milestoneId = Number.isNaN(parsed) ? null : parsed;
    } else if (typeof milestoneIdRaw === "number") {
      milestoneId = milestoneIdRaw;
    }

    if (!Number.isInteger(milestoneId)) {
      return NextResponse.json(
        { error: "Missing or invalid 'milestoneId'" },
        { status: 400 }
      );
    }

    const [milestone, milestoneValidators, systemPromptRow] =
      await Promise.all([
        getMilestoneById(milestoneId as number),
        getValidatorsByMilestone(milestoneId as number),
        getCurrentSystemPrompt(),
      ]);


    if (!milestone) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 }
      );
    }

    if (!systemPromptRow) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    const basePrompt = systemPromptRow.content;

    if (!milestoneValidators || milestoneValidators.length === 0) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
    const validatorsList = milestoneValidators
      .map((v: any) => `- ${v.description}`)
      .join("\n");
    const sections = [
      basePrompt,
      `Milestone: ${milestone.name}`,
      `Validators:\n${validatorsList}`,
    ];
    const finalPrompt = sections.filter(Boolean).join("\n\n");

    const fileObj = video as File;
    const arrayBuffer = await fileObj.arrayBuffer();
    const base64Video = Buffer.from(arrayBuffer).toString("base64");

    const reportedType = (fileObj.type || "").toLowerCase();
    const isGenericType = !reportedType || reportedType === "application/octet-stream";
    const fileExt = (fileObj.name.split(".").pop() || "").toLowerCase();
    const extToMime: Record<string, string> = {
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
    const inferredType = extToMime[fileExt] || "video/mp4";
    const mimeType = isGenericType ? inferredType : reportedType;

    const contents = [
        {
            inlineData: {
                mimeType,
                data: base64Video,
            },
        },
        { text: finalPrompt },
    ];

    const startTime = performance.now();
    console.log(`starting to send request to google`);
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                validators: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: { type: Type.STRING },
                            result: { type: Type.BOOLEAN },
                        },
                    },
                },
                confidence: { type: Type.NUMBER },
            },  
            propertyOrdering: ["validators", "confidence"],
            required: ["validators", "confidence"],
            additionalProperties: false,
            strict: true,
        },
        
      },
    });

    const endTime = performance.now();
    console.log(`Time taken to send request to google: ${((endTime - startTime) / 1000).toFixed(2)}s`);

    // Parse model output (expected strict JSON per responseSchema)
    let rawText: unknown = (response as any)?.text;
    if (typeof rawText === "function") {
      try {
        rawText = await (rawText as any).call(response);
      } catch (e) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
    }
    if (typeof rawText !== "string") {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    let modelJson: { validators: Array<{ description: string; result: boolean }>; confidence: number };
    try {
      modelJson = JSON.parse(rawText);
    } catch {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    // Fetch policy and evaluate
    const policy = milestone.policyId
      ? await getPolicyById(milestone.policyId)
      : await getDefaultPolicy();

    if (!policy) {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    const total = Array.isArray(modelJson.validators) ? modelJson.validators.length : 0;
    const passed = total > 0 ? modelJson.validators.filter(v => v?.result === true).length : 0;
    const percentPassed = total > 0 ? (passed / total) * 100 : 0;
    const confidencePct = typeof modelJson.confidence === "number" ? modelJson.confidence * 100 : 0;
    const result = percentPassed >= policy.minValidatorsPassed && confidencePct >= policy.minConfidence;

    return NextResponse.json({
      milestoneId,
      result,
      confidence: modelJson.confidence,
      validators: modelJson.validators,
      policy: {
        minValidatorsPassed: policy.minValidatorsPassed,
        minConfidence: policy.minConfidence,
      }
    });
  } catch (error) {
    console.error("Error handling /api/analyze POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
