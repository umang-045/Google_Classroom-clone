import prisma from "@/lib/db";

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: "ASSIGNMENT" | "ANNOUNCEMENT" | "GRADE" | "QUIZ";
  isRead: boolean;
  created_at: string;
  classroom?: { className: string } | null;
}

export async function getNotifications(userId: number) {
  const notifications = await prisma.notification.findMany({
    where: {
      userId
    },
    orderBy: {
      created_at: "desc"
    },
    include: {
      classroom: {
        select: {
          className: true
        }
      }
    }
  });

  return notifications;
}

export async function markNotificationsRead(userId: number) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });

  return { success: true };
}