
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CreateAssignment from './CreateAssignment'


const Assignments = ({ classroomId, role }: { classroomId: number, role: string }) => {
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null)
    const [fileUrl, setfileUrl] = useState("")
    const [file, setfile] = useState(null)
    
    const [error, setError] = useState("")
    
    const [submitAssignmentBox, setsubmitAssignmentBox] = useState(false)
    const [upload, setupload] = useState(false)
    const router = useRouter()


    const handleUpload = async (e) => {
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch('/api/fileupload', {
            method: "POST",
            body: formData
        })
        const data = await res.json();
        if (!res.ok) {
            if (!res.ok) {
                return setError(data.message || "Try again")
            }
            setupload(false)
        }
        setfileUrl[data.result.secure_url]

    }


    const handleSubmission = async (e) => {
        const res = await fetch(`/api/assignments/${classroomId}/submissions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileUrl: fileUrl, assignmentId: selectedAssignmentId })
        })
        const data = await res.json();
        if (!res.ok) {
            return setError(data.message || "Try again")
        }

        setsubmitAssignmentBox(false)
    }
    return (

        <div>
        <div className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-center'>
          <CreateAssignment classroomId={classroomId} />
        </div>
      </div>
    </div>
        </div>
    )
}

export default Assignments
