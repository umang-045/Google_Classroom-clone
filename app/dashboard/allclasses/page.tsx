"use client"
import React, { useState, useEffect } from 'react'
import './allclasses.css'
import {  useSearchParams } from 'next/navigation'
import ClassroomCard from '@/app/components/ClassroomCard'
import TopBar from '@/app/components/TopBar'


export function classphoto(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const AllClasses = () => {
  const [teachingClassroom, setTeachingClassroom] = useState([])
  const [enrolledClassroom, setEnrolledClassroom] = useState([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchClassrooms = async () => {
      const res = await fetch("/api/user/classrooms")
      const data = await res.json()
      setTeachingClassroom(data.teachingClassroom || [])
      setEnrolledClassroom(data.enrolledClassroom || [])
      setLoading(false)
    }
    fetchClassrooms()
  }, [searchParams])

  if (loading) return <p>Loading...</p>


  return (

    <>
    <TopBar/>
    <div>
      <div className='teaching'>
        <h2 className='heading'>Enrolled as Teacher </h2>
        <div className='classContainer my-2'>
          {teachingClassroom.length === 0
            ? <p className='noClass'>No classrooms created yet!</p>
            : teachingClassroom.map((classroom, colorIndex) => (
              <ClassroomCard key={classroom.id} Classroomdetails={classroom} colorIndex={colorIndex} role="teacher"/>
            ))
          }
        </div>
      </div>

      <div className='enrolled'>
        <h2 className='heading'>Enrolled As Student </h2>
        <div className='classContainer'>
          {enrolledClassroom.map((item, colorIndex) => (
            <ClassroomCard key={item.classroom.id} Classroomdetails={item.classroom} colorIndex={teachingClassroom.length + colorIndex} role="student"/>
          ))}
        </div>
      </div>
      </div>
    </>
  )
}

export default AllClasses
