"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AlertCircle, FileText, Lock, UploadCloud, CheckCircle2, Clock } from 'lucide-react'
import RequestReuploadModal from './RequestReuploadModal'

interface StudentWorkspaceProps {
    classroomId: number
    assignmentId: number
    isSubmitted: boolean
    setIsSubmitted: (val: boolean) => void
    onSuccess: () => void
    marks: number | null
    feedback: string | null
    submissionFileUrl: string | null
    due_at: string
    canReupload?: boolean
    reuploadDeadline?: string | null
}

export const StudentWorkspace = ({ 
    classroomId, 
    assignmentId, 
    isSubmitted, 
    setIsSubmitted, 
    onSuccess, 
    marks, 
    feedback, 
    submissionFileUrl,
    due_at,
    canReupload = false,
    reuploadDeadline = null
}: StudentWorkspaceProps) => {
    const [file, setFile] = useState<File | null>(null)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [submitError, setSubmitError] = useState("")
    const [submitSuccess, setSubmitSuccess] = useState("")
    const [showRequestModal, setShowRequestModal] = useState(false)

    const isGraded = marks !== null

    const isPastOriginalDeadline = due_at ? new Date(due_at) < new Date() : false
    const isPastExtendedDeadline = reuploadDeadline ? new Date(reuploadDeadline) < new Date() : false

    const isPastDeadline = canReupload
        ? (reuploadDeadline ? isPastExtendedDeadline : false)
        : isPastOriginalDeadline

    const handleStudentSubmit = async () => {
        setSubmitError("")
        setSubmitSuccess("")

        if (isSubmitted) return
        if (isPastDeadline) {
            setSubmitError(
                canReupload
                    ? "Your extended deadline has passed. Please request another extension."
                    : "Due date has passed. Direct submission is not allowed."
            )
            return
        }
        if (!file) { 
            setSubmitError("Please attach a file before submitting.")
            return 
        }

        try {
            setSubmitLoading(true)
            const formData = new FormData()
            formData.append("file", file)

            const uploadRes = await fetch("/api/fileupload", { method: "POST", body: formData })
            const uploadData = await uploadRes.json()
            if (!uploadRes.ok) throw new Error(uploadData.message || "Upload failed")

            const fileUrl: string = uploadData.result.secure_url

            const res = await fetch(`/api/assignments/${classroomId}/submission`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileUrl, assignmentId }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Submission failed")

            setIsSubmitted(true)
            setSubmitSuccess("Submitted successfully!")
            setFile(null)
            onSuccess()
        } catch (err: any) {
            setSubmitError(err.message || "Something went wrong")
        } finally {
            setSubmitLoading(false)
        }
    }

    return (
        <div className='w-full py-6'>
            <Card className='w-full bg-zinc-900/90 border-blue-500/20 text-white shadow-2xl backdrop-blur-md overflow-hidden'>
                <CardHeader className='py-4 px-6 border-b border-white/10 flex flex-row items-center justify-between'>
                    <CardTitle className='text-base font-semibold tracking-wide text-white flex items-center gap-2'>
                        <FileText className='w-4 h-4 text-blue-400' />
                        Your Work
                    </CardTitle>
                    
                    {(isSubmitted || (isPastDeadline && !canReupload)) && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowRequestModal(true)}
                            className="text-xs h-8 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all font-medium"
                        >
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                            {isSubmitted ? "Request Resubmission" : "Request Extension"}
                        </Button>
                    )}
                </CardHeader>

                <CardContent className='p-6 space-y-5'>
                    {canReupload && !isSubmitted && (
                        <div className='flex items-center gap-2 p-3 rounded-md bg-green-500/10 border border-green-500/30 text-green-400 text-xs'>
                            <CheckCircle2 className='w-4 h-4 shrink-0' />
                            <span>
                                Your teacher approved your re-upload request
                                {reuploadDeadline ? ` , submit by ${new Date(reuploadDeadline).toLocaleString()}.` : ". You can submit now."}
                            </span>
                        </div>
                    )}

                    {isSubmitted ? (
                        <div className='space-y-5'>
                            <div className='flex items-center justify-between p-4 rounded-lg bg-blue-500/10 border border-blue-500/20'>
                                <div className='flex items-center gap-2.5'>
                                    <CheckCircle2 className='w-5 h-5 text-blue-400' />
                                    <span className='text-sm font-medium text-blue-400'>Submitted</span>
                                </div>
                                {submissionFileUrl && (
                                    <a 
                                        href={submissionFileUrl} 
                                        target='_blank' 
                                        rel='noopener noreferrer' 
                                        className='text-xs text-blue-400 hover:text-blue-300 underline font-medium'
                                    >
                                        View Attachment
                                    </a>
                                )}
                            </div>

                            <div className='border-t border-white/10 pt-4 space-y-3'>
                                <p className='text-xs font-semibold uppercase tracking-wider text-white/50'>Grade & Feedback</p>
                                {isGraded ? (
                                    <div className='space-y-2 bg-white/5 p-4 rounded-lg border border-white/5'>
                                        <div className='flex items-center justify-between'>
                                            <span className='text-xs text-white/60'>Score:</span>
                                            <span className='text-sm font-bold text-blue-400'>{marks} / 100</span>
                                        </div>
                                        <div className='border-t border-white/5 pt-2'>
                                            <span className='text-xs text-white/60 block mb-1'>Feedback:</span>
                                            <p className='text-xs text-white/90 whitespace-pre-wrap leading-relaxed'>{feedback || "No feedback provided."}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className='text-xs text-white/40 italic bg-white/5 p-3 rounded text-center'>Not graded yet.</p>
                                )}
                            </div>
                        </div>
                    ) : isPastDeadline ? (
                        <div className="py-8 space-y-4 text-center border border-blue-500/20 rounded-xl bg-blue-950/20 p-6">
                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 w-fit mx-auto">
                                <Lock className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-base font-semibold text-white">
                                    {canReupload ? "Extended Deadline Passed" : "Assignment Deadline Passed"}
                                </h4>
                                <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
                                    {canReupload
                                        ? "The extended deadline your teacher set has passed. Request another extension to submit late work."
                                        : "Direct uploads are locked because the due date has passed. Request a deadline extension from your teacher to submit late work."}
                                </p>
                            </div>
                            <Button
                                onClick={() => setShowRequestModal(true)}
                                className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-10 px-6 font-semibold rounded-lg shadow-lg shadow-blue-600/20 transition-all mt-2"
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                Request Submission Extension
                            </Button>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            <div className='space-y-2'>
                                <Label className='text-xs font-medium text-white/80'>Attach Assignment File *</Label>
                                
                                <div className="relative border-2 border-dashed border-white/20 hover:border-blue-500/50 rounded-xl p-8 text-center bg-white/5 hover:bg-white/[0.07] transition-all cursor-pointer group">
                                    <input
                                        id='submit-file'
                                        type='file'
                                        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
                                        onChange={(e) => {
                                            setFile(e.target.files?.[0] || null)
                                            setSubmitError("")
                                        }}
                                    />
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <div className="p-3 rounded-full bg-white/10 group-hover:bg-blue-500/20 text-white/70 group-hover:text-blue-400 transition-colors">
                                            <UploadCloud className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-white">
                                                {file ? file.name : "Click to select or drop a file"}
                                            </p>
                                            <p className="text-[10px] text-white/40">PDF, JPG, PNG, DOCX up to 10MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {submitError && (
                                <div className="flex items-center gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{submitError}</span>
                                </div>
                            )}

                            {submitSuccess && (
                                <div className="flex items-center gap-2 p-3 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span>{submitSuccess}</span>
                                </div>
                            )}

                            <Button
                                onClick={handleStudentSubmit}
                                disabled={submitLoading || !file}
                                className='w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 text-white text-xs h-10 font-semibold rounded-lg shadow-lg shadow-blue-600/20 transition-all'
                            >
                                {submitLoading ? "Uploading & Turning In..." : "Turn In"}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {showRequestModal && (
                <RequestReuploadModal
                    classroomId={classroomId}
                    assignmentId={assignmentId}
                    onClose={() => setShowRequestModal(false)}
                    onSuccess={() => onSuccess()}
                />
            )}
        </div>
    )
}