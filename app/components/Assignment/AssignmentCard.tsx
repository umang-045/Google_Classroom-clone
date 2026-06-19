"use client"

import React from 'react'
import { Button } from '@/components/ui/button'

interface Assignment {
    id: number
    title: string
    description: string
    due_at: string
    fileUrl?: string
    submitted?: boolean
}

interface AssignmentCardProps {
    assignment: Assignment
    role: string
    isSubmittedByStudent: boolean
    onOpenWorkspace: (id: number) => void
}

export const AssignmentCard = ({ assignment, role, isSubmittedByStudent, onOpenWorkspace }: AssignmentCardProps) => {
    return (
        <div onClick={() => onOpenWorkspace(assignment.id)} className="w-full rounded-xl bg-white/10 border border-white/15 text-white p-6 shadow-sm cursor-pointer hover:bg-white/15 transition-all duration-200 group layout-card">
            <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0 flex-1'>
                    <h3 className='text-base font-semibold text-white group-hover:font-bold transition-colors line-clamp-1'>
                        {assignment.title}
                    </h3>
                    <p className='mt-1 text-sm text-white/60 line-clamp-2'>
                        {assignment.description}
                    </p>
                </div>
                <span className='text-xs text-white/50 whitespace-nowrap mt-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/5'>
                    Due: {new Date(assignment.due_at).toLocaleDateString()}
                </span>
            </div>

            <div className='mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-4' onClick={e => e.stopPropagation()} >
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
                            </div>) : (
                            <Button
                                variant='outline'
                                size='sm'
                                className='border-white/20 text-white/80 hover:bg-white/10 bg-transparent text-xs h-8'
                                onClick={() => onOpenWorkspace(assignment.id)}> Open Assignment
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
    )
}