"use client"
import React, { useState } from 'react'
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

interface QuizDetailClientProps {
    classroomId: string
    initialRole: string
    initialQuiz: Quiz
    initialSubmission: Submission | null
}

const QuizDetailClient = ({ classroomId, initialRole, initialQuiz, initialSubmission }: QuizDetailClientProps) => {
    const params = useParams()
    const router = useRouter()
    const quizId = params.quizId

    const [role] = useState<string>(initialRole)
    const [quiz] = useState<Quiz | null>(initialQuiz)
    const [submission] = useState<Submission | null>(initialSubmission)
    const [deleting, setDeleting] = useState(false)

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

    if (!quiz) {
        return <p className='text-center text-white/50 py-12'>Quiz not found.</p>
    }

    const totalMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0)

    return (
        <div className='w-full min-h-screen py-6 px-3 sm:px-6 lg:px-10 xl:px-14 pb-24 text-zinc-100 selection:bg-sky-500/30 selection:text-sky-200'>
            <button
                onClick={() => router.push(`/dashboard/classroom/${classroomId}/quiz`)}
                className='inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-all mb-6 group cursor-pointer'
            >
                <ArrowLeft className='w-3.5 h-3.5 transition-transform group-hover:-translate-x-1' />
                Back to quizzes
            </button>

            <div className='flex items-start justify-between gap-4 flex-col sm:flex-row mb-6 w-full'>
                <div>
                    <h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-white'>{quiz.title}</h1>
                    <p className='text-xs sm:text-sm text-zinc-400 mt-1'>{quiz.description}</p>
                    <p className='text-xs text-zinc-500 mt-2 font-medium'>{quiz.questions.length} questions · {totalMarks} marks total</p>
                </div>

                {role === "teacher" && (
                    <Button
                        variant='destructive'
                        size='sm'
                        onClick={handleDelete}
                        disabled={deleting}
                        className='gap-1.5 shrink-0 h-9 px-4 text-xs font-medium cursor-pointer shadow-none'
                    >
                        {deleting ? <Loader2 className='w-3.5 h-3.5 animate-spin' /> : <Trash2 className='w-3.5 h-3.5' />}
                        Delete quiz
                    </Button>
                )}
            </div>

            {role === "teacher" && (
                <div className='w-full rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md p-4 sm:p-6 mb-6 shadow-xl'>
                    <div className='flex items-center justify-between gap-4'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0'>
                                <Users className='w-5 h-5' />
                            </div>
                            <div>
                                <h2 className='text-base font-bold tracking-tight text-white'>Submissions</h2>
                                <p className='text-xs text-zinc-400'>Track student participation and results</p>
                            </div>
                        </div>
                        <Button
                            size='sm'
                            className='bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs h-9 px-4 cursor-pointer shadow-lg shadow-sky-600/20'
                            onClick={() => router.push(`/dashboard/classroom/${classroomId}/quiz/${quizId}/results`)}
                        >
                            View results
                        </Button>
                    </div>
                </div>
            )}

            {role === "student" && (
                <div className='w-full rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md p-4 sm:p-6 mb-6 shadow-xl flex items-center justify-between gap-4 flex-col sm:flex-row'>
                    <div>
                        {submission ? (
                            <p className='text-sm text-zinc-200'>
                                You scored <span className='font-semibold text-emerald-400'>{submission.marks} / {totalMarks}</span>
                            </p>
                        ) : (
                            <p className='text-sm text-zinc-400'>You haven't attempted this quiz yet.</p>
                        )}
                    </div>
                    <Button
                        size='sm'
                        className='bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs h-9 px-4 cursor-pointer shadow-lg shadow-sky-600/20 w-full sm:w-auto'
                        onClick={() => router.push(`/dashboard/classroom/${classroomId}/quiz/${quizId}/attempt`)}
                    >
                        {submission ? "View answers" : "Start quiz"}
                    </Button>
                </div>
            )}

            {role === "teacher" && (
                <div className='w-full rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md p-4 sm:p-7 shadow-xl'>
                    <div className='flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800/80'>
                        <div className='p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0'>
                            <FileQuestion className='w-5 h-5' />
                        </div>
                        <div>
                            <h2 className='text-base font-bold tracking-tight text-white'>Questions Overview</h2>
                            <p className='text-xs text-zinc-400'>Review all questions and answer keys</p>
                        </div>
                    </div>
                    
                    <div className='space-y-4 w-full'>
                        {quiz.questions.map((q, index) => (
                            <div key={q.id} className='rounded-xl bg-zinc-900/70 border border-zinc-800/80 p-4 sm:p-5 w-full'>
                                <div className='flex items-start gap-3.5 w-full'>
                                    <div className='shrink-0 w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-semibold mt-0.5'>
                                        {index + 1}
                                    </div>
                                    <div className='flex-1 min-w-0 w-full'>
                                        <div className='flex items-center justify-between gap-2 mb-1'>
                                            <p className='text-sm font-medium text-white'>{q.question}</p>
                                            <span className='text-xs text-sky-400 font-medium bg-sky-500/10 border border-sky-500/20 rounded-md px-2 py-0.5 shrink-0'>
                                                {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
                                            </span>
                                        </div>
                                        
                                        <div className='space-y-2 mt-3 w-full'>
                                            {q.options.map((opt, optIndex) => (
                                                <div
                                                    key={optIndex}
                                                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm border transition-all w-full ${
                                                        optIndex === q.correctOptionIndex
                                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium'
                                                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                                                    }`}
                                                >
                                                    <span className='text-xs font-semibold text-zinc-500 w-4 shrink-0 text-center'>
                                                        {String.fromCharCode(65 + optIndex)}
                                                    </span>
                                                    <span className='min-w-0 flex-1'>{opt}</span>
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

export default QuizDetailClient