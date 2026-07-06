"use client";

import { useEffect, useRef, useState } from "react";
import ChatForm from "@/app/components/Chatroom/ChatForm";
import ChatMessage from "@/app/components/Chatroom/ChatMessage";
import { socket } from "@/lib/socketclient";
import { useParams } from "next/navigation";
import { Loader2, MessageSquare } from "lucide-react";

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

const ChatPage = () => {
    const params = useParams();
    const classroomId = params.id
    const room = `class-${classroomId}`;
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let active = true;
        const fetchChatData = async () => {
            try {
                const res = await fetch(`/api/classroom/${classroomId}/chat`);
                const data: { messages: Message[]; currentUser: CurrentUser } = await res.json();
                console.log("currentUser:", data.currentUser);
                if (!active) return;
                const username = data.currentUser.name;
                setMessages([...data.messages].reverse());
                setCurrentUser(data.currentUser);
                socket.emit("join-room", { room, username: username });
            } catch (error) {
                console.error(error);
            } finally {
                if (active) setLoading(false);
            }
        };
        fetchChatData();

        return () => {
            active = false;
        };
    }, [classroomId, room]);

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
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (message: string) => {
        const res = await fetch(`/api/classroom/${classroomId}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
                image: currentUser?.image
            }
        }

        setMessages((prev) =>
            prev.some((m) => m.id === saved.id) ? prev : [...prev, messageWithImage]
        );
        socket.emit("message", { room, ...messageWithImage });
    };

    const senderName = (sender: Sender | string) =>
        typeof sender === "string" ? sender : sender.name;

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] gap-3">
            <div className="relative flex items-center justify-center">
                <Loader2 className="size-8 animate-spin text-blue-400 duration-1000" />
            </div>
        
        </div>
    )

    return (
        <div className="w-full py-6 px-4 md:px-6 text-white animate-in fade-in duration-300">
            <div className="w-full max-w-7xl mx-auto space-y-6">
                
         
                <div className='flex items-center gap-4 pl-0.5 pb-2 border-b border-white/10'>
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-sm'>
                        <MessageSquare size={22} />
                    </div>
                    <div>
                        <h3 className='font-semibold text-2xl tracking-tight text-white'>
                            Classroom Chat
                        </h3>
                        <p className='text-xs text-white/50 mt-0.5'>
                            Real-time discussion board with your classmates and instructors
                        </p>
                    </div>
                </div>

       
                <div 
                    style={{ backgroundImage: "url('/bg3.webp')" }}
                    className="flex flex-col h-[520px] overflow-y-auto p-5 rounded-xl border border-white/15 bg-cover bg-center bg-no-repeat shadow-md space-y-4 relative"
                >
                   
                    <div className="absolute inset-0 bg-black/30 pointer-events-none rounded-xl" />

                    <div className="flex flex-col space-y-4 relative z-10 w-full h-full overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="flex flex-1 items-center justify-center h-full">
                                <p className="text-xs text-white/60 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-xs italic">
                                    No messages yet. Say hello to get the conversation started!
                                </p>
                            </div>
                        ) : (
                            messages.map((msg, i) => {
                                const uniqueKey = msg.id ? `msg-${msg.id}` : `idx-${i}`;
                                return (
                                    <ChatMessage
                                        key={uniqueKey}
                                        sender={senderName(msg.sender)}
                                        message={msg.message}
                                        image={typeof msg.sender === "object" ? msg.sender.image : undefined}
                                        isOwnMessage={senderName(msg.sender) === currentUser?.name}
                                        timestamp={msg.created_at}
                                    />
                                );
                            })
                        )}
                        <div ref={bottomRef} />
                    </div>
                </div>

                
                <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                    <ChatForm onSendMessage={handleSendMessage} />
                </div>
            </div>
        </div>
    );
}

export default ChatPage;