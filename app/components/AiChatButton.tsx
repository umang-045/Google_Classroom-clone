"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Sparkles, X, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
    role: "user" | "assistant"
    text: string
}

interface AIChatButtonProps {
    trigger?: (onClick: () => void) => React.ReactNode
}

export default function AIChatButton({ trigger }: AIChatButtonProps = {}) {
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }, [messages, open])

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => { document.body.style.overflow = "" }
    }, [open])

    async function handleSend() {
        const trimmed = input.trim()
        if (!trimmed || loading) return

        const nextMessages: Message[] = [...messages, { role: "user", text: trimmed }]
        setMessages(nextMessages)
        setInput("")
        setLoading(true)

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ history: nextMessages }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to get a response")
            }

            setMessages([...nextMessages, { role: "assistant", text: data.reply }])
        } catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong"
            setMessages([...nextMessages, { role: "assistant", text: `⚠️ ${message}` }])
        } finally {
            setLoading(false)
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <>
            {trigger ? (
                trigger(() => setOpen(true))
            ) : (
                <Button
                    onClick={() => setOpen(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-black gap-2 font-medium"
                >
                    <Sparkles className="w-4 h-4" />
                    Ask AI
                </Button>
            )}

            {mounted && open && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-xs"
                    onClick={() => setOpen(false)}
                >
                    <div
                        style={{ background: 'linear-gradient(to top, #27272a, #151519)' }}
                        className="relative w-full max-w-xl h-[600px] max-h-[85vh] rounded-xl border border-zinc-800/80 p-8 shadow-2xl flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 text-zinc-200"
                        onClick={(e) => e.stopPropagation()}
                    >
              
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-5 right-5 text-zinc-400 hover:text-red-400 cursor-pointer transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-4 pl-0.5 pb-6 shrink-0">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800/70 text-amber-400 border border-zinc-700/60 shadow-inner">
                                <Sparkles size={22} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-2xl tracking-tight text-white">
                                    AI Assistant
                                </h3>
                                <p className="text-xs text-zinc-400 mt-1">
                                    Ask about your classes, assignments, or anything else
                                </p>
                            </div>
                        </div>

                        <div ref={scrollRef} className="flex-1 overflow-y-auto px-0.5 py-2 space-y-4 border-t border-zinc-800/60">
                            {messages.length === 0 && (
                                <p className="text-xs text-zinc-500 text-center mt-12 italic">
                                    I'm here to help. Type a question down below to start.
                                </p>
                            )}

                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user"
                                                ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                                                : "bg-zinc-900/40 border border-zinc-800/80 text-zinc-300"
                                            }`}
                                    >
                                        {m.text}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-lg px-4 py-2.5 flex items-center gap-2.5">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
                                        <span className="text-xs text-zinc-500">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                 
                        <div className="pt-4 border-t border-zinc-800/60 flex items-end gap-3 shrink-0">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Write your message here..."
                                rows={1}
                                autoFocus
                                className="flex min-h-[44px] max-h-24 flex-1 resize-none rounded-md border border-zinc-700 bg-zinc-900/40 px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-500"
                            />
                            <Button
                                size="sm"
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="h-11 w-11 rounded-md cursor-pointer p-0 bg-blue-700 hover:bg-blue-800 text-white font-medium border-0 shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}