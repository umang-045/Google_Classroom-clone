"use client"

import React, { useState } from 'react'
import GradeSubmission from './GradeSubmission'

interface Submission {
    id: number | string
    studentName: string
    studentId: number
    studentEmail: string
    fileUrl: string | null
    submittedAt: string | null
    hasSubmitted: boolean
    marks: number | null
    feedback: string | null
}

interface TeacherWorkspaceProps {
    submissions: Submission[]
    classroomId: number
    assignmentId: number
    onGraded: () => void
}

export const TeacherWorkspace = ({ submissions, classroomId, assignmentId, onGraded }: TeacherWorkspaceProps) => {
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

    return (
        <>
           
            <div className='w-full overflow-x-auto hidden md:block'>
                <table className='w-full text-sm border-collapse'>
                    <thead>
                        <tr className='border-b border-white/5'>
                            <th className='text-left p-4 text-xs font-semibold text-white/40 tracking-wider'>Student Details</th>
                            <th className='text-center p-4 text-xs font-semibold text-white/40 tracking-wider'>Submission Date</th>
                            <th className='text-center p-4 text-xs font-semibold text-white/40 tracking-wider'>Submitted File</th>
                            <th className='text-center p-4 text-xs font-semibold text-white/40 tracking-wider'>Status</th>
                            <th className='text-center p-4 text-xs font-semibold text-white/40 tracking-wider'>Marks</th>
                            <th className='text-center p-4 text-xs font-semibold text-white/40 tracking-wider'>Check Assignment</th>
                        </tr>
                    </thead>

                    <tbody>
                        {submissions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className='text-xs text-white/40 py-8 text-center'>
                                    No student data found.
                                </td>
                            </tr>
                        ) : (
                            submissions.map((sub) => {
                                const hasSubmitted = sub.hasSubmitted !== undefined ? sub.hasSubmitted : !!sub.submittedAt
                                const isGraded = sub.marks !== null

                                return (
                                    <tr key={sub.id} className='hover:bg-white/[0.02] transition-colors'>
                                        <td className='p-4'>
                                            <p className='font-medium text-white truncate max-w-[200px]'>{sub.studentName}</p>
                                            <p className='text-xs text-white/40 truncate max-w-[200px] mt-0.5'>{sub.studentEmail}</p>
                                        </td>

                                        <td className='p-4 text-xs text-center text-white/70'>
                                            {hasSubmitted && sub.submittedAt ? (
                                                new Date(sub.submittedAt).toLocaleString(undefined, {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short'
                                                })
                                            ) : (
                                                <span className="text-white/30 italic">Not submitted</span>
                                            )}
                                        </td>

                                        <td className='p-4 text-center'>
                                            {hasSubmitted && sub.fileUrl ? (
                                                <a href={sub.fileUrl} target='_blank' rel='noopener noreferrer' className='text-xs text-blue-400 hover:text-blue-300 underline'>
                                                    View Submitted File
                                                </a>
                                            ) : (
                                                <span className="text-white/20 text-xs">-</span>
                                            )}
                                        </td>

                                        <td className='p-4 text-center'>
                                            {isGraded ? (
                                                <span className='text-xs px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400'>
                                                    Graded
                                                </span>
                                            ) : hasSubmitted ? (
                                                <span className='text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'>
                                                    Pending
                                                </span>
                                            ) : (
                                                <span className='text-xs px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400'>
                                                    Missing
                                                </span>
                                            )}
                                        </td>

                                        <td className='p-4 text-center'>
                                            <span className='px-2 py-1 bg-white/5 border border-white/10 rounded-md font-mono text-xs text-white/90'>
                                                {isGraded ? sub.marks : "--"}
                                            </span>
                                        </td>

                                        <td className='p-4 text-center'>
                                            {hasSubmitted ? (
                                                <button
                                                    onClick={() => setSelectedSubmission(sub)}
                                                    className={`text-xs cursor-pointer underline ${isGraded ? 'text-red-400/50 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
                                                >
                                                    {isGraded ? "Edit Grade" : "Check Assignment"}
                                                </button>
                                            ) : (
                                                <span className="text-white/20 text-xs">-</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className='w-full space-y-4 block md:hidden px-2'>
                {submissions.length === 0 ? (
                    <p className='text-xs text-white/40 py-8 text-center bg-white/5 border border-white/10 rounded-lg'>
                        No student data found.
                    </p>
                ) : (
                    submissions.map((sub) => {
                        const hasSubmitted = sub.hasSubmitted !== undefined ? sub.hasSubmitted : !!sub.submittedAt
                        const isGraded = sub.marks !== null

                        return (
                            <div key={sub.id} className='bg-white/5 border border-white/10 rounded-lg p-4 space-y-3 text-sm text-white'>
                                <div className='flex items-start justify-between gap-2 border-b border-white/5 pb-2'>
                                    <div className="min-w-0">
                                        <p className='font-semibold text-white truncate'>{sub.studentName}</p>
                                        <p className='text-xs text-white/40 truncate mt-0.5'>{sub.studentEmail}</p>
                                    </div>
                                    <div>
                                        {isGraded ? (
                                            <span className='text-[11px] px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400'>
                                                Graded
                                            </span>
                                        ) : hasSubmitted ? (
                                            <span className='text-[11px] px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'>
                                                Pending
                                            </span>
                                        ) : (
                                            <span className='text-[11px] px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400'>
                                                Missing
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-2 text-xs pt-1'>
                                    <div>
                                        <p className='text-white/40'>Submission Date</p>
                                        <p className='text-white/80 mt-0.5'>
                                            {hasSubmitted && sub.submittedAt ? (
                                                new Date(sub.submittedAt).toLocaleString(undefined, {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short'
                                                })
                                            ) : (
                                                <span className="text-white/30 italic">Not submitted</span>
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className='text-white/40'>Marks Assigned</p>
                                        <p className='mt-1'>
                                            <span className='px-2 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-white/90'>
                                                {isGraded ? sub.marks : "--"}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center justify-between pt-2 border-t border-white/5 gap-2 text-xs'>
                                    <div>
                                        {hasSubmitted && sub.fileUrl ? (
                                            <a href={sub.fileUrl} target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:text-blue-300 underline break-all'>
                                                View File
                                            </a>
                                        ) : (
                                            <span className="text-white/20 italic">No file</span>
                                        )}
                                    </div>
                                    <div>
                                        {hasSubmitted ? (
                                            <button
                                                onClick={() => setSelectedSubmission(sub)}
                                                className={`underline font-medium cursor-pointer ${isGraded ? 'text-red-400/70 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
                                            >
                                                {isGraded ? "Edit Grade" : "Check Assignment"}
                                            </button>
                                        ) : (
                                            <span className="text-white/20">-</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {selectedSubmission && (
                <GradeSubmission
                    classroomId={classroomId}
                    assignmentId={assignmentId}
                    submission={{
                        studentId: selectedSubmission.studentId,
                        studentName: selectedSubmission.studentName,
                        marks: selectedSubmission.marks,
                        feedback: selectedSubmission.feedback
                    }}
                    setGradeBox={(val) => { if (!val) setSelectedSubmission(null) }}
                    onGraded={onGraded}
                />
            )}
        </>
    )
}