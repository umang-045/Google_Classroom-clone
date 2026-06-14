import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

function CreateAssignment({ classroomId }) {
    const [createform, setcreateform] = useState({ title: "", description: "", fileUrl: "", due_at: "" })
    const [error, setError] = useState("")
    const [createAssignmentBox, setcreateAssignmentBox] = useState(false)
    const router = useRouter()
    const [fileUrl, setfileUrl] = useState("")
    const [file, setfile] = useState(null)
    const [upload, setupload] = useState(false)
    const handleCreate = async (e) => {
        const res = await fetch('/api/assignment/create-assignment', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(createform)
        })
        const data = await res.json();
        if (!res.ok) {
            if (!res.ok) {
                return setError(data.message || "Try again")
            }
        }
        setcreateAssignmentBox(false)
        router.push(`/dashboard/classroom/${classroomId}`)
    }

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

    return (
        <Card className='w-full max-w-lg bg-white'>
            <CardHeader>
                <CardTitle className='font-semibold'>Create Assignment</CardTitle>
                <CardDescription>Fill up essential details of Assignment</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='w-full space-y-2'>
                    <Label htmlFor='studio-name' className='gap-1'>
                        Title <span className='text-destructive'>*</span>
                    </Label>
                    <Input id='title' type='text' placeholder='Title of Assignment' required />
                </div>
                <div className='w-full space-y-2'>
                    <Label htmlFor='studio-name' className='gap-1'>
                        Description <span className='text-destructive'>*</span>
                    </Label>
                    <Input id='description' type='text' placeholder='Description' required />
                </div>
                <div className='w-full space-y-2'>
                    <Label htmlFor='studio-input' className='gap-1'>
                        Upload File <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                        id='question-file'
                        type='file'
                        className='text-muted-foreground file:border-input file:text-foreground p-0 pr-3 italic file:mr-3 file:h-full file:border-0 file:border-r file:border-solid file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic'
                    />
                    <p className='text-muted-foreground text-xs'>You can upload a file here (Max-10MB).</p>

                </div>
            </CardContent>
            <CardContent className='flex justify-end gap-2 max-sm:justify-center'>
                <Button className='max-sm:flex-1' variant='outline'>
                    Cancel
                </Button>
                <Button className='max-sm:flex-1' type='submit'>
                    Create
                </Button>
            </CardContent>
        </Card>
    )
}

export default CreateAssignment
