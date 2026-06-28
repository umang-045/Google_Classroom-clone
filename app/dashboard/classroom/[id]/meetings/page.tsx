"use client"
import React, { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import ScheduleMeeting from '@/app/components/Meetings/ScheduleMeeting'
import { MeetingCard } from '@/app/components/Meetings/MeetingCard'
import { Loader2 } from 'lucide-react'

interface Meeting {
    id: number
    title: string
    status: "SCHEDULED" | "LIVE" | "ENDED"
    scheduled_at: string
}

const MeetPage = () => {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const classroomId = params.id as string
    const colorIndex = searchParams.get('colorIndex') || '0'

    const [role, setRole] = useState<string>("")
    const [meetings, setMeetings] = useState<Meeting[]>([])
    const [loading, setLoading] = useState(true)
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

    useEffect(() => {
        const init = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/classroom/${classroomId}/role`)
                const data = await res.json()
                if (!res.ok) {
                    router.push('/dashboard/allclasses')
                    return
                }
                setRole(data.role)
                await fetchMeetings()
            } finally {
                setLoading(false)
            }
        }
        init()
    }, [classroomId])

    const handleStart = async (meetingId: number) => {
        setActionLoading(meetingId)
        try {
            const res = await fetch(`/api/meetings/${classroomId}/${meetingId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "start" }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Failed to start meeting")
            router.push(`/dashboard/classroom/${classroomId}/meet/${meetingId}?colorIndex=${colorIndex}`)
        } catch (err: any) {
            alert(err.message || "Something went wrong")
        } finally {
            setActionLoading(null)
        }
    }
    const handleJoin = (meetingId: number) => {
        router.push(`/dashboard/classroom/${classroomId}/meet/${meetingId}?colorIndex=${colorIndex}`)
    }
    if (loading) return <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-6 animate-spin text-gray-400" />
    </div>

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
                        />
                    ))}
                </div>
            ) : (
                !error && <p className='text-center text-white/50 py-12'>No meetings scheduled yet.</p>
            )}
        </div>
    )
}

export default MeetPage
