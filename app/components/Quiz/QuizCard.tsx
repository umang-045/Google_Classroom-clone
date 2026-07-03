"use client"
import React from 'react'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Quiz {
    id: number
    title: string
    description: string
    created_at: string
}

interface QuizCardProps {
    quiz: Quiz
    role: string
    onOpenQuiz: (id: number) => void
}

function getRelativeTime(dateString: string) {
    const diffMs = Date.now() - new Date(dateString).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return new Date(dateString).toLocaleDateString(undefined, { dateStyle: 'medium' })
}

export const QuizCard = ({ quiz, role, onOpenQuiz }: QuizCardProps) => {
    const isNew = Date.now() - new Date(quiz.created_at).getTime() < 86400000

    return (
        <div className='w-full rounded-xl bg-white/5 border border-white/10 border-l-4 border-l-emerald-500/70 text-white p-5 shadow-sm hover:bg-white/[0.07] transition-colors'>
            <div className='flex items-start gap-3'>
                <div className='shrink-0 w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center'>
                    <FileQuestion className='w-4 h-4 text-emerald-400' />
                </div>

                <div className='min-w-0 flex-1'>
                    <div className='flex items-center justify-between gap-3'>
                        <div className='flex items-center gap-2 min-w-0'>
                            <h3 className='text-base font-semibold text-white truncate'>{quiz.title}</h3>
                            {isNew && (
                                <span className='text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0'>
                                    New
                                </span>
                            )}
                        </div>
                        <Button
                            size='sm'
                            className='text-xs h-7 shrink-0 p-4 cursor-pointer hover:brightness-80 bg-emerald-500/15 text-emerald-400 '
                            onClick={() => onOpenQuiz(quiz.id)}>
                            View Quiz 
                        </Button>
                    </div>

                    <p className='mt-1 text-xs text-white/40'>
                        {getRelativeTime(quiz.created_at)}
                    </p>

                    <p className='mt-3 text-sm text-white/70 leading-relaxed whitespace-pre-wrap'>
                        {quiz.description}
                    </p>
                </div>
            </div>
        </div>
    )
}