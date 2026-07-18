import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getClassroomChatData } from "@/lib/server/chat";
import ChatPageClient from "../components/Chatroom/ChatPageClient";
import { redirect } from "next/navigation";

interface ChatServerProps {
    id: string;
}

export default async function ChatServer({ id }: ChatServerProps) {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !(session.user as any).id) {
        redirect("/api/auth/signin");
    }

    try {
        const userId = String((session.user as any).id);
        const { messages, currentUser } = await getClassroomChatData(id, userId);

        return (
            <ChatPageClient 
                initialMessages={messages} 
                initialCurrentUser={currentUser} 
            />
        );
    } catch (error: any) {
        if (error.message === "FORBIDDEN") {
            return <div className="text-white p-6 text-center">Not a member of this classroom</div>;
        }
        return <div className="text-white p-6 text-center">An error occurred loading the chat</div>;
    }
}