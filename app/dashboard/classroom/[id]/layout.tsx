import ClassroomLayoutServer from '@/app/server/ClassroomLayoutServer'


const ClassroomLayout = async ({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) => {

    const { id } = await params;

    return <ClassroomLayoutServer classroomId={id}>{children}</ClassroomLayoutServer>
}

export default ClassroomLayout