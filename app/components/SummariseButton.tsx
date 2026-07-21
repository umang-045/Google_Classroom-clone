"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Standard shadcn utility for merging classes safely

type SummaryType = "announcement" | "assignment" | "chat";

interface SummarizeButtonProps {
  type: SummaryType;
  classroomId: number;
  sourceId?: number;
  className?: string;
}

export default function SummarizeButton({
  type,
  classroomId,
  sourceId,
  className,
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
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // NOTE: no wrapping div with margin here anymore — the button now sits
  // exactly where its parent's flex layout places it, with zero extra
  // offset. Spacing for the summary/error panel is applied to that panel
  // itself (below), not to a shared wrapper around the button.
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSummarize}
        disabled={loading}
        className={cn(
          "text-xs h-7 bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 transition-colors",
          className
        )}
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

      {error && <p className="text-xs text-red-400 mt-2 w-full basis-full">{error}</p>}

      {summary && (
        <div className="mt-3 w-full p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap animate-in fade-in-50 duration-200 basis-full">
          {summary}
        </div>
      )}
    </>
  );
}