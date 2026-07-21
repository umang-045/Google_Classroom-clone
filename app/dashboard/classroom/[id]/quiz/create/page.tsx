"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  Plus,
  Trash2,
  Copy,
  ClipboardList,
  FileQuestion,
  Check,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Award,
  Minus,
  AlertCircle
} from 'lucide-react'

interface QuestionForm {
  id: string
  question: string
  marks: number
  options: string[]
  correctOptionIndex: number | null
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const emptyQuestion = (): QuestionForm => ({
  id: generateId(),
  question: "",
  marks: 1,
  options: ["", "", "", ""],
  correctOptionIndex: null
})

// Auto-growing textarea so long questions/options don't get clipped
const AutoTextarea = ({
  value,
  onChange,
  placeholder,
  className,
  minRows = 2,
  ...rest
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
  minRows?: number
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={minRows}
      className={className}
      {...rest}
    />
  )
}

const CreateQuizPage = () => {
  const params = useParams()
  const router = useRouter()
  const classroomId = params.id

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<QuestionForm[]>([emptyQuestion()])
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)
  const [lastAddedId, setLastAddedId] = useState<string | null>(null)

  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    if (lastAddedId && questionRefs.current[lastAddedId]) {
      questionRefs.current[lastAddedId]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const textarea = questionRefs.current[lastAddedId]?.querySelector('textarea')
      textarea?.focus()
      setLastAddedId(null)
    }
  }, [lastAddedId])

  const addQuestion = () => {
    const q = emptyQuestion()
    setQuestions(prev => [...prev, q])
    setLastAddedId(q.id)
  }

  const duplicateQuestion = (id: string) => {
    setQuestions(prev => {
      const idx = prev.findIndex(q => q.id === id)
      if (idx === -1) return prev
      const copy = { ...prev[idx], id: generateId(), options: [...prev[idx].options] }
      const next = [...prev]
      next.splice(idx + 1, 0, copy)
      return next
    })
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

  const handleMarksChange = (id: string, delta: number) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === id) {
          const newMarks = Math.max(1, (Number(q.marks) || 0) + delta)
          return { ...q, marks: newMarks }
        }
        return q
      })
    )
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== questionId) return q
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
  const isQuestionComplete = (q: QuestionForm) =>
    Boolean(q.question.trim() && q.options.every(o => o.trim()) && q.correctOptionIndex !== null)
  const completedCount = questions.filter(isQuestionComplete).length
  const titleMissing = touched && !title.trim()

  const handleSubmit = async () => {
    setTouched(true)

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
    <div className='w-full min-h-screen py-6 px-3 sm:px-6 lg:px-10 xl:px-14 pb-36 text-zinc-100 selection:bg-sky-500/30 selection:text-sky-200'>
      {/* Top Bar Header */}
      <div className='mb-8 w-full'>
        <button
          onClick={() => router.push(`/dashboard/classroom/${classroomId}/quiz`)}
          className='inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-all mb-6 group cursor-pointer'
        >
          <ArrowLeft className='w-3.5 h-3.5 transition-transform group-hover:-translate-x-1' />
          Back to quizzes
        </button>

        <div className='flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row w-full'>
          <div className='flex items-center gap-3.5 w-full'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-400 shadow-inner shadow-sky-500/10'>
              <FileQuestion className='h-6 w-6' />
            </div>
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-white'>Create Quiz</h1>
              <p className='text-xs sm:text-sm text-zinc-400 mt-0.5'>Design custom assessments for your classroom</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: General Info */}
      <div className='w-full rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md p-4 sm:p-7 mb-6 shadow-xl'>
        <div className='w-full flex items-center justify-between pb-4 mb-6 border-b border-zinc-800/80'>
          <div className='flex items-center gap-3 w-full'>
            <div className='p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0'>
              <ClipboardList className='w-5 h-5' />
            </div>
            <div>
              <h2 className='text-base font-bold tracking-tight text-white'>General Information</h2>
              <p className='text-xs text-zinc-400'>Basic details about this quiz</p>
            </div>
          </div>
        </div>

        <div className='space-y-5 w-full'>
          <div>
            <div className='flex items-center justify-between mb-2'>
              <label htmlFor='quiz-title' className='text-xs text-zinc-400 block font-medium'>
                Quiz Title <span className='text-rose-400'>*</span>
              </label>
              <span className='text-[11px] text-zinc-600 tabular-nums'>{title.length}/120</span>
            </div>
            <input
              id='quiz-title'
              type='text'
              value={title}
              maxLength={120}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder='e.g., Chapter 1: Foundations of Organic Chemistry'
              aria-invalid={titleMissing}
              className={`w-full rounded-xl bg-zinc-900/80 border px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:ring-1 transition-all ${
                titleMissing
                  ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/30'
                  : 'border-zinc-700/60 focus:border-sky-500/80 focus:ring-sky-500/30'
              }`}
            />
            {titleMissing && (
              <p className='text-xs text-rose-400 mt-1.5 flex items-center gap-1.5'>
                <AlertCircle className='w-3 h-3' /> Give your quiz a title before publishing
              </p>
            )}
          </div>

          <div>
            <label htmlFor='quiz-description' className='text-xs text-zinc-400 mb-2 block font-medium'>
              Description <span className='text-zinc-500'>(Optional)</span>
            </label>
            <textarea
              id='quiz-description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Provide instructions or overview topics...'
              rows={3}
              className='w-full rounded-xl bg-zinc-900/80 border border-zinc-700/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/30 transition-all resize-none'
            />
          </div>
        </div>
      </div>

      {/* Section 2: Questions Container */}
      <div className='w-full rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md shadow-xl overflow-hidden'>
        {/* Sticky Sub-Header */}
        <div className='sticky top-0 z-20 bg-zinc-900/95 backdrop-blur-md px-4 sm:px-7 py-4 border-b border-zinc-800/80 shadow-md w-full'>
          <div className='w-full flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='flex items-center gap-3.5 flex-wrap'>
              <div className='p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0'>
                <HelpCircle className='w-5 h-5' />
              </div>
              <div>
                <h2 className='text-base font-bold tracking-tight text-white'>Quiz Questions</h2>
                <p className='text-xs text-zinc-400'>Build and structure your question set</p>
              </div>

              <div className='flex items-center gap-2 ml-0 sm:ml-2 flex-wrap'>
                <span className={`text-xs font-medium rounded-full px-3 py-1 border ${
                  completedCount === questions.length
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-zinc-300 bg-zinc-800/90 border-zinc-700/60'
                }`}>
                  {completedCount}/{questions.length} Ready
                </span>
                <span className='text-xs font-medium text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-full px-3 py-1 flex items-center gap-1.5'>
                  <Award className='w-3.5 h-3.5' />
                  {totalMarks} {totalMarks === 1 ? 'Mark' : 'Marks'}
                </span>
              </div>
            </div>

            <Button
              size='sm'
              onClick={addQuestion}
              className='bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs gap-1.5 cursor-pointer shadow-lg shadow-sky-600/20 transition-all h-9 px-4 shrink-0 w-full md:w-auto justify-center'
            >
              <Plus className='w-4 h-4' />
              Add Question
            </Button>
          </div>
        </div>

        {/* Questions List */}
        <div className='p-4 sm:p-7 space-y-6 w-full'>
          {questions.map((q, index) => {
            const isComplete = isQuestionComplete(q)
            const questionMissing = touched && !q.question.trim()

            return (
              <div
                key={q.id}
                ref={(el) => { questionRefs.current[q.id] = el }}
                className={`group rounded-xl border p-3.5 sm:p-5 transition-all duration-200 animate-in fade-in slide-in-from-top-1 w-full ${
                  isComplete
                    ? 'bg-zinc-900/70 border-emerald-500/30 hover:border-emerald-500/50'
                    : questionMissing
                    ? 'bg-zinc-900/60 border-rose-500/40'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className='flex items-start gap-3 sm:gap-4 w-full'>
                  <div className={`shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-semibold transition-colors mt-0.5 ${
                    isComplete
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-zinc-800/80 border-zinc-700 text-zinc-400'
                  }`}>
                    {isComplete ? <Check className='w-3.5 h-3.5' /> : index + 1}
                  </div>

                  <div className='flex-1 min-w-0 w-full'>
                    <div className='flex items-center justify-between gap-2 mb-3'>
                      <span className='text-xs font-medium text-zinc-400 uppercase tracking-wider'>Question {index + 1}</span>
                      <div className='flex items-center gap-1'>
                        <button
                          onClick={() => duplicateQuestion(q.id)}
                          className='text-zinc-500 hover:text-sky-400 transition-colors p-1.5 rounded-md hover:bg-sky-500/10 cursor-pointer'
                          title='Duplicate question'
                          aria-label='Duplicate question'
                        >
                          <Copy className='w-3.5 h-3.5' />
                        </button>
                        <button
                          onClick={() => removeQuestion(q.id)}
                          className='text-zinc-500 hover:text-rose-400 transition-colors p-1.5 rounded-md hover:bg-rose-500/10 cursor-pointer'
                          title='Delete question'
                          aria-label='Delete question'
                        >
                          <Trash2 className='w-3.5 h-3.5' />
                        </button>
                      </div>
                    </div>

                    <AutoTextarea
                      value={q.question}
                      onChange={(v) => updateQuestion(q.id, "question", v)}
                      placeholder='What is the capital of...'
                      minRows={2}
                      aria-invalid={questionMissing}
                      className={`w-full rounded-xl bg-zinc-900 border px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition-all resize-none mb-4 overflow-hidden ${
                        questionMissing
                          ? 'border-rose-500/50 focus:border-rose-500/70'
                          : 'border-zinc-700/60 focus:border-sky-500/60'
                      }`}
                    />

                    <fieldset className='mb-4 space-y-2.5 w-full'>
                      <legend className='text-xs font-medium text-zinc-400 block mb-2'>
                        Answer Options <span className='text-zinc-500'>(select the correct one)</span>
                      </legend>

                      {[0, 1, 2, 3].map((optIndex) => {
                        const isSelected = q.correctOptionIndex === optIndex
                        const optionMissing = touched && !q.options[optIndex]?.trim()
                        return (
                          <div
                            key={optIndex}
                            className={`flex items-center gap-2 sm:gap-3 p-1.5 pr-3 rounded-xl border transition-all w-full ${
                              isSelected
                                ? 'bg-emerald-500/10 border-emerald-500/40'
                                : optionMissing
                                ? 'bg-zinc-900 border-rose-500/30'
                                : 'bg-zinc-900 border-zinc-800'
                            }`}
                          >
                            <button
                              type='button'
                              role='radio'
                              aria-checked={isSelected}
                              aria-label={`Mark option ${String.fromCharCode(65 + optIndex)} as correct`}
                              onClick={() => setCorrectOption(q.id, optIndex)}
                              className={`shrink-0 ml-1.5 sm:ml-2 w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-emerald-500 border-emerald-500 text-zinc-950 scale-105"
                                  : "border-zinc-700 hover:border-zinc-500 text-transparent"
                              }`}
                            >
                              <Check className='w-3 h-3 stroke-[3]' />
                            </button>

                            <span className='text-xs font-semibold text-zinc-500 w-4 shrink-0 text-center'>
                              {String.fromCharCode(65 + optIndex)}
                            </span>

                            <input
                              type='text'
                              value={q.options[optIndex] || ""}
                              onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                              aria-invalid={optionMissing}
                              className='flex-1 bg-transparent px-2 py-1 text-sm text-white placeholder:text-zinc-500 outline-none min-w-0 w-full'
                            />
                          </div>
                        )
                      })}

                      {q.correctOptionIndex === null && (
                        <p className='text-xs text-amber-400/90 font-medium pt-1 flex items-center gap-1.5'>
                          <Sparkles className='w-3 h-3' /> Select a correct answer option above
                        </p>
                      )}
                    </fieldset>

                    <div className='flex items-center gap-3 pt-3 border-t border-zinc-800/80 w-full'>
                      <label htmlFor={`marks-${q.id}`} className='text-xs text-zinc-400 font-medium'>Marks allocated:</label>

                      <div className='flex items-center bg-zinc-900 border border-zinc-700/60 rounded-lg p-0.5'>
                        <button
                          type='button'
                          onClick={() => handleMarksChange(q.id, -1)}
                          disabled={q.marks <= 1}
                          className='w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent rounded-md transition-colors cursor-pointer'
                          title='Decrease marks'
                          aria-label='Decrease marks'
                        >
                          <Minus className='w-3.5 h-3.5' />
                        </button>

                        <input
                          id={`marks-${q.id}`}
                          type='number'
                          min={1}
                          value={q.marks}
                          onChange={(e) => updateQuestion(q.id, "marks", Math.max(1, Number(e.target.value) || 1))}
                          className='w-10 text-center bg-transparent text-xs font-bold text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                        />

                        <button
                          type='button'
                          onClick={() => handleMarksChange(q.id, 1)}
                          className='w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors cursor-pointer'
                          title='Increase marks'
                          aria-label='Increase marks'
                        >
                          <Plus className='w-3.5 h-3.5' />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          <button
            onClick={addQuestion}
            className='w-full rounded-xl border border-dashed border-zinc-800 hover:border-sky-500/50 bg-zinc-900/30 hover:bg-sky-500/5 text-zinc-500 hover:text-sky-400 text-sm font-medium py-4 flex items-center justify-center gap-2 transition-all cursor-pointer'
          >
            <Plus className='w-4 h-4' />
            Add another question
          </button>
        </div>
      </div>

      {/* Floating Full-Width Bottom Bar */}
      <div className='fixed bottom-4 left-0 right-0 z-30 px-3 sm:px-6 lg:px-10 xl:px-14 pointer-events-none w-full'>
        <div className='w-full pointer-events-auto'>
          <div className='w-full rounded-2xl border border-zinc-800/80 bg-zinc-900/90 backdrop-blur-md px-4 py-3 sm:px-7 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3'>
            <div className='flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 text-xs text-zinc-400'>
              <span><strong className='text-white'>{completedCount}</strong> of <strong className='text-white'>{questions.length}</strong> questions complete</span>
              <span>•</span>
              <span><strong className='text-sky-400'>{totalMarks}</strong> total marks</span>
            </div>

            <div className='flex items-center gap-3 w-full sm:w-auto'>
              <Button
                variant='outline'
                onClick={() => router.back()}
                className='w-full sm:w-auto border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:text-white text-zinc-300 cursor-pointer'
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className='w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-medium cursor-pointer shadow-lg shadow-sky-600/20'
              >
                {submitting ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin mr-2' />
                    Creating Quiz...
                  </>
                ) : (
                  "Create Quiz"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateQuizPage