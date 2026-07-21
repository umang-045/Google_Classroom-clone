"use client"
import React from 'react'
import { VideoIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Meeting {
    id: number
    title: string
    status: "SCHEDULED" | "LIVE" | "ENDED"
    scheduled_at: string
}

interface MeetingCardProps {
    meeting: Meeting
    role: string
    onStart: (id: number) => void
    onJoin: (id: number) => void
}

export const MeetingCard = ({ meeting, role, onStart, onJoin }: MeetingCardProps) => {
    return (
        <div className="w-full rounded-xl bg-white/[0.04] border border-white/10 border-l-4 border-l-blue-500/80 text-white p-4 shadow-sm hover:bg-white/[0.07] transition-all duration-200 flex flex-col justify-between gap-3">
            <div className='flex items-start gap-3'>
                <div className='shrink-0 w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mt-0.5'>
                    <VideoIcon className='w-4 h-4 text-blue-400' />
                </div>

                <div className='min-w-0 flex-1 space-y-1'>
                    <div className='flex items-center justify-between gap-3'>
                        <h3 className='text-base font-semibold text-white tracking-tight truncate min-w-0 flex-1'>
                            {meeting.title}
                        </h3>

                        {meeting.status === "LIVE" && (
                            <span className='text-[10px] whitespace-nowrap px-2 py-0.5 rounded-full border font-medium bg-green-500/10 border-green-500/30 text-green-400 shrink-0 flex items-center gap-1.5'>
                                <span className='inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse' />
                                LIVE
                            </span>
                        )}
                        {meeting.status === "ENDED" && (
                            <span className='text-[10px] whitespace-nowrap px-2 py-0.5 rounded-full border font-medium bg-white/5 border-white/10 text-zinc-400 shrink-0'>
                                ENDED
                            </span>
                        )}
                        {meeting.status === "SCHEDULED" && (
                            <span className='text-[10px] whitespace-nowrap px-2 py-0.5 rounded-full border font-medium bg-amber-500/10 border-amber-500/30 text-amber-400 shrink-0'>
                                SCHEDULED
                            </span>
                        )}
                    </div>

                    <p className='text-xs text-zinc-400 font-medium'>
                        {new Date(meeting.scheduled_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                </div>
            </div>

            {/* Action Bar (No Separator Line) */}
            <div className='flex items-center justify-end gap-3 pt-0.5'>
                {role === "teacher" && meeting.status === "SCHEDULED" && (
                    <Button
                        size='sm'
                        className='bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs h-7 px-3 rounded-md cursor-pointer'
                        onClick={() => onStart(meeting.id)}
                    >
                        Start Meeting
                    </Button>
                )}

                {role === "student" && meeting.status === "LIVE" && (
                    <Button
                        size='sm'
                        className='bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-green-300 text-xs h-7 px-3 rounded-md cursor-pointer'
                        onClick={() => onJoin(meeting.id)}
                    >
                        Join
                    </Button>
                )}
                {role === "teacher" && meeting.status === "LIVE" && (
                    <Button
                        size='sm'
                        className='bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-green-300 text-xs h-7 px-3 rounded-md cursor-pointer'
                        onClick={() => onJoin(meeting.id)}
                    >
                        Rejoin Meeting
                    </Button>
                )}

                {meeting.status === "ENDED" && (
                    <span className='text-xs text-zinc-500 italic'>Meeting ended</span>
                )}
            </div>
        </div>
    )
}