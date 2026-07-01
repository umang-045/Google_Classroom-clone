"use client"
import React, { useEffect, useState } from 'react'
import '../../allclasses/allclasses.css'
import ClassroomCard from '@/app/components/ClassroomCard'
import { useRouter } from 'next/navigation'
import TopBar from '@/app/components/TopBar'
import { Loader2 } from 'lucide-react'


const enrolledClassroompage = () => {
  const [enrolledClassroom, setenrolledClassroom] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  useEffect(() => {
    const fetchenrolledClassroom = async () => {
      const res = await fetch("/api/user/classrooms")
      const data = await res.json();
      setenrolledClassroom(data.enrolledClassroom || [])
      setLoading(false)
    }
    fetchenrolledClassroom()
  }, [])
  if (loading) return <div className="flex items-center justify-center min-h-[75vh]">
        <Loader2 className="size-6 animate-spin text-gray-400" />
    </div>

  return (
    <>
    <TopBar />
      <div className='enrolled'>
        <h2 className='heading'>Enrolled As Student</h2>
        <div className='classContainer'>
          {enrolledClassroom.map((item, colorIndex) => (
            <ClassroomCard key={item.classroom.id} Classroomdetails={item.classroom} colorIndex={colorIndex} role="student" />
          ))}
        </div>
      </div>
    </>
  )
}

export default enrolledClassroompage
