"use client"
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Trash2, ClipboardList, FileQuestion, Check, ArrowLeft } from 'lucide-react'

interface QuestionForm {
    id: string
    question: string
    marks: number
    options: string[]
    correctOptionIndex: number | null
}

const CreateQuizPage = () => {
    const params = useParams()
    const router = useRouter()
    const classroomId = params.id

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [questions, setQuestions] = useState<QuestionForm[]>([
        { id: crypto.randomUUID(), question: "", marks: 1, options: ["", "", "", ""], correctOptionIndex: null }
    ])
    const [submitting, setSubmitting] = useState(false)

    const addQuestion = () => {
        setQuestions(prev => [
            ...prev,
            { id: crypto.randomUUID(), question: "", marks: 1, options: ["", "", "", ""], correctOptionIndex: null }
        ])
    }

    const removeQuestion = (id: string) => {
        if (questions.length === 1) {
            toast.error("Quiz needs at least one question")
            return
        }
        setQuestions(prev => prev.filter(q => q.id !== id))
    }

    const updateQuestion = (id: string, field: "question" | "marks", value: string | number) => {
        setQuestions(prev =>
            prev.map(q => q.id === id ? { ...q, [field]: value } : q)
        )
    }

    const updateOption = (questionId: string, optionIndex: number, value: string) => {
        setQuestions(prev =>
            prev.map(q => {
                if (q.id !== questionId) {
                    return q
                }
                const newOptions = [...q.options]
                newOptions[optionIndex] = value
                return { ...q, options: newOptions }
            })
        )
    }

    const setCorrectOption = (questionId: string, optionIndex: number) => {
        setQuestions(prev =>
            prev.map(q => q.id === questionId ? { ...q, correctOptionIndex: optionIndex } : q)
        )
    }

    const totalMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0)

    const handleSubmit = async () => {
        if (!title.trim()) {
            toast.error("Title is required")
            return
        }
        if (questions.some(q => !q.question.trim())) {
            toast.error("All questions need text")
            return
        }
        if (questions.some(q => !q.marks || q.marks < 1)) {
            toast.error("Every question needs marks (at least 1)")
            return
        }
        if (questions.some(q => q.options.some(o => !o.trim()))) {
            toast.error("Fill in all 4 options for every question")
            return
        }
        if (questions.some(q => q.correctOptionIndex === null)) {
            toast.error("Mark the correct answer for every question")
            return
        }

        setSubmitting(true)
        try {
            const res = await fetch(`/api/quiz/${classroomId}/createquiz`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, questions })
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.message || "Failed to create quiz")
                return
            }
            toast.success("Quiz created")
            router.push(`/dashboard/classroom/${classroomId}/quiz`)
        } catch (err) {
            toast.error("Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className='py-4 px-2 sm:px-4 w-[98%] pb-24'>
            <div className='mb-6'>
                <button
                    onClick={() => router.push(`/dashboard/classroom/${classroomId}/quiz`)}
                    className='flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors mb-4'
                >
                    <ArrowLeft className='w-4 h-4' />
                    Back to quizzes
                </button>
                <h1 className='text-2xl font-bold text-white'>Create quiz</h1>
                <p className='text-sm text-white/50 mt-1'>Build a quiz for your students</p>
            </div>



            <div className='rounded-xl bg-white/5 border border-white/10 p-5 mb-6'>
                <div className='flex items-center gap-2 mb-5'>
                    <ClipboardList className='w-4 h-4 text-sky-400' />
                    <h2 className='text-sm font-semibold text-white'>Quiz information</h2>
                </div>

                <div className='mb-4'>
                    <label className='text-xs text-white/50 mb-1.5 block'>Quiz title</label>
                    <input
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Chapter 1'
                        className='w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-sky-500/50 transition-colors'
                    />
                </div>

                <div>
                    <label className='text-xs text-white/50 mb-1.5 block'>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='What this quiz covers'
                        rows={3}
                        className='w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-sky-500/50 transition-colors resize-none'
                    />
                </div>
            </div>


            <div className='rounded-xl bg-white/5 border border-white/10 p-5 mb-6'>
                <div className='flex items-center justify-between mb-5'>
                    <div className='flex items-center gap-2'>
                        <FileQuestion className='w-4 h-4 text-sky-400' />
                        <h2 className='text-sm font-semibold text-white'>Questions</h2>
                        <span className='text-xs text-white/40'>· {totalMarks} marks total</span>
                    </div>
                    <Button size='sm' onClick={addQuestion} className='h-8 text-xs gap-1'>
                        <Plus className='w-3.5 h-3.5' />
                        Add question
                    </Button>
                </div>

                <div className='space-y-4'>
                    {questions.map((q, index) => (
                        <div key={q.id} className='rounded-lg bg-white/[0.03] border border-white/10 p-4'>
                            <div className='flex items-start gap-3'>
                                <div className='shrink-0 w-6 h-6 rounded-full bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-xs text-sky-400 font-medium mt-0.5'>
                                    {index + 1}
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center justify-between mb-3'>
                                        <label className='text-xs text-white/50'>Question</label>
                                        <button
                                            onClick={() => removeQuestion(q.id)}
                                            className='text-white/30 hover:text-red-400 transition-colors p-1'
                                        >
                                            <Trash2 className='w-4 h-4' />
                                        </button>
                                    </div>

                                    <textarea
                                        value={q.question}
                                        onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                                        placeholder='Enter your question'
                                        rows={2}
                                        className='w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-sky-500/50 transition-colors resize-none mb-3'
                                    />

                                    <div className='mb-3 space-y-2'>
                                        {[0, 1, 2, 3].map((optIndex) => (
                                            <div key={optIndex} className='flex items-center gap-2'>
                                                <button
                                                    onClick={() => setCorrectOption(q.id, optIndex)}
                                                    className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${q.correctOptionIndex === optIndex
                                                        ? "bg-green-500/20 border-green-500 text-green-400"
                                                        : "border-white/20 text-transparent hover:border-white/40"
                                                        }`}
                                                >
                                                    <Check className='w-3 h-3' />
                                                </button>
                                                <span className='text-xs text-white/40 w-4'>{String.fromCharCode(65 + optIndex)}</span>
                                                <input
                                                    type='text'
                                                    value={q.options[optIndex] || ""}
                                                    onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                                                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                                    className='flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-sky-500/50 transition-colors'
                                                />
                                            </div>
                                        ))}
                                        {q.correctOptionIndex === null && (
                                            <p className='text-xs text-amber-400/70 pl-7'>Select the correct answer</p>
                                        )}
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <label className='text-xs text-white/50'>Marks</label>
                                        <input
                                            type='number'
                                            min={1}
                                            value={q.marks}
                                            onChange={(e) => updateQuestion(q.id, "marks", Number(e.target.value))}
                                            className='w-16 rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white outline-none focus:border-sky-500/50 transition-colors'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex justify-end gap-3'>
                <Button variant='ghost' onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={submitting} className='gap-2'>
                    {submitting && <Loader2 className='size-4 animate-spin' />}
                    Create quiz
                </Button>
            </div>
        </div>
    )
}

export default CreateQuizPage