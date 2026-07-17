"use client"
import React, { useState, useEffect, useRef } from 'react'
import '../dashboard/allclasses/allclasses.css'
import { useSearchParams } from 'next/navigation'
import ClassroomCard from '@/app/components/ClassroomCard'
import TopBar from '@/app/components/TopBar'

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
    const searchParams = useSearchParams()
    const isFirstRender = useRef(true)

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
            <div>
                <div className='teaching'>
                    <h2 className='heading'>Enrolled as Teacher </h2>
                    <div className='classContainer my-2 cursor-pointer'>
                        {teachingClassroom.length === 0
                            ? <p className='noClass'>No classrooms created yet!</p>
                            : teachingClassroom.map((classroom, colorIndex) => (
                                <ClassroomCard key={classroom.id} Classroomdetails={classroom} colorIndex={colorIndex} role="teacher" />
                            ))
                        }
                    </div>
                </div>

                <div className='enrolled'>
                    <h2 className='heading'>Enrolled As Student </h2>
                    <div className='classContainer my-2  cursor-pointer'>
                        {enrolledClassroom.map((item, colorIndex) => (
                            <ClassroomCard key={item.classroom.id} Classroomdetails={item.classroom} colorIndex={teachingClassroom.length + colorIndex} role="student" />
                        ))}
                    </div>
                </div>
            </div>

            {pendingRequests.length > 0 && (
                <div className='pending'>
                    <h2 className='heading'>Pending Approval</h2>
                    <div className='classContainer my-2 cursor-not-allowed'>
                        {pendingRequests.map((req, colorIndex) => (
                            <ClassroomCard
                                key={req.classroom.id}
                                Classroomdetails={req.classroom}
                                colorIndex={colorIndex}
                                role="student"
                                pending={true}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default AllClassesClient