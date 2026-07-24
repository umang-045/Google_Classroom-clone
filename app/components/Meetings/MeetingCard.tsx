"use client"
import React from 'react'
import { VideoIcon, Lock, Trash2 } from 'lucide-react'
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
    onDelete: (id: number) => void
}

export const MeetingCard = ({ meeting, role, onStart, onJoin, onDelete }: MeetingCardProps) => {
    const scheduledTime = new Date(meeting.scheduled_at)
    const isBeforeScheduledTime = new Date() < scheduledTime

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

                        <div className='flex items-center gap-2 shrink-0'>
                            {meeting.status === "LIVE" && (
                                <span className='text-[10px] whitespace-nowrap px-2 py-0.5 rounded-full border font-medium bg-green-500/10 border-green-500/30 text-green-400 flex items-center gap-1.5'>
                                    <span className='inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse' />
                                    LIVE
                                </span>
                            )}
                            {meeting.status === "ENDED" && (
                                <span className='text-[10px] whitespace-nowrap px-2 py-0.5 rounded-full border font-medium bg-white/5 border-white/10 text-zinc-400'>
                                    ENDED
                                </span>
                            )}
                            {meeting.status === "SCHEDULED" && (
                                <span className='text-[10px] whitespace-nowrap px-2 py-0.5 rounded-full border font-medium bg-amber-500/10 border-amber-500/30 text-amber-400'>
                                    SCHEDULED
                                </span>
                            )}

                            {role === "teacher" && meeting.status !== "LIVE" && (
                                <button
                                    title="Delete meeting"
                                    onClick={() => onDelete(meeting.id)}
                                    className='text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer p-0.5'
                                >
                                    <Trash2 className='w-3.5 h-3.5' />
                                </button>
                            )}
                        </div>
                    </div>

                    <p className='text-xs text-zinc-400 font-medium'>
                        {scheduledTime.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                </div>
            </div>

            
            <div className='flex items-center justify-end gap-3 pt-0.5'>
                {role === "teacher" && meeting.status === "SCHEDULED" && (
                    isBeforeScheduledTime ? (
                        <span
                            title={`Available at ${scheduledTime.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}`}
                            className='flex items-center gap-1.5 text-[11px] text-zinc-500 italic cursor-not-allowed'
                        >
                            <Lock className='w-3 h-3' />
                            Starts {scheduledTime.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                    ) : (
                        <Button
                            size='sm'
                            className='bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs h-7 px-3 rounded-md cursor-pointer'
                            onClick={() => onStart(meeting.id)}
                        >
                            Start Meeting
                        </Button>
                    )
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