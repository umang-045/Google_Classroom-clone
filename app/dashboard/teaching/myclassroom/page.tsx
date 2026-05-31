"use client"
import React, { useEffect, useState } from 'react'
import '../../allclasses/allclasses.css'


const teacherClassroompage = () => {
    const [teachingClassroom,setTeachingClassroom]=useState([])
    const [loading,setLoading]=useState(true)
    useEffect(()=>{
        const fetchteachingClassrooms =async () =>{
            const res = await fetch("/api/user/classrooms")
            const data=await res.json()
            setTeachingClassroom(data.teachingClassroom)
            setLoading(false)
        }
        fetchteachingClassrooms()
    },[])
    if(loading){
        return(
            <><p>loading..</p></>
        )
    }
  return (
    <>
      <div className='teaching'>
        <h2 className='heading'>Enrolled as Teacher 🧑‍🏫</h2>
        <div className='classContainer'>
          {teachingClassroom.length === 0 ? <p className='noClass'>No classrooms created yet!</p> : teachingClassroom.map((classroom) => (

            <div key={classroom.id} className='classCard'>
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
    </>
  )
}

export default teacherClassroompage
