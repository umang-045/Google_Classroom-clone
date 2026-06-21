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
            <div className='w-full overflow-x-auto'>
                <table className='w-full text-sm border-collapse'>
                    <thead>
                        <tr className='border-b border-white/5'>
                            <th className='text-left p-4 text-xs font-semibold text-white/40  tracking-wider'>Student Details</th>
                            <th className='text-center p-4 text-xs font-semibold text-white/40  tracking-wider'>Submission Date</th>
                            <th className='text-center p-4 text-xs font-semibold text-white/40  tracking-wider'>Submitted File</th>
                            <th className='text-center p-4 text-xs font-semibold text-white/40  tracking-wider'>Status</th>
                            <th className='text-center p-4 text-xs font-semibold text-white/40  tracking-wider'>Marks</th>
                            <th className='text-center p-4 text-xs font-semibold text-white/40  tracking-wider'>Check Assignment</th>
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
                                            <p className='font-medium text-white truncate'>{sub.studentName}</p>
                                            <p className='text-xs text-white/40 truncate mt-0.5'>{sub.studentEmail}</p>
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