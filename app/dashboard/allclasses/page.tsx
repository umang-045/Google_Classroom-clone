"use client"
import React, { useState, useEffect } from 'react'
import './allclasses.css'


const allClasses = () => {
    const [teachingClassroom, setTeachingClassroom] = useState([])
    const [enrolledClassroom, setEnrolledClassroom] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchClassrooms = async () => {
            const res = await fetch("/api/user/classrooms")
            const data = await res.json()
            console.log("data:", data) 
            setTeachingClassroom(data.teachingClassroom || [])
            setEnrolledClassroom(data.enrolledClassroom|| [])
            setLoading(false)
        }
        fetchClassrooms()
    }, [])

    if (loading) return <p>Loading...</p>
return (
  <>
    <div className='teaching'>
      <h2>Teaching</h2>
      <div className='classContainer'>
        {teachingClassroom.length === 0 ? <p className='noClass'>No classrooms created yet!</p>: teachingClassroom.map((classroom) => (
            <div key={classroom.id} className='classCard'>
              <h3>{classroom.className}</h3>
              <p>{classroom.semester} - Section {classroom.section}</p>
              <p>{classroom.description}</p>
              <p className='joinCode'>{classroom.joinCode}</p>
            </div>
          ))
        }
      </div>
    </div>

    <div className='enrolled'>
      <h2>Enrolled</h2>
      <div className='classContainer'>
        {enrolledClassroom.length === 0? <p className='noClass'>No classrooms joined yet!</p>: enrolledClassroom.map((item) => (
            <div key={item.id} className='classCard'>
              <h3>{item.classroom.className}</h3>
              <p>{item.classroom.semester} - Section {item.classroom.section}</p>
              <p>{item.classroom.description}</p>
              <p className='joinCode'>{item.classroom.joinCode}</p>
            </div>
          ))
        }
      </div>
    </div>
  </>
)
}

export default allClasses

