"use client"
import React, { useState, useEffect, useRef } from 'react'
import '../dashboard/allclasses/allclasses.css'
import { useSearchParams } from 'next/navigation'
import ClassroomCard from '@/app/components/ClassroomCard'
import TopBar from '@/app/components/TopBar'
import { GraduationCap, Briefcase, Clock } from 'lucide-react'

export function classphoto(name = '') {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

interface AllClassesClientProps {
    initialTeachingClassroom: any[]
    initialEnrolledClassroom: any[]
    initialPendingRequests: any[]
}

const AllClassesClient = ({ initialTeachingClassroom, initialEnrolledClassroom, initialPendingRequests }: AllClassesClientProps) => {
    const [teachingClassroom, setTeachingClassroom] = useState(initialTeachingClassroom)
    const [enrolledClassroom, setEnrolledClassroom] = useState(initialEnrolledClassroom)
    const [pendingRequests, setPendingRequests] = useState(initialPendingRequests)
    const [mounted, setMounted] = useState(false)
    const searchParams = useSearchParams()
    const isFirstRender = useRef(true)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        setTeachingClassroom(initialTeachingClassroom)
        setEnrolledClassroom(initialEnrolledClassroom)
        setPendingRequests(initialPendingRequests)
    }, [initialTeachingClassroom, initialEnrolledClassroom, initialPendingRequests])

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        const fetchClassrooms = async () => {
            const res = await fetch("/api/user/classrooms")
            const data = await res.json()
            setTeachingClassroom(data.teachingClassroom || [])
            setEnrolledClassroom(data.enrolledClassroom || [])
            setPendingRequests(data.pendingRequests || [])
        }
        fetchClassrooms()
    }, [searchParams])

    return (
        <>
            <TopBar />
            
            <div className={`w-full flex flex-col gap-8 px-6 pb-12 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          
                <div className='w-full'>
                    <div className='flex items-center gap-2 mb-4 border-b border-white/[0.04] pb-2'>
                        <Briefcase className="size-5 text-blue-400" />
                        <h2 className='text-zinc-100 font-extrabold text-lg tracking-wide uppercase'>
                            Enrolled as Teacher
                        </h2>
                        <span className="text-xs font-semibold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/10">
                            {teachingClassroom.length}
                        </span>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full cursor-pointer'>
                        {teachingClassroom.length === 0 ? (
                            <div className="col-span-full py-8 px-6 text-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01]">
                                <p className='text-zinc-500 text-sm font-medium'>No classrooms created yet!</p>
                            </div>
                        ) : (
                            teachingClassroom.map((classroom, colorIndex) => (
                                <div key={classroom.id} className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40">
                                    <ClassroomCard Classroomdetails={classroom} colorIndex={colorIndex} role="teacher" />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                
                <div className='w-full'>
                    <div className='flex items-center gap-2 mb-4 border-b border-white/[0.04] pb-2'>
                        <GraduationCap className="size-5 text-indigo-400" />
                        <h2 className='text-zinc-100 font-extrabold text-lg tracking-wide uppercase'>
                            Enrolled As Student
                        </h2>
                        <span className="text-xs font-semibold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/10">
                            {enrolledClassroom.length}
                        </span>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full cursor-pointer'>
                        {enrolledClassroom.length === 0 ? (
                            <div className="col-span-full py-8 px-6 text-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01]">
                                <p className='text-zinc-500 text-sm font-medium'>Not enrolled in any student courses yet.</p>
                            </div>
                        ) : (
                            enrolledClassroom.map((item, colorIndex) => (
                                <div key={item.classroom.id} className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40">
                                    <ClassroomCard Classroomdetails={item.classroom} colorIndex={teachingClassroom.length + colorIndex} role="student" />
                                </div>
                            ))
                        )}
                    </div>
                </div>

             
                {pendingRequests.length > 0 && (
                    <div className='w-full relative mt-2'>
                        <div className='flex items-center gap-2 mb-4 border-b border-white/[0.04] pb-2'>
                            <Clock className="size-5 text-amber-400 animate-pulse" />
                            <h2 className='text-zinc-100 font-extrabold text-lg tracking-wide uppercase'>
                                Pending Approval
                            </h2>
                            <span className="text-xs font-semibold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/10">
                                {pendingRequests.length}
                            </span>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full cursor-not-allowed opacity-85'>
                            {pendingRequests.map((req, colorIndex) => (
                                <div key={req.classroom.id} className="relative rounded-2xl overflow-hidden shadow-md border border-amber-500/20 shadow-amber-900/[0.04]">
                                    <ClassroomCard
                                        Classroomdetails={req.classroom}
                                        colorIndex={colorIndex}
                                        role="student"
                                        pending={true}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default AllClassesClient