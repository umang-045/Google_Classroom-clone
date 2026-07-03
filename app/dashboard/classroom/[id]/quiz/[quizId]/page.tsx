"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft, Trash2, Users, FileQuestion } from 'lucide-react'

interface Question {
    id: string
    question: string
    marks: number
    options: string[]
    correctOptionIndex?: number 
}

interface Quiz {
    id: number
    title: string
    description: string
    created_at: string
    questions: Question[]
}
 
interface Submission {
    id: number
    marks: number
    status: string
}

const QuizDetailPage = () => {
    const params = useParams()
    const router = useRouter()
    const classroomId = params.id
    const quizId = params.quizId

    const [role, setRole] = useState<string>("")
    const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [submission, setSubmission] = useState<Submission | null>(null)
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const fetchRole = async () => {
            const res = await fetch(`/api/classroom/${classroomId}`)
            if (res.ok) {
                const data = await res.json()
                setRole(data.role)
            }
        }
        fetchRole()
    }, [classroomId])

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await fetch(`/api/quiz/${classroomId}/${quizId}`)
                const data = await res.json()
                if (!res.ok) {
                    toast.error(data.message || "Failed to load quiz")
                    return
                }
                setQuiz(data.quizDetail)
                setSubmission(data.submission)
            } catch (err) {
                toast.error("Something went wrong")
            } finally {
                setLoading(false)
            }
        }
        if (classroomId && quizId){ 
            fetchQuiz()
        }
    }, [classroomId, quizId])

    const handleDelete = async () => {
        const confirmDelete = confirm("Delete this quiz? This also removes all student submissions. This cannot be undone.")
        if (!confirmDelete) return

        setDeleting(true)
        try {
            const res = await fetch(`/api/quiz/${classroomId}/${quizId}`, {
                method: "DELETE"
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.message || "Failed to delete quiz")
                return
            }
            toast.success("Quiz deleted")
            router.push(`/dashboard/classroom/${classroomId}/quiz`)
        } catch (err) {
            toast.error("Something went wrong")
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[75vh]">
                <Loader2 className="size-6 animate-spin text-gray-400" />
            </div>
        )
    }

    if (!quiz) {
        return <p className='text-center text-white/50 py-12'>Quiz not found.</p>
    }

    const totalMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0)

    return (
        <div className='py-4 px-2 sm:px-4 w-[90%] pb-24'>
            <button
                onClick={() => router.push(`/dashboard/classroom/${classroomId}/quiz`)}
                className='flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors mb-4'
            >
                <ArrowLeft className='w-4 h-4' />
                Back to quizzes
            </button>

            <div className='flex items-start justify-between mb-6'>
                <div>
                    <h1 className='text-2xl font-bold text-white'>{quiz.title}</h1>
                    <p className='text-sm text-white/50 mt-1'>{quiz.description}</p>
                    <p className='text-xs text-white/40 mt-2'>{quiz.questions.length} questions · {totalMarks} marks total</p>
                </div>

                {role === "teacher" && (
                    <Button
                        variant='destructive'
                        size='sm'
                        onClick={handleDelete}
                        disabled={deleting}
                        className='gap-1.5 shrink-0'
                    >
                        {deleting ? <Loader2 className='size-3.5 animate-spin' /> : <Trash2 className='size-3.5' />}
                        Delete quiz
                    </Button>
                )}
            </div>

            {role === "teacher" && (
                <div className='rounded-xl bg-white/5 border border-white/10 p-5 mb-6'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <Users className='w-4 h-4 text-sky-400' />
                            <h2 className='text-sm font-semibold text-white'>Submissions</h2>
                        </div>
                        <Button
                            size='sm'
                            className='h-8 text-xs'
                            onClick={() => router.push(`/dashboard/classroom/${classroomId}/quiz/${quizId}/results`)}
                        >
                            View results
                        </Button>
                    </div>
                </div>
            )}

            {role === "student" && (
                <div className='rounded-xl bg-white/5 border border-white/10 p-5 mb-6 flex items-center justify-between'>
                    <div>
                        {submission ? (
                            <p className='text-sm text-white'>
                                You scored <span className='font-semibold text-green-400'>{submission.marks} / {totalMarks}</span>
                            </p>
                        ) : (
                            <p className='text-sm text-white/70'>You haven't attempted this quiz yet.</p>
                        )}
                    </div>
                    <Button
                        size='sm'
                        onClick={() => router.push(`/dashboard/classroom/${classroomId}/quiz/${quizId}/attempt`)}
                    >
                        {submission ? "View answers" : "Start quiz"}
                    </Button>
                </div>
            )}

            {role === "teacher" && (
                <div className='rounded-xl bg-white/5 border border-white/10 p-5'>
                    <div className='flex items-center gap-2 mb-5'>
                        <FileQuestion className='w-4 h-4 text-sky-400' />
                        <h2 className='text-sm font-semibold text-white'>Questions</h2>
                    </div>
                    <div className='space-y-4'>
                        {quiz.questions.map((q, index) => (
                            <div key={q.id} className='rounded-lg bg-white/[0.03] border border-white/10 p-4'>
                                <div className='flex items-start gap-3'>
                                    <div className='shrink-0 w-6 h-6 rounded-full bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-xs text-sky-400 font-medium mt-0.5'>
                                        {index + 1}
                                    </div>
                                    <div className='flex-1'>
                                        <p className='text-sm text-white mb-1'>{q.question}</p>
                                        <p className='text-xs text-white/40 mb-3'>{q.marks} mark{q.marks > 1 ? 's' : ''}</p>
                                        <div className='space-y-1.5'>
                                            {q.options.map((opt, optIndex) => (
                                                <div
                                                    key={optIndex}
                                                    className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
                                                        optIndex === q.correctOptionIndex
                                                            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                                                            : 'text-white/60'
                                                    }`}
                                                >
                                                    <span className='text-xs text-white/40 w-4'>{String.fromCharCode(65 + optIndex)}</span>
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuizDetailPage