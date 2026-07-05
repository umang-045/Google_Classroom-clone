"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type SummaryType = "announcement" | "assignment" | "chat";

interface SummarizeButtonProps {
  type: SummaryType;
  classroomId: number;
  sourceId?: number; 
}

export default function SummarizeButton({
  type,
  classroomId,
  sourceId,
}: SummarizeButtonProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSummarize() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, sourceId, classroomId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to summarize");
      }

      setSummary(data.summary);
    } catch (err) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSummarize}
        disabled={loading}
        className="text-xs h-7 bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300"
      >
        {loading ? (
          <>
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Summarizing...
          </>
        ) : (
          <>
            <Sparkles className="w-3 h-3 mr-1" />
            Summarize
          </>
        )}
      </Button>

      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

      {summary && (
        <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 leading-relaxed whitespace-pre-wrap">
          {summary}
        </div>
      )}
    </div>
  );
}