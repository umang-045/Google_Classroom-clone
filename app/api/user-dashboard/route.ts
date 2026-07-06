import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.id) {
    return NextResponse.json({ message: "Login and Try again" }, { status: 400 });
  }

  const userId = Number(token.id);

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        teachingClassrooms: {
          include: {
            students: { include: { user: true } },
            assignments: {
              include: { submissions: true },
              orderBy: { due_at: "asc" },
            },
            classroomAnnouncemnet: {
              orderBy: { created_at: "desc" },
              take: 10, // Increased from 5 to 10
            },
            meeting: {
              orderBy: { scheduled_at: "asc" },
            },
          },
        },
        enrolledClassrooms: {
          include: {
            classroom: {
              include: {
                teacher: true,
                assignments: {
                  include: {
                    submissions: { where: { studentId: userId } },
                  },
                  orderBy: { due_at: "asc" },
                },
                classroomAnnouncemnet: {
                  orderBy: { created_at: "desc" },
                  take: 10, // Increased from 5 to 10
                },
                meeting: {
                  orderBy: { scheduled_at: "asc" },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const now = new Date();

    // ---- Upcoming assignments (both roles) ----
    const enrolledAssignments = user.enrolledClassrooms.flatMap(({ classroom }) =>
      classroom.assignments.map((a) => ({
        id: a.id,
        title: a.title,
        classroomName: classroom.className,
        classroomId: classroom.id,
        due_at: a.due_at,
        role: "student" as const,
        submitted: a.submissions.length > 0,
      }))
    );

    const teachingAssignments = user.teachingClassrooms.flatMap((classroom) =>
      classroom.assignments.map((a) => ({
        id: a.id,
        title: a.title,
        classroomName: classroom.className,
        classroomId: classroom.id,
        due_at: a.due_at,
        role: "teacher" as const,
        submissionCount: a.submissions.length,
        gradedCount: a.submissions.filter((s) => s.marks !== null).length,
      }))
    );

    const upcomingAssignments = [...enrolledAssignments, ...teachingAssignments]
      .filter((a) => new Date(a.due_at) >= now)
      .sort((a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime())
      .slice(0, 10); // Increased from 5 to 10

    // ---- Teaching classrooms shaped, with pending grading count ----
    const teachingClassroomsShaped = user.teachingClassrooms.map((c) => {
      const pendingGrading = c.assignments.reduce(
        (sum, a) => sum + a.submissions.filter((s) => s.marks === null).length,
        0
      );
      return {
        id: c.id,
        className: c.className,
        section: c.section,
        semester: c.semester,
        studentsCount: c.students.length,
        pendingGrading,
      };
    });

    // ---- Enrolled classrooms shaped, with "not yet submitted" pending count ----
    const enrolledClassroomsShaped = user.enrolledClassrooms.map(({ classroom }) => {
      const pending = classroom.assignments.filter(
        (a) => a.submissions.length === 0 && new Date(a.due_at) >= now
      ).length;
      return {
        id: classroom.id,
        className: classroom.className,
        section: classroom.section,
        semester: classroom.semester,
        teacherName: classroom.teacher.name,
        pending,
      };
    });

    // ---- Announcements (merged, most recent first, now tagged with role) ----
    const announcements = [
      ...user.teachingClassrooms.flatMap((c) =>
        c.classroomAnnouncemnet.map((a) => ({
          id: a.id,
          title: a.title,
          content: a.content,
          classroomName: c.className,
          created_at: a.created_at,
          role: "teacher" as const,
        }))
      ),
      ...user.enrolledClassrooms.flatMap(({ classroom }) =>
        classroom.classroomAnnouncemnet.map((a) => ({
          id: a.id,
          title: a.title,
          content: a.content,
          classroomName: classroom.className,
          created_at: a.created_at,
          role: "student" as const,
        }))
      ),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // ---- Schedule: upcoming meetings across both roles ----
    const schedule = [
      ...user.teachingClassrooms.flatMap((c) =>
        c.meeting
          .filter((m) => new Date(m.scheduled_at) >= now)
          .map((m) => ({
            id: m.id,
            title: m.title,
            classroomName: c.className,
            scheduled_at: m.scheduled_at,
            role: "teacher" as const,
          }))
      ),
      ...user.enrolledClassrooms.flatMap(({ classroom }) =>
        classroom.meeting
          .filter((m) => new Date(m.scheduled_at) >= now)
          .map((m) => ({
            id: m.id,
            title: m.title,
            classroomName: classroom.className,
            scheduled_at: m.scheduled_at,
            role: "student" as const,
          }))
      ),
    ]
      .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
      .slice(0, 10); // Increased from 8 to 10

    const stats = {
      totalEnrolled: user.enrolledClassrooms.length,
      totalTeaching: user.teachingClassrooms.length,
      totalPendingGrading: teachingClassroomsShaped.reduce((s, c) => s + c.pendingGrading, 0),
      totalUpcomingAssignments: upcomingAssignments.length,
    };

    return NextResponse.json(
      {
        data: {
          user: { id: user.id, name: user.name, email: user.email, image: user.image },
          stats,
          enrolledClassrooms: enrolledClassroomsShaped,
          teachingClassrooms: teachingClassroomsShaped,
          upcomingAssignments,
          announcements,
          schedule,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}