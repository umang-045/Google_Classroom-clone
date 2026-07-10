"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import { Button } from '@/components/ui/button'
import { PhoneOff, Loader2 } from 'lucide-react'
import '@livekit/components-styles'

const MeetRoomComponent = () => {
    const params = useParams()
    const router = useRouter()
    const classroomId = params?.classroomId as string
    const meetingId = params?.meetingId as string
    const roomName = `meet-${meetingId}`

    const [role, setRole] = useState<string>("")
    const [myName, setMyName] = useState<string>("")
    const [token, setToken] = useState<string>("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!classroomId) return
        let isMounted = true

        const initializeRoom = async () => {
            try {
                const roleRes = await fetch(`/api/classroom/${classroomId}/role`)
                const roleData = await roleRes.json()
                if (!roleRes.ok) {
                    if (isMounted) setError(roleData.message || "Could not verify access")
                    return
                }
                if (isMounted) setRole(roleData.role)

                const profileRes = await fetch(`/api/userprofile`)
                const profileData = await profileRes.json()
                let currentUserName = `User-${Math.floor(Math.random() * 1000)}`

                if (profileRes.ok && isMounted && profileData.user?.name) {
                    setMyName(profileData.user.name)
                    currentUserName = profileData.user.name
                }

                const tokenRes = await fetch(
                    `/api/livekit-token?room=${roomName}&username=${encodeURIComponent(currentUserName)}`
                )
                const tokenData = await tokenRes.json()

                if (isMounted) {
                    setToken(tokenData.token)
                }
            } catch (err) {
                if (isMounted) setError("Failed to setup meeting workspace connection")
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        initializeRoom()
        return () => { isMounted = false }
    }, [classroomId, meetingId, roomName])

    const leaveMeeting = () => {
        router.push(`/dashboard/classroom/${classroomId}/meetings?colorIndex=0`)
    }

    const endMeetingForEveryone = async () => {
        try {
            await fetch(`/api/meetings/${classroomId}/${meetingId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "end" }),
            })
        } catch (e) {
            console.error(e)
        }
        leaveMeeting()
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen bg-slate-900 text-red-400 text-sm p-4 text-center">{error}</div>
    }

    if (loading || !token) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white/70 gap-3 p-4">
                <Loader2 className="size-6 animate-spin" />
                <p className="text-sm text-center">Connecting to Meeting.....</p>
            </div>
        )
    }

    return (
        <div className="relative flex flex-col h-screen bg-slate-900 text-white overflow-hidden" data-lk-theme="default">

            <nav className="flex items-center justify-between px-4 md:px-6 py-3 bg-slate-950 border-b border-white/10 z-10 gap-2">
                <h1 className="text-md md:text-lg font-bold shrink-0">
                    <span className="text-white">Digital</span>
                    <span className="text-blue-400">Classroom</span>
                </h1>

                
                <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                    <Button variant='destructive' size='sm' onClick={leaveMeeting} className='text-[11px] md:text-xs px-2.5 md:px-3 h-8 md:h-9 cursor-pointer'>
                        Leave Meeting
                    </Button>
                    {role === "teacher" && (
                        <Button variant='destructive' size='sm' onClick={endMeetingForEveryone} className='text-[11px] md:text-xs px-2.5 md:px-3 h-8 md:h-9 cursor-pointer'>
                            End for Everyone
                        </Button>
                    )}
                </div>
            </nav>

       
            <div className="flex-1 relative overflow-hidden w-full">
                <LiveKitRoom
                    key={token}
                    video={true}
                    audio={true}
                    token={token}
                    serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                    connect={true}
                >
                    <VideoConference />
                </LiveKitRoom>
            </div>
        </div>
    )
}

export default MeetRoomComponent;