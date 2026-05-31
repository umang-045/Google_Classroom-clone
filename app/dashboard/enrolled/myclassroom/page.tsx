"use client"
import React,{useEffect, useState} from 'react'
import '../../allclasses/allclasses.css'

const enrolledClassroompage = () => {
    const [enrolledClassroom,setenrolledClassroom]=useState([])
    const [loading,setLoading]=useState(true)
    useEffect(()=>{
        const fetchenrolledClassroom= async ()=>{
            const res =await fetch("/api/user/classrooms")
            const data = await res.json();
            setenrolledClassroom(data.enrolledClassroom || [])
            setLoading(false)
        }
        fetchenrolledClassroom()
    },[])
    if(loading){
        return(
            <><p>loading..</p></>
        )
    }

  return (
    <>
      <div className='enrolled'>
        <h2 className='heading'>Enrolled As Student 🧑‍🎓</h2>
        <div className='classContainer'>
          {enrolledClassroom.length === 0 ? <p className='noClass'>No classrooms joined yet!</p> : enrolledClassroom.map((item) => (
            <div key={item.id} className='classCard'>
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

export default enrolledClassroompage
