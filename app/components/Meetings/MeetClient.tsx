"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import ScheduleMeeting from '@/app/components/Meetings/ScheduleMeeting'
import { MeetingCard } from '@/app/components/Meetings/MeetingCard'
import { toastOptions } from '../toastOptions'

interface Meeting {
    id: number
    title: string
    status: "SCHEDULED" | "LIVE" | "ENDED"
    scheduled_at: string
}

interface MeetClientProps {
    classroomId: string
    initialRole: string
    initialMeetings: Meeting[]
}

const MeetClient = ({ classroomId, initialRole, initialMeetings }: MeetClientProps) => {
    const router = useRouter()

    const [role] = useState<string>(initialRole)
    const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings)
    const [error, setError] = useState("")
    const [scheduleBox, setScheduleBox] = useState(false)
    const [actionLoading, setActionLoading] = useState<number | null>(null)

    const fetchMeetings = async () => {
        try {
            const res = await fetch(`/api/meetings/${classroomId}`)
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Failed to load meetings")
            setMeetings(data.meetings || [])
        } catch (err: any) {
            setError(err.message || "Something went wrong")
        }
    }

    const handleStart = async (meetingId: number) => {
        const meeting = meetings.find((m) => m.id === meetingId)

        if (meeting && new Date() < new Date(meeting.scheduled_at)) {
            toast.error(
                `This meeting is scheduled for ${new Date(meeting.scheduled_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}. You can't start it early.`,toastOptions
            )
            return
        }

        const newTab = window.open('', '_blank')
        setActionLoading(meetingId)
        try {
            const res = await fetch(`/api/meetings/${classroomId}/${meetingId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "start" }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Failed to start meeting")
            router.push(`/meet/${classroomId}/${meetingId}`)
            if (newTab) newTab.location.href = `/meet/${classroomId}/${meetingId}`
        } catch (err: any) {
            if (newTab) newTab.close()
            toast.error(err.message || "Something went wrong",toastOptions)
        } finally {
            setActionLoading(null)
        }
    }

    const handleJoin = (meetingId: number) => {
        window.open(`/meet/${classroomId}/${meetingId}`, '_blank')
    }

    const handleDelete = async (meetingId: number) => {
        const meeting = meetings.find((m) => m.id === meetingId)
        if (!meeting) return

        const confirmed = window.confirm(`Delete "${meeting.title}"? This cannot be undone.`)
        if (!confirmed) return

        const previousMeetings = meetings
        setMeetings((prev) => prev.filter((m) => m.id !== meetingId))

        try {
            const res = await fetch(`/api/meetings/${classroomId}/${meetingId}`, {
                method: "DELETE",
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Failed to delete meeting")
            toast.success("Meeting deleted",toastOptions)
        } catch (err: any) {
            setMeetings(previousMeetings)
            toast.error(err.message || "Something went wrong",toastOptions)
        }
    }

    return (
        <div className='py-4 px-2 sm:px-4'>
            {role === "teacher" && (
                <div className='flex justify-end mb-6'>
                    <Button onClick={() => setScheduleBox(true)}>
                        + Schedule Meeting
                    </Button>
                    {scheduleBox && (
                        <ScheduleMeeting
                            classroomId={Number(classroomId)}
                            setScheduleMeetingBox={setScheduleBox}
                            onSuccess={fetchMeetings}
                        />
                    )}
                </div>
            )}

            {error && <p className='text-center text-destructive mb-4'>{error}</p>}

            {meetings.length > 0 ? (
                <div className='space-y-3'>
                    {meetings.map((meeting) => (
                        <MeetingCard
                            key={meeting.id}
                            meeting={meeting}
                            role={role}
                            onStart={handleStart}
                            onJoin={handleJoin}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                !error && <p className='text-center text-white/50 py-12'>No meetings scheduled yet.</p>
            )}
        </div>
    )
}

export default MeetClient