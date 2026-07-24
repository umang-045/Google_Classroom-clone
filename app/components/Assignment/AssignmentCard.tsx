"use client"
import React from 'react'
import { ClipboardList, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SummarizeButton from '../SummariseButton'

interface Assignment {
    id: number
    title: string
    description: string
    due_at: string
    created_at: string
    fileUrl?: string
    submitted?: boolean
}

interface AssignmentCardProps {
    assignment: Assignment
    role: string
    classroomId: number
    isSubmittedByStudent: boolean
    onOpenWorkspace: (id: number) => void
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

export const AssignmentCard = ({ 
    assignment, 
    role, 
    classroomId, 
    isSubmittedByStudent, 
    onOpenWorkspace 
}: AssignmentCardProps) => {
    const isNew = Date.now() - new Date(assignment.created_at).getTime() < 86400000
    const isOverdue = new Date(assignment.due_at) < new Date()

    return (
        <div
            onClick={() => onOpenWorkspace(assignment.id)}
            className={`w-full rounded-2xl bg-white/[0.04] border border-white/10 text-white p-6 shadow-sm cursor-pointer hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200 group border-l-4 flex flex-col justify-between gap-6 ${
                isOverdue ? 'border-l-red-500/80' : 'border-l-blue-500/80'
            }`}
        >
            <div className='flex items-start gap-4'>
                <div className='shrink-0 w-10 h-10 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mt-0.5'>
                    <ClipboardList className='w-4 h-4 text-blue-400' />
                </div>

                <div className='min-w-0 flex-1 space-y-2'>
    
                    <div className='flex items-start justify-between gap-4'>
                        <div className='min-w-0 flex-1 space-y-1'>
                            <div className='flex items-center gap-2.5'>
                                <h3 className='text-base font-semibold text-white tracking-tight line-clamp-1'>
                                    {assignment.title}
                                </h3>
                                {isNew && (
                                    <span className='text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0'>
                                        New
                                    </span>
                                )}
                            </div>
                            <p className='text-xs text-white/40 font-medium'>
                                Created {getRelativeTime(assignment.created_at)}
                            </p>
                        </div>

                  
                        <span
                            className={`shrink-0 text-xs whitespace-nowrap px-3 py-1.5 rounded-lg border font-medium ${
                                isOverdue
                                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                    : 'bg-white/5 border-white/10 text-white/60'
                            }`}
                        >
                            Due: {new Date(assignment.due_at).toLocaleDateString()}
                        </span>
                    </div>

                
                    <p className='pt-1 text-sm text-white/70 leading-relaxed line-clamp-2 tracking-wide'>
                        {assignment.description}
                    </p>
                </div>
            </div>

            <div className='pt-4 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap'>
                <div 
                    className='flex items-center gap-2.5 flex-wrap' 
                    onClick={e => e.stopPropagation()}
                >
                    <SummarizeButton
                        type="assignment"
                        sourceId={assignment.id}
                        classroomId={classroomId}
                        className="h-8 bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 rounded-lg px-3 text-xs"
                    />

                    {assignment.fileUrl && (
                        <a
                            href={assignment.fileUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors'
                        >
                            <span>View Resource</span>
                            <ExternalLink className='w-3 h-3 text-white/50 shrink-0' />
                        </a>
                    )}
                </div>

                <div onClick={e => e.stopPropagation()}>
                    {role === "student" ? (
                        isSubmittedByStudent ? (
                            <div className='flex items-center gap-1.5 text-green-400 text-xs font-medium bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg h-8'>
                                Submitted
                            </div>
                        ) : (
                            <Button
                                size='sm'
                                className='bg-blue-500 hover:bg-blue-400 text-white text-xs h-8 px-4 rounded-lg'
                                onClick={() => onOpenWorkspace(assignment.id)}
                            >
                                Open assignment
                            </Button>
                        )
                    ) : (
                        <Button
                            variant='outline'
                            size='sm'
                            className='border-white/20 text-white/80 hover:bg-white/10 hover:text-white bg-transparent text-xs h-8 px-4 rounded-lg'
                            onClick={() => onOpenWorkspace(assignment.id)}
                        >
                            Manage submissions &rarr;
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}