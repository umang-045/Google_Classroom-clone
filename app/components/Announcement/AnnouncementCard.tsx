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
  return new Date(dateString).toLocaleDateString('en-US', { dateStyle: 'medium' })
}

export const AnnouncementCard = ({ 
  announcement, 
  role, 
  classroomId, 
  onDelete, 
  deleteLoading 
}: AnnouncementCardProps) => {
  const isNew = Date.now() - new Date(announcement.created_at).getTime() < 86400000

  return (
    <div className='w-full rounded-xl bg-white/[0.04] border border-white/10 border-l-4 border-l-blue-500/80 text-white p-4 shadow-sm hover:bg-white/[0.07] transition-all duration-200 flex flex-col justify-between gap-3'>
      <div className='flex items-start gap-3'>
        <div className='shrink-0 w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mt-0.5'>
          <Megaphone className='w-4 h-4 text-blue-400' />
        </div>

        <div className='min-w-0 flex-1 space-y-1'>
          <div className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-2 min-w-0'>
              <h3 className='text-base font-semibold text-white truncate tracking-tight'>
                {announcement.title}
              </h3>
              {isNew && (
                <span className='text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0'>
                  New
                </span>
              )}
            </div>

            {role === "teacher" && (
              <Button
                variant='destructive'
                size='sm'
                className='text-xs h-7 px-2.5 shrink-0 cursor-pointer rounded-md'
                onClick={() => onDelete(announcement.id)}
                disabled={deleteLoading}
              >
                Delete
              </Button>
            )}
          </div>

          <p className='text-xs text-zinc-400 font-medium'>
            {getRelativeTime(announcement.created_at)}
          </p>

          <p className='text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap pt-1'>
            {announcement.content}
          </p>
        </div>
      </div>

      <div className='flex items-center justify-between gap-3 flex-wrap'>
        <SummarizeButton
          type="announcement"
          sourceId={announcement.id}
          classroomId={classroomId}
          className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 py-1 h-7 text-xs rounded-md px-3"
        />
      </div>
    </div>
  )
}