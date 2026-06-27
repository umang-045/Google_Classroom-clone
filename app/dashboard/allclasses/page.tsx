"use client"
import React, { useState, useEffect } from 'react'
import './allclasses.css'
import { useSearchParams } from 'next/navigation'
import ClassroomCard from '@/app/components/ClassroomCard'
import TopBar from '@/app/components/TopBar'
import { Loader2 } from 'lucide-react'


export function classphoto(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const AllClasses = () => {
  const [teachingClassroom, setTeachingClassroom] = useState([])
  const [enrolledClassroom, setEnrolledClassroom] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchClassrooms = async () => {
      const res = await fetch("/api/user/classrooms")
      const data = await res.json()
      setTeachingClassroom(data.teachingClassroom || [])
      setEnrolledClassroom(data.enrolledClassroom || [])
      setPendingRequests(data.pendingRequests || [])
      setLoading(false)
    }
    fetchClassrooms()
  }, [searchParams])

  if (loading) return <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="size-6 animate-spin text-gray-400" />
  </div>


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
          <div className='classContainer cursor-pointer'>
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

export default AllClasses
