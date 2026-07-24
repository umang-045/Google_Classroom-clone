"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, FileText, UserCheck, X, ExternalLink, Paperclip, User } from 'lucide-react'

interface SubmissionItem {
    id: number
    studentId: number
    studentName: string
    fileUrl: string | null
    marks: number | null
    feedback: string | null
    submittedAt?: string | null
    createdAt?: string | null
}

interface ExtensionRequestItem {
    id: number
    studentName: string
    studentEmail: string
    studentImage?: string | null
    reason?: string
    createdAt: string
}

interface TeacherWorkspaceProps {
    classroomId: number
    assignmentId: number
    submissions: SubmissionItem[]
    requests?: ExtensionRequestItem[]
    onSuccess: () => void
}

export const TeacherWorkspace = ({ 
    classroomId, 
    assignmentId, 
    submissions, 
    requests = [], 
    onSuccess 
}: TeacherWorkspaceProps) => {
    const [selectedSubmission, setSelectedSubmission] = useState<SubmissionItem | null>(null)
    const [marks, setMarks] = useState<string>('')
    const [feedback, setFeedback] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [actionLoading, setActionLoading] = useState<number | null>(null)
    const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({})
    const [extendedDeadlines, setExtendedDeadlines] = useState<Record<number, string>>({})

    const handleImageError = (src: string) => {
        setBrokenImages((prev) => ({ ...prev, [src]: true }))
    }

    const handleRequestAction = async (requestId: number, action: "approve" | "reject") => {
        setActionLoading(requestId)
        try {
            const extended_deadline = extendedDeadlines[requestId]
            const res = await fetch(`/api/assignments/${classroomId}/${assignmentId}/reupload/${requestId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: action === "approve" ? "APPROVED" : "REJECTED",
                    extended_deadline: action === "approve" && extended_deadline ? extended_deadline : undefined,
                }),
            })
            const data = await res.json()
            if (!res.ok) {
                alert(data.message || "Something went wrong")
                return
            }
            onSuccess() 
        } catch (error) {
            alert("Something went wrong handling request")
        } finally {
            setActionLoading(null)
        }
    }

    const formatSubmissionDate = (sub: SubmissionItem) => {
        const dateStr = sub.submittedAt || sub.createdAt
        if (!dateStr) return "N/A"
        
        const parsed = new Date(dateStr)
        if (isNaN(parsed.getTime())) return "N/A"
        
        return parsed.toLocaleString([], {
            dateStyle: 'medium',
            timeStyle: 'short'
        })
    }

    const handleOpenGradeModal = (sub: SubmissionItem) => {
        setSelectedSubmission(sub)
        setMarks(sub.marks !== null ? String(sub.marks) : '')
        setFeedback(sub.feedback || '')
        setError('')
        setSuccess('')
    }

    const handleCloseGradeModal = () => {
        setSelectedSubmission(null)
        setMarks('')
        setFeedback('')
        setError('')
        setSuccess('')
    }

    const handleGradeSubmit = async () => {
        if (!selectedSubmission) return
        setError('')
        setSuccess('')

        const scoreNum = Number(marks)
        if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
            setError('Please enter a valid mark between 0 and 100')
            return
        }

        try {
            setLoading(true)
            const res = await fetch(`/api/assignments/${classroomId}/grade`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submissionId: selectedSubmission.id,
                    marks: scoreNum,
                    feedback,
                }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Failed to submit grade')

            setSuccess('Grade saved successfully!')
            onSuccess()
            setTimeout(() => {
                handleCloseGradeModal()
            }, 1200)
        } catch (err: any) {
            setError(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full py-6 space-y-8">
            {requests.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 bg-zinc-900/90 border border-blue-500/20 rounded-xl p-6 shadow-2xl backdrop-blur-md">
                    <h2 className="text-lg text-white font-bold tracking-tight flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                        Pending Submission / Extension Requests ({requests.length})
                    </h2>
                    <hr className="border-white/10 border-t mt-2 mb-4" />

                    <div className="divide-y divide-white/10">
                        {requests.map((req) => {
                            const imageUrl = req.studentImage
                            const isImageBroken = !imageUrl || brokenImages[imageUrl]

                            return (
                                <div key={req.id} className="flex items-center justify-between gap-4 py-3 border-b border-white/5">
                                    <div className="flex items-center gap-4">
                                        {!isImageBroken ? (
                                            <img
                                                src={imageUrl}
                                                alt={req.studentName}
                                                onError={() => handleImageError(imageUrl)}
                                                className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white font-medium text-sm shrink-0">
                                                <User size={18} className="text-white/70" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-white font-medium">{req.studentName}</p>
                                            <p className="text-xs text-white/40">{req.studentEmail}</p>
                                            {req.reason && (
                                                <p className="text-xs text-blue-300/80 mt-0.5 italic">"{req.reason}"</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <input
                                            type="datetime-local"
                                            value={extendedDeadlines[req.id] || ""}
                                            onChange={(e) =>
                                                setExtendedDeadlines((prev) => ({ ...prev, [req.id]: e.target.value }))
                                            }
                                            title="Optional: set a new deadline for this student only. Leave blank for no deadline."
                                            className="text-[11px] px-2 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/80 focus:outline-none focus:border-blue-500/50"
                                        />
                                        <button
                                            onClick={() => handleRequestAction(req.id, "approve")}
                                            disabled={actionLoading === req.id}
                                            className="text-xs px-3 py-1.5 font-medium rounded-md bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50 cursor-pointer"
                                        >
                                            {actionLoading === req.id ? "..." : "Approve"}
                                        </button>
                                        <button
                                            onClick={() => handleRequestAction(req.id, "reject")}
                                            disabled={actionLoading === req.id}
                                            className="text-xs px-3 py-1.5 font-medium rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 cursor-pointer"
                                        >
                                            {actionLoading === req.id ? "..." : "Reject"}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <Card className="w-full bg-zinc-900/90 border-blue-500/20 text-white shadow-2xl backdrop-blur-md overflow-hidden">
                <CardHeader className="py-4 px-6 border-b border-white/10 flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-blue-400" />
                        Student Submissions ({submissions.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {submissions.length === 0 ? (
                        <div className="py-12 text-center text-white/40 text-xs italic">
                            No submissions received yet for this assignment.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-white/5 border-b border-white/10 text-white/60 uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="py-3 px-6">Student Name</th>
                                        <th className="py-3 px-6">Submitted File</th>
                                        <th className="py-3 px-6">Submitted Date</th>
                                        <th className="py-3 px-6">Status</th>
                                        <th className="py-3 px-6">Score</th>
                                        <th className="py-3 px-6 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {submissions.map((sub) => {
                                        const isGraded = sub.marks !== null

                                        return (
                                            <tr 
                                                key={sub.id} 
                                                className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                                                onClick={() => handleOpenGradeModal(sub)}
                                            >
                                                <td className="py-4 px-6 font-medium text-white flex items-center gap-2">
                                                    <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                                    {sub.studentName}
                                                </td>

                                                <td className="py-4 px-6">
                                                    {sub.fileUrl ? (
                                                        <a
                                                            href={sub.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium underline"
                                                        >
                                                            <Paperclip className="w-3.5 h-3.5" />
                                                            View File
                                                        </a>
                                                    ) : (
                                                        <span className="text-white/30 italic">No file attached</span>
                                                    )}
                                                </td>

                                                <td className="py-4 px-6 text-white/60">
                                                    {formatSubmissionDate(sub)}
                                                </td>

                                                <td className="py-4 px-6">
                                                    {isGraded ? (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Graded
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center text-[11px] font-medium text-white/60 bg-white/10 px-2.5 py-1 rounded-full">
                                                            Needs Grade
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-4 px-6 font-semibold">
                                                    {isGraded ? (
                                                        <span className="text-blue-400">{sub.marks} / 100</span>
                                                    ) : (
                                                        <span className="text-white/30">—</span>
                                                    )}
                                                </td>

                                                <td className="py-4 px-6 text-right">
                                                    <Button
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleOpenGradeModal(sub)
                                                        }}
                                                        className="bg-blue-600/80 hover:bg-blue-500 text-white text-[11px] h-7 px-3 font-medium transition-all"
                                                    >
                                                        {isGraded ? "Edit Grade" : "Grade Work"}
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="w-full max-w-lg bg-zinc-900 border border-blue-500/30 rounded-xl shadow-2xl text-white overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-400" />
                                Grade Submission
                            </h3>
                            <button
                                onClick={handleCloseGradeModal}
                                className="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                <div>
                                    <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Student</p>
                                    <p className="text-xs font-semibold text-white">{selectedSubmission.studentName}</p>
                                </div>
                                {selectedSubmission.fileUrl && (
                                    <a
                                        href={selectedSubmission.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 underline font-medium"
                                    >
                                        View Attachment
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-white/80">Marks (out of 100)</label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 85"
                                    value={marks}
                                    onChange={(e) => setMarks(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white text-xs h-10 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-white/80">Feedback</label>
                                <textarea
                                    placeholder="Write feedback for student..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {success && (
                                <div className="flex items-center gap-2 p-3 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span>{success}</span>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                                <Button
                                    variant="outline"
                                    onClick={handleCloseGradeModal}
                                    className="border-white/10 text-white/80 hover:bg-white/10 bg-transparent text-xs h-9"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleGradeSubmit}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-9 font-semibold px-4"
                                >
                                    {loading ? 'Saving Grade...' : 'Save Grade'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}