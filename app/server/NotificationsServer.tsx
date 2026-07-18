import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getNotifications, markNotificationsRead } from "@/lib/server/notifications";
import NotificationsClient from "@/app/components/NotificationsClient"

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: "ASSIGNMENT" | "ANNOUNCEMENT" | "GRADE" | "QUIZ";
  isRead: boolean;
  created_at: string;
  classroom?: { className: string } | null;
}

export default async function NotificationsServer() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  const notifications = (await getNotifications(userId)) as unknown as NotificationItem[];

  const unreadExists = notifications.some((n) => !n.isRead);
  if (unreadExists) {
    await markNotificationsRead(userId);
  }

  return <NotificationsClient initialNotifications={notifications} />;
}
