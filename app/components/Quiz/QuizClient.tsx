"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import React from 'react'
import { Button } from '@/components/ui/button'
import { QuizCard } from '@/app/components/Quiz/QuizCard'


interface Quiz {
    id: number
    title: string
    description: string
    created_at: string
}

interface QuizClientProps {
    classroomId: string
    initialRole: string
    initialQuizInfo: Quiz[]
}

const QuizClient = ({ classroomId, initialRole, initialQuizInfo }: QuizClientProps) => {
    const router = useRouter()
    const [role] = useState<string>(initialRole)
    const [quizInfo] = useState<Quiz[]>(initialQuizInfo)

    const handleOpenQuiz = (quizId: number) => {
        router.push(`/dashboard/classroom/${classroomId}/quiz/${quizId}`)
    }

    return (
        <div className='py-4 px-2 sm:px-4'>
            {role === "teacher" && (
                <div className='flex justify-end mb-6'>
                    <Button onClick={() => { router.push(`/dashboard/classroom/${classroomId}/quiz/create`) }}>
                        + Create Quiz
                    </Button>
                </div>
            )}

            {quizInfo.length > 0 ? (
                <div className='space-y-3'>
                    {quizInfo.map((item) => (
                        <QuizCard
                            key={item.id}
                            quiz={item}
                            role={role}
                            onOpenQuiz={handleOpenQuiz}
                        />
                    ))}
                </div>
            ) : (
                <p className='text-center text-white/50 py-12'>
                    No quiz published here yet.
                </p>
            )}
        </div>
    )
}

export default QuizClient