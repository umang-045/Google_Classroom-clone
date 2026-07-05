import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type SummaryType = "announcement" | "assignment" | "chat";

const PROMPTS: Record<SummaryType, string> = {
  announcement:
    "Summarize this classroom announcement in 2-3 sentences. Highlight any dates, deadlines, or action items clearly.",
  assignment:
    "Summarize this assignment description and/or attached material in 2-3 sentences. Extract the key requirement, deadline, and submission format if mentioned.",
  chat: "Summarize this classroom chat conversation. Give a short paragraph summary, then 3-5 bullet points of key discussion topics or decisions.",
};

const MODEL = "gemini-3.5-flash";

export async function summarizeContent(
  text: string,
  type: SummaryType
): Promise<string> {
  if (!text || text.trim().length === 0) {
    throw new Error("No text provided to summarize");
  }


  const trimmedText = text.slice(0, 15000);

  const prompt = `${PROMPTS[type]}\n\n---\n\n${trimmedText}`;

  const interaction = await ai.interactions.create({
    model: MODEL,
    input: prompt,
  });

  return interaction.output_text ?? "";
}

export interface ChatTurn {
  role: "user" | "assistant";
  text: string;
}

const ASSISTANT_SYSTEM_PROMPT =
  "You are a helpful assistant embedded in a classroom platform called DigitalClassroom. Answer questions clearly and concisely. If asked about homework or assignments, help the student think it through rather than just giving final answers.";

export async function chatWithAssistant(history: ChatTurn[]): Promise<string> {
  if (!history || history.length === 0) {
    throw new Error("No conversation history provided");
  }


  const input = history.map((turn) =>
    turn.role === "user"
      ? { type: "user_input" as const, content: turn.text }
      : {
          type: "model_output" as const,
          content: [{ type: "text" as const, text: turn.text }],
        }
  );


  if (input[0]?.type === "user_input") {
    input[0] = {
      type: "user_input",
      content: `${ASSISTANT_SYSTEM_PROMPT}\n\n${input[0].content}`,
    };
  }

  const interaction = await ai.interactions.create({
    model: MODEL,
    input,
    store: false, 
  });

  return interaction.output_text ?? "";
}