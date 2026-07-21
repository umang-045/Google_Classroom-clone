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
        <div 
            onClick={() => onOpenQuiz(quiz.id)}
            className='w-full rounded-xl bg-white/[0.04] border border-white/10 border-l-4 border-l-blue-500/80 text-white p-4 shadow-sm hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4'
        >
            <div className='flex items-start gap-3.5'>
                {/* Icon Container */}
                <div className='shrink-0 w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center'>
                    <FileQuestion className='w-4 h-4 text-blue-400' />
                </div>

                {/* Content Area */}
                <div className='min-w-0 flex-1 space-y-1.5'>
                    <div className='flex items-center justify-between gap-2'>
                        <h3 className='text-base font-semibold text-white tracking-tight truncate'>
                            {quiz.title}
                        </h3>
                        {isNew && (
                            <span className='text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0'>
                                New
                            </span>
                        )}
                    </div>

                    <p className='text-xs text-zinc-400 font-medium'>
                        Created {getRelativeTime(quiz.created_at)}
                    </p>

                    {quiz.description && (
                        <p className='text-sm text-zinc-300 leading-relaxed line-clamp-2 pt-0.5'>
                            {quiz.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Separated Action Footer */}
            <div className='flex items-center justify-end w-full pt-3 border-t border-white/5'>
                <Button
                    size='sm'
                    className='bg-blue-600 hover:bg-blue-500 text-white text-xs h-8 px-3.5 rounded-md cursor-pointer shrink-0 font-medium'
                    onClick={(e) => {
                        e.stopPropagation()
                        onOpenQuiz(quiz.id)
                    }}
                >
                    View Quiz
                </Button>
            </div>
        </div>
    )
}