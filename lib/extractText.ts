import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-3.5-flash";


async function extractTextFromImage(imageUrl: string): Promise<string> {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const base64 = buffer.toString("base64");

  const lower = imageUrl.toLowerCase();
  const mimeType = lower.endsWith(".png")
    ? "image/png"
    : lower.endsWith(".webp")
    ? "image/webp"
    : "image/jpeg";

  const interaction = await ai.interactions.create({
    model: MODEL,
    input: [
      {
        type: "text",
        text: "Extract all readable text from this image. Return only the extracted text, no commentary.",
      },
      {
        type: "image",
        data: base64,
        mime_type: mimeType,
      },
    ],
  });

  return interaction.output_text ?? "";
}


export async function extractTextFromUrl(url: string): Promise<string> {
  const lower = url.toLowerCase();

  if (lower.endsWith(".pdf")) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch PDF: ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  if (lower.endsWith(".docx")) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch DOCX: ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (/\.(jpg|jpeg|png|webp)$/.test(lower)) {
    return extractTextFromImage(url);
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);
  return Buffer.from(await res.arrayBuffer()).toString("utf-8");
}