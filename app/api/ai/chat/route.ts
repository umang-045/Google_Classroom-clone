import { NextRequest, NextResponse } from "next/server";
import { chatWithAssistant, ChatTurn } from "@/lib/ai";

interface ChatRequestBody {
  history: ChatTurn[];
}

export async function POST(req: NextRequest) {
  try {
    const { history }: ChatRequestBody = await req.json();

    if (!Array.isArray(history) || history.length === 0) {
      return NextResponse.json(
        { error: "history is required and must be a non-empty array" },
        { status: 400 }
      );
    }

    const reply = await chatWithAssistant(history);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI chat route error:", err);
    return NextResponse.json(
      { error: "Failed to get a response" },
      { status: 500 }
    );
  }
}