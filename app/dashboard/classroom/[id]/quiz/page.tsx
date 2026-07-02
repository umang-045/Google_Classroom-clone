"use client"
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import React from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { QuizCard } from '@/app/components/Quiz/QuizCard'


interface Quiz {
    id: number
    title: string
    description: string
    created_at: string
}

const QuizPage = () => {
    const params = useParams()
    const router = useRouter()
    const [role, setRole] = useState<string>("")
    const [quizInfo, setQuizInfo] = useState<Quiz[]>([])
    const [loading, setLoading] = useState(true)

    const classroomId = params.id

    useEffect(() => {
        const fetchRole = async () => {
            const res = await fetch(`/api/classroom/${classroomId}`)
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.message || "Try Again")
                return
            }
            setRole(data.role)
        }
        fetchRole()
    }, [classroomId])

    useEffect(() => {
        const fetchQuizInfo = async () => {
            try {
                const res = await fetch(`/api/quiz/${classroomId}`)
                const data = await res.json()
                if (!res.ok) {
                    toast.error(data.message || "Try Again")
                    return
                }
                setQuizInfo(data.allquizInfo)
            } catch (err) {
                toast.error("Something went wrong")
            } finally {
                setLoading(false)
            }
        }
        fetchQuizInfo()
    }, [classroomId])

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

            {loading ? (
                <div className="flex items-center justify-center min-h-[75vh]">
                    <Loader2 className="size-6 animate-spin text-gray-400" />
                </div>
            ) : quizInfo.length > 0 ? (
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

export default QuizPage
