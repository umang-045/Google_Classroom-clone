"use client"
import React from 'react'
import { Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SummarizeButton from '../SummariseButton'

interface Announcement {
    id: number
    title: string
    content: string
    created_at: string
}

interface AnnouncementCardProps {
    announcement: Announcement
    role: string
    classroomId: number
    onDelete: (id: number) => void
    deleteLoading: boolean
}

function getRelativeTime(dateString: string) {
    const diffMs = Date.now() - new Date(dateString).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return new Date(dateString).toLocaleDateString(undefined, { dateStyle: 'medium' })
}

export const AnnouncementCard = ({ announcement, role, classroomId, onDelete, deleteLoading }: AnnouncementCardProps) => {
    const isNew = Date.now() - new Date(announcement.created_at).getTime() < 86400000
    return (
        <div className='w-full rounded-xl bg-white/5 border border-white/10 border-l-4 border-l-amber-500/70 text-white p-5 shadow-sm hover:bg-white/[0.07] transition-colors'>
            <div className='flex items-start gap-3'>
                <div className='shrink-0 w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center'>
                    <Megaphone className='w-4 h-4 text-amber-400' />
                </div>
                <div className='min-w-0 flex-1'>
                    <div className='flex items-center justify-between gap-3'>
                        <div className='flex items-center gap-2 min-w-0'>
                            <h3 className='text-base font-semibold text-white truncate'>{announcement.title}</h3>
                            {isNew && (
                                <span className='text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0'>
                                    New
                                </span>
                            )}
                        </div>
                        {role === "teacher" && (
                            <Button
                                variant='destructive'
                                size='sm'
                                className='text-xs h-7 shrink-0'
                                onClick={() => onDelete(announcement.id)}
                                disabled={deleteLoading}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                    <p className='mt-1 text-xs text-white/40'>
                        {getRelativeTime(announcement.created_at)}
                    </p>
                    <p className='mt-3 text-sm text-white/70 leading-relaxed whitespace-pre-wrap'>
                        {announcement.content}
                    </p>

                    <SummarizeButton
                        type="announcement"
                        sourceId={announcement.id}
                        classroomId={classroomId}
                    />
                </div>
            </div>
        </div>
    )
}