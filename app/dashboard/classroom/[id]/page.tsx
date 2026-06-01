"use client"
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import './id.css'


const ClassroomPage = () => {
  const [classroomDetails, setClassroomDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const id = params.id

  useEffect(() => {
    const details = async () => {
      const res = await fetch(`/api/classroom/${id}`)
      const data = await res.json()
      setClassroomDetails(data.classroom)
      setLoading(false)

    }
    details()
  }, [])
  if (loading) return <p>Loading...</p>
  if (!classroomDetails) return <p>Classroom not found</p>

  return (
    <>
      <div className='cardContainer'>
        <div className='NameBox'>
          <div className='descBox'>
          <h1>{classroomDetails.className}</h1>
          <p>{classroomDetails.description}</p>
          </div>
          <ol>
          <li>Semester :{classroomDetails.semester}</li>
          <li>Section : {classroomDetails.section}</li>
          <li>Teacher:{classroomDetails.teacher.name}</li>
          <li>Contact Teacher :{classroomDetails.teacher.email}</li>
          </ol>
        </div>
        <div className='TabCollection'>
          <div className='buttons'>
            <button>Stream</button>
            <button>Assignment</button>
            <button>Materials</button>
            <button>Members</button>
            <button>Chat</button>
          </div >
        </div>
      </div>
    </>
  )
}

export default ClassroomPage
