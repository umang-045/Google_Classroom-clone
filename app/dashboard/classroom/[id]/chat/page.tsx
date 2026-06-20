"use client";

import { useEffect, useRef, useState } from "react";
import ChatForm from "@/app/components/Chatroom/ChatForm";
import ChatMessage from "@/app/components/Chatroom/ChatMessage";
import { socket } from "@/lib/socketclient";
import { useParams } from "next/navigation";

interface Sender {
    name: string;
    email: string;
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
}

const ChatPage =()=> {
    const params= useParams();
    const classroomId=params.id
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

        setMessages((prev) =>
            prev.some((m) => m.id === saved.id) ? prev : [...prev, saved]
        );
        socket.emit("message", { room, ...saved });
    };

    const senderName = (sender: Sender | string) =>
        typeof sender === "string" ? sender : sender.name;

    if (loading) {
        return <div className="mt-24 text-center">Loading chat...</div>;
    }

    return (
        <div className="flex mt-8 justify-center w-full">
            <div className="w-full max-w-7xl mx-auto">
                <h1 className="mb-4 text-3xl font-medium text-white/70">Classroom Chat</h1>
                <div className="flex flex-col h-140 overflow-y-auto p-4  text-white rounded-lg bg-white/20">
                    {messages.map((msg, i) => {
                        const uniqueKey = msg.id ? `msg-${msg.id}` : `idx-${i}`;
                        return (
                            <ChatMessage
                                key={uniqueKey}
                                sender={senderName(msg.sender)}
                                message={msg.message}
                                isOwnMessage={senderName(msg.sender) === currentUser?.name}
                                timestamp={msg.created_at}
                            />
                        );
                    })}
                    <div ref={bottomRef} />
                </div>
                <ChatForm onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
}
export default ChatPage