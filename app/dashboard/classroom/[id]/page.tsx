import AnnouncementsServer from "@/app/server/AnnouncementsServer"

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return <AnnouncementsServer classroomId={id} />
}
export default Page