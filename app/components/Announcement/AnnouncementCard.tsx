"use client"
import React from 'react'
import { Button } from '@/components/ui/button'

interface Announcement {
    id: number
    title: string
    content: string
    created_at: string
}

interface AnnouncementCardProps {
    announcement: Announcement
    role: string
    onDelete: (id: number) => void
    deleteLoading: boolean
}

export const AnnouncementCard = ({ announcement, role, onDelete, deleteLoading }: AnnouncementCardProps) => {
    return (
        <div className='w-full rounded-xl bg-white/10 border border-white/15 text-white p-6 shadow-sm'>
            <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0 flex-1'>
                    <h3 className='text-base font-semibold text-white'>{announcement.title}</h3>
                    <p className='mt-2 text-sm text-white/70 leading-relaxed'>{announcement.content}</p>
                </div>
                {role === "teacher" && (
                    <Button
                        variant='destructive'
                        size='sm'
                        className='text-xs h-8 shrink-0'
                        onClick={() => onDelete(announcement.id)}
                        disabled={deleteLoading}
                    >
                        Delete
                    </Button>
                )}
            </div>
            <p className='mt-4 pt-4 border-t border-white/10 text-xs text-white/40'>
                Posted on {new Date(announcement.created_at).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                })}
            </p>
        </div>
    )
}