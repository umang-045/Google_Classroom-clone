import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getUserDashboardData } from "@/lib/server/userDashboard"
import UserDashboardClient from "@/app/components/UserDashboardClient"

const UserDashboardServer = async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return null
    }

    const userId = Number(session.user.id)

    try {
        const { data } = await getUserDashboardData(userId)

        const serializedData = {
            ...data,
            upcomingAssignments: data.upcomingAssignments.map((a: any) => ({
                ...a,
                due_at: a.due_at.toISOString(),
            })),
            announcements: data.announcements.map((a: any) => ({
                ...a,
                created_at: a.created_at.toISOString(),
            })),
            schedule: data.schedule.map((m: any) => ({
                ...m,
                scheduled_at: m.scheduled_at.toISOString(),
            })),
        }

        return <UserDashboardClient initialUserData={serializedData} />
    } catch (err) {
        return null
    }
}

export default UserDashboardServer