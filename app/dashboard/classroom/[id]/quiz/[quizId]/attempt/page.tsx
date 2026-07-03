"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft, Check } from 'lucide-react'

interface Question {
    id: string
    question: string
    marks: number
    options: string[]
    correctOptionIndex: number 
}

interface Quiz {
    id: number
    title: string
    description: string
    questions: Question[]
}

interface GradedAnswer {
    questionId: string
    selectedOptionIndex: number | null
    isCorrect: boolean
    marksAwarded: number
}

interface Submission {
    id: number
    marks: number
    status: string
    answers: GradedAnswer[]
}

const AttemptQuizPage = () => {
    const params = useParams()
    const router = useRouter()
    const classroomId = params.id
    const quizId = params.quizId

    const [role, setRole] = useState<string>("")
    const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [submission, setSubmission] = useState<Submission | null>(null)
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const fetchRole = async () => {
            const res = await fetch(`/api/classroom/${classroomId}`)
            if (res.ok) {
                const data = await res.json()
                setRole(data.role)
            }
        }
        if (classroomId) fetchRole()
    }, [classroomId])

    useEffect(() => {
        if (role === "teacher") {
            toast.error("Teachers can't attempt quizzes")
            router.push(`/dashboard/classroom/${classroomId}/quiz/${quizId}`)
        }
    }, [role])

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
        if (classroomId && quizId) {
            fetchQuiz()
        }
    }, [classroomId, quizId])

    const selectOption = (questionId: string, optionIndex: number) => {
        if (submission) return
        setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
    }

    const handleSubmit = async () => {
        if (!quiz) return

        const unanswered = quiz.questions.filter(q => selectedAnswers[q.id] === undefined)
        if (unanswered.length > 0) {
            const confirmSubmit = confirm(`You have ${unanswered.length} unanswered question(s). Submit anyway?`)
            if (!confirmSubmit) return
        }

        const answers = quiz.questions.map(q => ({
            questionId: q.id,
            selectedOptionIndex: selectedAnswers[q.id] ?? -1
        }))

        setSubmitting(true)
        try {
            const res = await fetch(`/api/quiz/${classroomId}/${quizId}/submission`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers })
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.message || "Failed to submit")
                return
            }
            toast.success(`Your Quiz is Submitted!`)
            router.push(`/dashboard/classroom/${classroomId}/quiz/${quizId}`)
        } catch (err) {
            toast.error("Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading || !role) {
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
    const answeredCount = Object.keys(selectedAnswers).length

    return (
        <div className='py-4 px-2 sm:px-4 w-[90%] pb-24'>
            <button
                onClick={() => router.push(`/dashboard/classroom/${classroomId}/quiz/${quizId}`)}
                className='flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors mb-4'
            >
                <ArrowLeft className='w-4 h-4' />
                Back to quiz
            </button>

            <div className='mb-6'>
                <h1 className='text-2xl font-bold text-white'>{quiz.title}</h1>
                <p className='text-sm text-white/50 mt-1'>{quiz.description}</p>
                <p className='text-xs text-white/40 mt-2'>{quiz.questions.length} questions · {totalMarks} marks total</p>
            </div>

            {submission && (
                <div className='rounded-xl bg-green-500/10 border border-green-500/30 p-4 mb-6'>
                    <p className='text-sm text-green-400 font-medium'>
                        You've already submitted this quiz. Score: {submission.marks} / {totalMarks}
                    </p>
                </div>
            )}

            <div className='space-y-4'>
                {quiz.questions.map((q, index) => {
                    const gradedAnswer = submission?.answers.find(a => a.questionId === q.id)

                    return (
                        <div key={q.id} className='rounded-xl bg-white/5 border border-white/10 p-5'>
                            <div className='flex items-start gap-3 mb-4'>
                                <div className='shrink-0 w-6 h-6 rounded-full bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-xs text-sky-400 font-medium mt-0.5'>
                                    {index + 1}
                                </div>
                                <div className='flex-1'>
                                    <p className='text-sm text-white'>{q.question}</p>
                                    <p className='text-xs text-white/40 mt-1'>{q.marks} marks</p>
                                </div>
                            </div>

                            <div className='space-y-2 pl-9'>
                                {q.options.map((opt, optIndex) => {
                                    const isSelected = submission
                                        ? gradedAnswer?.selectedOptionIndex === optIndex
                                        : selectedAnswers[q.id] === optIndex

                                    let stateClasses = "border-white/10 hover:border-white/30"
                                    
                                    if (submission && gradedAnswer) {
                                       
                                        if (optIndex === q.correctOptionIndex) {
                                            stateClasses = "border-green-500 bg-green-500/10 text-green-400"
                                        }
                                       
                                        else if (optIndex === gradedAnswer.selectedOptionIndex && !gradedAnswer.isCorrect) {
                                            stateClasses = "border-red-500 bg-red-500/10 text-red-400"
                                        }
                                    } else if (isSelected) {
                                        stateClasses = "border-sky-500 bg-sky-500/10"
                                    }

                                    return (
                                        <button
                                            key={optIndex}
                                            onClick={() => selectOption(q.id, optIndex)}
                                            disabled={!!submission}
                                            className={`w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm text-left transition-colors ${stateClasses} ${submission ? 'cursor-default' : 'cursor-pointer'}`}
                                        >
                                            <span className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-current' : 'border-white/20 text-transparent'}`}>
                                                {isSelected && <Check className='w-3 h-3' />}
                                            </span>
                                            <span className='text-white/40 text-xs'>{String.fromCharCode(65 + optIndex)}</span>
                                            <span className='text-white/80'>{opt}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            {submission && gradedAnswer && (
                                <p className={`text-xs mt-3 pl-9 ${gradedAnswer.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                    {gradedAnswer.isCorrect ? `Correct · +${gradedAnswer.marksAwarded} marks` : 'Incorrect · 0 marks'}
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>

            {!submission && (
                <div className='flex items-center justify-between mt-6'>
                    <p className='text-xs text-white/40'>{answeredCount} of {quiz.questions.length} answered</p>
                    <Button onClick={handleSubmit} disabled={submitting} className='gap-2'>
                        {submitting && <Loader2 className='size-4 animate-spin' />}
                        Submit quiz
                    </Button>
                </div>
            )}
        </div>
    )
}

export default AttemptQuizPage