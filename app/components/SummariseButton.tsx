"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSummary(null);
    setError(null);
    setIsOpen(false);
  }, [type, classroomId, sourceId]);

  async function handleSummarize() {
    if (summary) {
      setIsOpen((prev) => !prev);
      return;
    }

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
      setIsOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

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
        ) : isOpen ? (
          <>
            <ChevronUp className="w-3 h-3 mr-1" />
            Hide Summary
          </>
        ) : (
          <>
            <Sparkles className="w-3 h-3 mr-1" />
            {summary ? "Show Summary" : "Summarize"}
          </>
        )}
      </Button>

      {error && (
        <p className="text-xs text-red-400 mt-2 w-full basis-full">{error}</p>
      )}

      {isOpen && summary && (
        <div className="mt-3 w-full p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap animate-in fade-in-50 duration-200 basis-full">
          {summary}
        </div>
      )}
    </>
  );
}