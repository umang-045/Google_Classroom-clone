"use client"
import React, { useState, useEffect } from 'react'
import './allclasses.css'
import { useRouter,useSearchParams } from 'next/navigation'


const AllClasses = () => {
  const [teachingClassroom, setTeachingClassroom] = useState([])
  const [enrolledClassroom, setEnrolledClassroom] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams=useSearchParams()
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
      <div className='teaching'>
        <h2 className='heading'>Enrolled as Teacher 🧑‍🏫</h2>
        <div className='classContainer'>
          {teachingClassroom.length === 0 ? <p className='noClass'>No classrooms created yet!</p> : teachingClassroom.map((classroom) => (

            <div key={classroom.id} className='classCard' onClick={()=>{router.push(`/dashboard/classroom/${classroom.id}`)}}>
              <h3>{classroom.className}</h3>
              <div className="smallbox">
                <div className="info">
                  <p>{classroom.semester}</p>
                  <p> Section -{classroom.section}</p>
                  <p>{classroom.description}</p>
                  <p className='joinCode'>{classroom.joinCode}</p>
                </div>
                <div className='classcardphoto'>
                  <img src='/teacher.png'></img>
                </div>
              </div>
            </div>
          ))
          }
        </div>
      </div>

      <div className='enrolled'>
        <h2 className='heading'>Enrolled As Student 🧑‍🎓</h2>
        <div className='classContainer'>
          {enrolledClassroom.length === 0 ? <p className='noClass'>No classrooms joined yet!</p> : enrolledClassroom.map((item) => (
            <div key={item.id} className='classCard' onClick={() => router.push(`/dashboard/classroom/${item.classroom.id}`)}>
                                <h3>{item.classroom.className}</h3>
              <div className="smallbox">
                <div className='info'>
                  <p>{item.classroom.semester}</p>
                  <p> Section-{item.classroom.section}</p>
                  <p>{item.classroom.description}</p>
                  <p className='joinCode'>{item.classroom.joinCode}</p>
                </div>
                <div className='classcardphoto'>
                  <img src='/student.png'></img>
                </div>  
              </div>
            </div>
          ))
          }
        </div>
      </div>
    </>
  )
}

export default AllClasses

