"use client";

import { useEffect, useRef, useState } from "react";
import ChatForm from "@/app/components/Chatroom/ChatForm";
import ChatMessage from "@/app/components/Chatroom/ChatMessage";
import { socket } from "@/lib/socketclient";
import { useParams } from "next/navigation";
import { MessageSquare } from "lucide-react";

interface Sender {
    name: string;
    email: string;
    image: string;
}

interface Message {
    id?: number;
    sender: Sender | string;
    message: string;
    created_at?: string;
}

interface CurrentUser {
    id: number;
    name: string;
    email: string;
    image?: string;
}

interface ChatPageClientProps {
    initialMessages: any[];
    initialCurrentUser: CurrentUser;
}

const ChatPageClient = ({ initialMessages, initialCurrentUser }: ChatPageClientProps) => {
    const params = useParams();
    const classroomId = params.id;
    const room = `class-${classroomId}`;

    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(initialCurrentUser);
    const [messages, setMessages] = useState<Message[]>([...initialMessages].reverse());
    const [loading, setLoading] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (currentUser) {
            socket.emit("join-room", {
                room,
                username: currentUser.name,
            });
        }
    }, [room, currentUser]);

    useEffect(() => {
        const handleUserJoined = (message: string) => {
            setMessages((prev) => [...prev, { sender: "system", message }]);
        };

        const handleMessage = (data: Message) => {
            setMessages((prev) => {
                if (data.id != null && prev.some((m) => m.id === data.id)) {
                    return prev;
                }
                return [...prev, data];
            });
        };

        socket.on("user_joined", handleUserJoined);
        socket.on("message", handleMessage);

        return () => {
            socket.off("user_joined", handleUserJoined);
            socket.off("message", handleMessage);
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    const handleSendMessage = async (message: string) => {
        const res = await fetch(`/api/classroom/${classroomId}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        });

        if (!res.ok) {
            console.error("Failed to send message", await res.text());
            return;
        }

        const saved = await res.json();

        const messageWithImage = {
            ...saved,
            sender: {
                ...saved.sender,
                image: currentUser?.image,
            },
        };

        setMessages((prev) =>
            prev.some((m) => m.id === saved.id)
                ? prev
                : [...prev, messageWithImage]
        );

        socket.emit("message", {
            room,
            ...messageWithImage,
        });
    };

    const senderName = (sender: Sender | string) =>
        typeof sender === "string" ? sender : sender.name;

    return (
        /* Balanced perfectly at max-w-6xl for optimal readability and size */
        <div className="w-full overflow-x-hidden px-2 py-3 md:py-6 text-white animate-in fade-in duration-300">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:gap-6">
              
                <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-sm sm:h-11 sm:w-11 md:h-12 md:w-12">
                        <MessageSquare className="h-5 w-5 md:h-6 md:w-6" />
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold tracking-tight sm:text-xl md:text-2xl">
                            Classroom Chat
                        </h3>

                        <p className="text-xs text-muted-foreground sm:text-sm">
                            Real-time discussion board with your classmates and instructors
                        </p>
                    </div>
                </div>

                <div className="relative flex h-[65vh] sm:h-[70vh] md:h-[530px] w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111217] shadow-2xl shadow-black/40">
                    <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6 space-y-4">
                            {messages.length === 0 ? (
                                <div className="flex h-full flex-1 items-center justify-center">
                                    <p className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-center text-xs italic text-zinc-400 backdrop-blur-sm">
                                        No messages yet. Say hello to get the conversation started!
                                    </p>
                                </div>
                            ) : (
                                messages.map((msg, i) => {
                                    const uniqueKey = msg.id
                                        ? `msg-${msg.id}`
                                        : `idx-${i}`;

                                    return (
                                        <ChatMessage
                                            key={uniqueKey}
                                            sender={senderName(msg.sender)}
                                            message={msg.message}
                                            image={
                                                typeof msg.sender === "object"
                                                    ? msg.sender.image
                                                    : undefined
                                            }
                                            isOwnMessage={
                                                senderName(msg.sender) === currentUser?.name
                                            }
                                            timestamp={msg.created_at}
                                        />
                                    );
                                })
                            )}

                            <div ref={bottomRef} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#111217] p-3 md:p-4 shadow-xl">
                    <ChatForm onSendMessage={handleSendMessage} />
                </div>
            </div>
        </div>
    );
};
export default ChatPageClient;