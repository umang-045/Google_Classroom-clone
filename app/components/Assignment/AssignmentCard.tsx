"use client"
import React from 'react'
import { ClipboardList } from 'lucide-react'
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

export const AssignmentCard = ({ assignment, role, classroomId, isSubmittedByStudent, onOpenWorkspace }: AssignmentCardProps) => {
    const isNew = Date.now() - new Date(assignment.created_at).getTime() < 86400000
    const isOverdue = new Date(assignment.due_at) < new Date()

    return (
        <div onClick={() => onOpenWorkspace(assignment.id)} className="w-full rounded-xl bg-white/10 border border-white/15 border-l-4 border-l-blue-500/70 text-white p-4 shadow-sm cursor-pointer hover:bg-white/15 transition-all duration-200 group layout-card">
            <div className='flex items-start gap-3'>
                <div className='shrink-0 w-9 h-9 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center'>
                    <ClipboardList className='w-4 h-4 text-blue-400' />
                </div>

                <div className='min-w-0 flex-1'>
                    <div className='flex items-start justify-between gap-4'>
                        <div className='min-w-0 flex-1'>
                            <div className='flex items-center gap-2'>
                                <h3 className='text-base font-semibold text-white transition-colors line-clamp-1'>
                                    {assignment.title}
                                </h3>
                                {isNew && (
                                    <span className='text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0'>
                                        New
                                    </span>
                                )}
                            </div>

                            <p className='text-[11px] text-white/40'>
                                Created {getRelativeTime(assignment.created_at)}
                            </p>

                            <p className='mt-1 text-sm text-white/70 line-clamp-2'>
                                {assignment.description}
                            </p>
                        </div>

                        <span className={`text-xs whitespace-nowrap px-2.5 py-1 rounded-md border ${
                            isOverdue
                                ? 'bg-white/5 border-white/10 text-white/40 line-through'
                                : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}>
                            Due: {new Date(assignment.due_at).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="mt-2" onClick={e => e.stopPropagation()}>
                        <SummarizeButton
                            type="assignment"
                            sourceId={assignment.id}
                            classroomId={classroomId}
                            className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 py-1 h-7 text-xs"
                        />
                    </div>

                    <div className='mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-4' onClick={e => e.stopPropagation()}>
                        <div>
                            {assignment.fileUrl && (
                                <a href={assignment.fileUrl} target='_blank' rel='noopener noreferrer' className='text-xs text-white/80 underline hover:text-blue-300 inline-flex items-center gap-1'>
                                    View Resource
                                </a>
                            )}
                        </div>
                        <div>
                            {role === "student" ? (
                                isSubmittedByStudent ? (
                                    <div className='flex items-center gap-1.5 text-green-400 text-xs font-medium bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full'>
                                        ALREADY Submitted
                                    </div>
                                ) : (
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        className='border-white/20 text-white/80 hover:bg-white/10 bg-transparent text-xs h-8'
                                        onClick={() => onOpenWorkspace(assignment.id)}
                                    >
                                        Open Assignment
                                    </Button>
                                )
                            ) : (
                                <span className='text-xs text-white/40 hover:text-white/60 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform' onClick={() => onOpenWorkspace(assignment.id)}>
                                    Manage submissions &rarr;
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}