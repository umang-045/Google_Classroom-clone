import prisma from "@/lib/db";
import { sendClassNotificationEmail } from "./otp";

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
classroomId: classroomId,
      },
select: {
userId: true,
user: {
select: { email: true }
        }
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

Promise.allSettled(
enrollments.map((student) =>
sendClassNotificationEmail(student.user.email, title, message, type)
      )
    ).then((emailResults) => {
emailResults.forEach((result, i) => {
if (result.status === "rejected") {
console.error(`Email failed for user ${enrollments[i].userId}:`, result.reason);
        }
      });
    });

  } catch (error) {
console.error(error);
  }
}