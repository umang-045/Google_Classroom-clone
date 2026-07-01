"use client"
import React, { useEffect, useState } from 'react'
import '../../allclasses/allclasses.css'
import ClassroomCard from '@/app/components/ClassroomCard'
import { useRouter } from 'next/navigation'
import TopBar from '@/app/components/TopBar'
import { Loader2 } from 'lucide-react'



const teacherClassroompage = () => {
  const [teachingClassroom, setTeachingClassroom] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter();
  useEffect(() => {
    const fetchteachingClassrooms = async () => {
      const res = await fetch("/api/user/classrooms")
      const data = await res.json()
      setTeachingClassroom(data.teachingClassroom)
      setLoading(false)
    }
    fetchteachingClassrooms()
  }, [])
  if (loading) return <div className="flex items-center justify-center min-h-[75vh]">
          <Loader2 className="size-6 animate-spin text-gray-400" />
      </div>
  return (
    <>
    <TopBar />
      <div className='teaching'>
        <h2 className='heading'>Enrolled as Teacher</h2>
        <div className='classContainer my-2'>
          {teachingClassroom.length === 0
            ? <p className='noClass'>No classrooms created yet!</p>
            : teachingClassroom.map((classroom, colorIndex) => (
              <ClassroomCard key={classroom.id} Classroomdetails={classroom} colorIndex={colorIndex} role="teacher" />
            ))
          }
        </div>
      </div>
    </>
  )
}

export default teacherClassroompage
