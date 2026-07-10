"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { CheckSquare, X } from 'lucide-react'

interface SubmissionData {
    studentId: number
    studentName: string
    marks: number | null
    feedback: string | null
}

interface GradeSubmissionProps {
    classroomId: number
    assignmentId: number
    submission: SubmissionData
    setGradeBox: (val: boolean) => void
    onGraded: () => void
}

export default function GradeSubmission({ classroomId, assignmentId, submission, setGradeBox, onGraded }: GradeSubmissionProps) {
    const [marks, setMarks] = useState(submission.marks !== null ? String(submission.marks) : "")
    const [feedback, setFeedback] = useState(submission.feedback ?? "")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!marks) {
            toast.error("Marks is required.")
            return
        }
        const givenMarks = Number(marks)
        if (givenMarks < 0 || givenMarks > 100) {
            toast.error("Marks must be between 0 and 100.")
            return
        }

        setLoading(true)

        const res = await fetch(`/api/assignments/${classroomId}/${assignmentId}/grade`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                studentId: submission.studentId,
                marks: Number(marks),
                feedback,
            }),
        })

        const data = await res.json()

        if (!res.ok) {
            toast.error(data.message || "Something went wrong. Try again.")
            setLoading(false)
            return
        }

        toast.success(`${submission.studentName} has been graded!`)
        setLoading(false)

        setTimeout(() => {
            setGradeBox(false)
            onGraded()
        }, 800)
    }

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-xs'
            onClick={() => setGradeBox(false)}
        >
            <div
                style={{ background: 'linear-gradient(to top, #27272a, #151519)' }}
                className='relative w-full max-w-xl rounded-xl border border-zinc-800/80 p-8 shadow-2xl space-y-7 animate-in fade-in-50 zoom-in-95 duration-150 text-zinc-200'
                onClick={(e) => e.stopPropagation()}
            >
                
                <button
                    onClick={() => setGradeBox(false)}
                    className='absolute top-5 right-5 text-zinc-400 hover:text-red-400 cursor-pointer transition-colors'
                >
                    <X size={20} />
                </button>

              
                <div className='flex items-center gap-4 pl-0.5'>
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800/70 text-sky-400 border border-zinc-700/60 shadow-inner'>
                        <CheckSquare size={22} />
                    </div>
                    <div>
                        <h3 className='font-semibold text-2xl tracking-tight text-white'>
                            Grade Submission
                        </h3>
                        <p className='text-xs text-zinc-400 mt-1'>
                            Give marks and feedback for {submission.studentName}.
                        </p>
                    </div>
                </div>

               
                <div className='space-y-5'>
                    <div className='w-full space-y-2'>
                        <Label htmlFor='marks' className='text-zinc-300 text-sm font-medium pl-0.5'>
                            Marks (out of 100) <span className='text-rose-500'>*</span>
                        </Label>
                        <Input
                            id='marks'
                            type='number'
                            min={0}
                            max={100}
                            placeholder='e.g. 85'
                            required
                            value={marks}
                            onChange={(e) => setMarks(e.target.value)}
                            className='w-full h-11 rounded-md border-zinc-700 bg-zinc-900/40 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-500'
                        />
                    </div>

                    <div className='w-full space-y-2'>
                        <Label htmlFor='feedback' className='text-zinc-300 text-sm font-medium pl-0.5'>
                            Feedback
                        </Label>
                        <textarea
                            id='feedback'
                            placeholder='Write feedback for this student...'
                            rows={4}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className='flex min-h-[110px] w-full rounded-md border border-zinc-700 bg-zinc-900/40 px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none resize-none focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-500'
                        />
                    </div>
                </div>

               
                <div className='flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/60 max-sm:flex-col-reverse'>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() => setGradeBox(false)}
                        disabled={loading}
                        className='rounded-md px-5 bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white border-0 text-xs h-10 max-sm:w-full'
                    >
                        Cancel
                    </Button>
                    <Button
                        type='button'
                        onClick={handleSubmit}
                        disabled={loading}
                        className='rounded-md cursor-pointer px-5 bg-blue-700 hover:bg-blue-700 text-white font-medium border-0 text-xs h-10 max-sm:w-full'
                    >
                        {loading ? 'Please Wait...' : 'Save Grade'}
                    </Button>
                </div>
            </div>
        </div>
    )
}