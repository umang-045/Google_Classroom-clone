import prisma from "@/lib/db";

interface BroadcastNotificationArgs {
  classroomId: number;
  title: string;
  message: string;
  type: "ASSIGNMENT" | "ANNOUNCEMENT" | "GRADE" | "QUIZ";
}

export async function sendNotificationToClass({
  classroomId,
  title,
  message,
  type
}: BroadcastNotificationArgs) {
  try {
    
    const enrollments = await prisma.classroomStudent.findMany({
      where: { 
        classroomId:classroomId,
    },
      select: { 
        userId: true
     }
    });

    if (enrollments.length === 0) return;

    const notificationData = enrollments.map((student) => ({
      userId: student.userId,
      classroomId,
      title,
      message, 
      type,
      isRead: false
    }));

    await prisma.notification.createMany({
      data: notificationData
    });


    const io = (global as any).io;
    if (io) {
      enrollments.forEach((student) => {
        const streamChannel = `user-channel-${student.userId}`;
        io.to(streamChannel).emit("new-notification-alert");
      });

    }

  } catch (error) {
    console.error (error);
  }
}