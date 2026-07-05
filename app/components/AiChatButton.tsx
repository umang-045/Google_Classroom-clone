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
                    className="bg-amber-500 hover:bg-amber-400 text-black gap-2"
                >
                    <Sparkles className="w-4 h-4" />
                    Ask AI
                </Button>
            )}


            {mounted && open && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
                    onClick={() => setOpen(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md h-[600px] max-h-[85vh] rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl flex flex-col overflow-hidden"
                    >

                        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                            <div className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-white">AI Assistant</p>
                                <p className="text-[10px] text-white/40">Ask me anything</p>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-white/40 hover:text-white transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                            {messages.length === 0 && (
                                <p className="text-xs text-white/40 text-center mt-8">
                                    Ask about your classes, assignments, or anything else — I'm here to help.
                                </p>
                            )}

                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${m.role === "user"
                                                ? "bg-amber-500 text-black"
                                                : "bg-white/5 border border-white/10 text-white/80"
                                            }`}
                                    >
                                        {m.text}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
                                        <Loader2 className="w-3 h-3 animate-spin text-white/50" />
                                        <span className="text-xs text-white/50">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-white/10 p-3 flex items-end gap-2">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                rows={1}
                                autoFocus
                                className="flex-1 resize-none bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 max-h-24"
                            />
                            <Button
                                size="sm"
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="h-9 w-9 p-0 bg-amber-500 hover:bg-amber-400 text-black shrink-0"
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