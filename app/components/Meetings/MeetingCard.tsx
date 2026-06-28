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
        <div className="w-full rounded-xl bg-white/10 border border-white/15 border-l-4 border-l-blue-500/70 text-white p-6 shadow-sm">
            <div className='flex items-start gap-3'>
                <div className='shrink-0 w-9 h-9 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center'>
                    <VideoIcon className='w-4 h-4 text-blue-400' />
                </div>

                <div className='min-w-0 flex-1'>
                    <div className='flex items-start justify-between gap-4'>
                        <div className='min-w-0 flex-1'>
                            <h3 className='text-base font-semibold text-white line-clamp-1'>
                                {meeting.title}
                            </h3>
                            <p className='mt-1 text-xs text-white/40'>
                                {new Date(meeting.scheduled_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                        </div>

                        {meeting.status === "LIVE" && (
                            <span className='text-xs whitespace-nowrap px-2.5 py-1 rounded-full border font-medium bg-green-500/10 border-green-500/30 text-green-400'>
                                <span className='inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse' />
                                LIVE
                            </span>
                        )}
                        {meeting.status === "ENDED" && (
                            <span className='text-xs whitespace-nowrap px-2.5 py-1 rounded-full border font-medium bg-white/5 border-white/10 text-white/40'>
                                ENDED
                            </span>
                        )}
                        {meeting.status === "SCHEDULED" && (
                            <span className='text-xs whitespace-nowrap px-2.5 py-1 rounded-full border font-medium bg-amber-500/10 border-amber-500/30 text-amber-400'>
                                SCHEDULED
                            </span>
                        )}
                    </div>

                    <div className='mt-4 pt-4 border-t border-white/5 flex items-center justify-end'>
                        {role === "teacher" && meeting.status === "SCHEDULED" && (
                            <Button
                                size='sm'
                                className='bg-blue-600 hover:bg-blue-700 text-white text-xs h-8'
                                onClick={() => onStart(meeting.id)}
                            >
                                Start Meeting
                            </Button>
                        )}

                        {role === "student" && meeting.status === "LIVE" && (
                            <Button
                                size='sm'
                                className='bg-green-600 hover:bg-green-700 text-white text-xs h-8'
                                onClick={() => onJoin(meeting.id)}
                            >
                                Join
                            </Button>
                        )}

                        {meeting.status === "ENDED" && (
                            <span className='text-xs text-white/30 italic'>Meeting ended</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}