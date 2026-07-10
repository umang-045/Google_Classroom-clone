"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface StudentWorkspaceProps {
    classroomId: number
    assignmentId: number
    isSubmitted: boolean
    setIsSubmitted: (val: boolean) => void
    onSuccess: () => void
    marks: number | null
    feedback: string | null
    submissionFileUrl: string | null
}

export const StudentWorkspace = ({ classroomId, assignmentId, isSubmitted, setIsSubmitted, onSuccess, marks, feedback, submissionFileUrl }: StudentWorkspaceProps) => {
    const [file, setFile] = useState<File | null>(null)
    const [fileKey, setFileKey] = useState(0)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [submitError, setSubmitError] = useState("")
    const [submitSuccess, setSubmitSuccess] = useState("")

    const isGraded = marks !== null

    const handleStudentSubmit = async () => {
        setSubmitError("")
        setSubmitSuccess("")

        if (isSubmitted) return
        if (!file) { setSubmitError("Please select a file"); return }

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
            setSubmitSuccess("Assignment submitted successfully!")
            setFile(null)
            setFileKey(prev => prev + 1)
            onSuccess()
        } catch (err: any) {
            setSubmitError(err.message || "Something went wrong")
        } finally {
            setSubmitLoading(false)
        }
    }

    return (
        <div className='w-full py-4 px-2 sm:px-4 md:py-6 md:px-12 lg:px-0'>
            <Card className='w-full bg-white/5 border-white/10 text-white shadow-xl'>
                <CardHeader className='py-4 px-4 sm:px-6'>
                    <CardTitle className='text-sm sm:text-md text-white'>Your Work</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4 pb-5 px-4 sm:px-6'>
                    {isSubmitted ? (
                        <div className='space-y-4'>
                            <div className='flex flex-wrap items-center justify-between gap-2'>
                                <p className='text-sm sm:text-base font-medium text-green-400'>Submitted</p>
                                {submissionFileUrl && (
                                    <a href={submissionFileUrl} target='_blank' rel='noopener noreferrer' className='text-xs text-blue-400 hover:text-blue-300 underline break-all'>
                                        View Submitted File
                                    </a>
                                )}
                            </div>
                            <div className='border-t border-white/10 pt-4 space-y-3'>
                                <p className='text-sm sm:text-base font-medium text-white'>Grade</p>

                                {isGraded ? (
                                    <div className='space-y-2'>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-xs sm:text-sm text-white/50'>Marks:</span>
                                            <span className='text-xs sm:text-sm text-white'>{marks} / 100</span>
                                        </div>
                                        <div className='flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2'>
                                            <span className='text-xs sm:text-sm text-white/50 min-w-[65px]'>Feedback:</span>
                                            <span className='text-xs sm:text-sm text-white whitespace-pre-wrap break-words'>{feedback || "—"}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className='text-xs text-white/40 italic'>Not graded yet.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            <div className='space-y-1.5'>
                                <Label htmlFor='submit-file' className='text-xs text-white/80'>File attachment *</Label>
                                <Input
                                    key={fileKey}
                                    id='submit-file'
                                    type='file'
                                    className='bg-transparent text-white border-white/20 text-xs p-1 h-auto file:bg-white/10 file:text-white file:border-0 file:py-1 file:px-2 file:rounded-sm file:mr-2 file:text-xs cursor-pointer w-full block'
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                            </div>
                            {submitError && <p className='text-destructive text-[11px] font-medium'>{submitError}</p>}
                            {submitSuccess && <p className='text-green-400 text-[11px] font-medium'>{submitSuccess}</p>}
                            <Button
                                onClick={handleStudentSubmit}
                                disabled={submitLoading}
                                className='w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 font-medium transition-colors'
                            >
                                {submitLoading ? "Submitting File Data..." : "Turn In"}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}