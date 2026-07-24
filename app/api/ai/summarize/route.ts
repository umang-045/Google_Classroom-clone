import { NextRequest, NextResponse } from "next/server";
import { summarizeContent, SummaryType } from "@/lib/ai";
import { extractTextFromUrl } from "@/lib/extractText";
import prisma from "@/lib/db";

interface SummarizeRequestBody {
  type: SummaryType;
  sourceId?: number; 
  classroomId: number;
}

export async function POST(req: NextRequest) {
  try {
    const { type, sourceId, classroomId }: SummarizeRequestBody =
      await req.json();

    if (!type || !classroomId) {
      return NextResponse.json(
        { error: "type and classroomId are required" },
        { status: 400 }
      );
    }

    let text = "";

    if (type === "announcement") {
      if (!sourceId) {
        return NextResponse.json(
          { error: "sourceId is required for announcement" },
          { status: 400 }
        );
      }
      const a = await prisma.announcement.findUnique({
        where: { id: sourceId },
      });
      text = a?.content ?? "";
    }

    if (type === "assignment") {
      if (!sourceId) {
        return NextResponse.json(
          { error: "sourceId is required for assignment" },
          { status: 400 }
        );
      }
      const a = await prisma.assignment.findUnique({
        where: { id: sourceId },
      });
      text = a?.description ?? "";

      if (a?.fileUrl) {
        try {
          const fileText = await extractTextFromUrl(a.fileUrl);
          text += "\n\n" + fileText;
        } catch (err) {
          console.error("Failed to extract assignment file text:", err);
        }
      }
    }

    if (type === "chat") {
      const messages = await prisma.chat.findMany({
        where: { classId: classroomId },
        orderBy: { created_at: "asc" },
        take: 200, 
      });
      text = messages
        .map((m) => `User ${m.senderId}: ${m.message}`)
        .join("\n");
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Nothing to summarize" },
        { status: 400 }
      );
    }

    const summary = await summarizeContent(text, type);

  
    return NextResponse.json({
      summary,
      type,
      sourceId: sourceId ?? classroomId,
      classroomId,
    });
  } catch (err) {
    console.error("Summarize route error:", err);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}