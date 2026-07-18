import ChatServer from "@/app/server/ChatServer";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    
    return <ChatServer id={id} />;
}