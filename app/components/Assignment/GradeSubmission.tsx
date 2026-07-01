import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import toast from 'react-hot-toast'

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
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50' onClick={() => setGradeBox(false)}>
            <Card className='w-full max-w-lg bg-white' onClick={(e) => e.stopPropagation()}>
                <CardHeader>
                    <CardTitle className='font-semibold'>
                        Grade Submission
                    </CardTitle>
                    <CardDescription>
                        Give marks and feedback for {submission.studentName}.
                    </CardDescription>
                </CardHeader>

                <CardContent className='space-y-4'>
                    <div className='w-full space-y-2'>
                        <Label htmlFor='marks' className='gap-1'>
                            Marks (out of 100) <span className='text-destructive'>*</span>
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
                        />
                    </div>

                    <div className='w-full space-y-2'>
                        <Label htmlFor='feedback' className='gap-1'>
                            Feedback
                        </Label>
                        <textarea
                            id='feedback'
                            placeholder='Write feedback for this student...'
                            rows={4}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className='border-input flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none resize-none focus-visible:ring-1 focus-visible:ring-ring'
                        />
                    </div>
                </CardContent>

                <CardContent className='flex justify-end gap-2 max-sm:justify-center'>
                    <Button className='max-sm:flex-1' variant='outline' onClick={() => setGradeBox(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button className='max-sm:flex-1' type='button' onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : "Save Grade"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}