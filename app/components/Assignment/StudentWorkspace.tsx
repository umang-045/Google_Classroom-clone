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
}

export const StudentWorkspace = ({ classroomId, assignmentId, isSubmitted, setIsSubmitted, onSuccess }: StudentWorkspaceProps) => {
    const [file, setFile] = useState<File | null>(null)
    const [fileKey, setFileKey] = useState(0)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [submitError, setSubmitError] = useState("")
    const [submitSuccess, setSubmitSuccess] = useState("")

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
        <div className='w-full flex justify-center py-6 px-4 md:px-12 lg:px-24'>
            <div className='w-full max-w-xl'>
                <Card className='bg-white/5 border-white/10 text-white shadow-xl'>
                    <CardHeader className='py-4'>
                        <CardTitle className='text-md text-white'>Your Work</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4 pb-5'>
                        {isSubmitted ? (
                            <div className='rounded-md bg-green-500/10 border border-green-500/20 p-4 text-center'>
                                <p className='text-green-400 font-medium text-xs flex items-center justify-center gap-1.5'>
                                    ✓ ALREADY Submitted Successfully
                                </p>
                                <p className='text-[11px] text-white/50 mt-1'>Your file configuration dashboard has updated.</p>
                            </div>
                        ) : (
                            <div className='space-y-4'>
                                <div className='space-y-1.5'>
                                    <Label htmlFor='submit-file' className='text-xs text-white/80'>File attachment *</Label>
                                    <Input
                                        key={fileKey}
                                        id='submit-file'
                                        type='file'
                                        className='bg-transparent text-white border-white/20 text-xs p-1 h-auto file:bg-white/10 file:text-white file:border-0 file:py-1 file:px-2 file:rounded-sm file:mr-2 file:text-xs cursor-pointer'
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
        </div>
    )
}