"use client"
import React, { useEffect, useState } from 'react'
import '../../allclasses/allclasses.css'
import ClassroomCard from '@/app/components/ClassroomCard'
import { useRouter } from 'next/navigation'
import TopBar from '@/app/components/TopBar'


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
  if (loading) {
    return (
      <><p>loading..</p></>
    )
  }

  return (
    <>
    <TopBar />
      <div className='enrolled'>
        <h2 className='heading'>Enrolled As Student 🧑‍🎓</h2>
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
