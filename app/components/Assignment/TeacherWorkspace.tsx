"use client"

import React from 'react'

interface Submission {
    id: number | string
    studentName: string
    studentEmail: string
    fileUrl: string | null
    submittedAt: string | null
    hasSubmitted: boolean
}

interface TeacherWorkspaceProps {
    submissions: Submission[]
}

export const TeacherWorkspace = ({ submissions }: TeacherWorkspaceProps) => {
    return (
        <>
            <div className='w-full overflow-x-auto'>
                <div className='min-w-[800px]'>
                    <div className='grid grid-cols-12 p-8 text-xs font-semibold text-white/40 uppercase tracking-wider border-b border-white/5'>
                        <div className='col-span-4'>Student Details</div>
                        <div className='col-span-3'>Submission Date</div>
                        <div className='col-span-2 text-center'>Marks / 100</div>
                        <div className='col-span-2 text-center'>Status</div>
                        <div className='col-span-1 text-right'>Action</div>
                    </div>

                    {submissions.length === 0 ? (<p className='text-xs text-white/40 py-8 text-center'>No student data found.</p>) : (
                        <div className='m-4'>
                            {submissions.map((sub) => {
                                const hasSubmitted = sub.hasSubmitted !== undefined ? sub.hasSubmitted : !!sub.submittedAt

                                return (
                                    <div key={sub.id} className='grid grid-cols-12 gap-4 items-center py-4 text-sm hover:bg-white/[0.02] transition-colors rounded-lg px-2 group'>
                                        <div className='col-span-4 min-w-0'>
                                            <p className='font-medium text-white truncate'>{sub.studentName}</p>
                                            <p className='text-xs text-white/40 truncate mt-0.5'>{sub.studentEmail}</p>
                                        </div>

                                        <div className='col-span-3 text-xs text-white/70'>
                                            {hasSubmitted && sub.submittedAt ? (
                                                new Date(sub.submittedAt).toLocaleString(undefined, {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short'
                                                })) : (
                                                <span className="text-white/30 italic">Not submitted</span>
                                            )}
                                        </div>

                                        <div className='col-span-2 text-center'>
                                            <span className='inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-md font-mono text-xs text-white/90'>
                                                -- / 100
                                            </span>
                                        </div>

                                        <div className='col-span-2 flex justify-center'>
                                            {hasSubmitted ? (
                                                <span className='inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'>
                                                    <span className='w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse' />
                                                    Pending
                                                </span>) : (
                                                <span className='inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400'>
                                                    Missing
                                                </span>
                                            )}
                                        </div>

                                        <div className='col-span-1 text-right'>
                                            {hasSubmitted && sub.fileUrl ?
                                                (<a href={sub.fileUrl} target='_blank' rel='noopener noreferrer' className='inline-flex items-center text-xs text-blue-400 hover:text-blue-300 underline'>
                                                    View File
                                                </a>) : (
                                                    <span className="text-white/20 text-xs">-</span>
                                                )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}