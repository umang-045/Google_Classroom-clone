import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AssignmentData {
    id?: number
    title: string
    description: string
    due_at: string
    fileUrl?: string
}

function CreateAssignment({classroomId,setcreateAssignmentBox,editData}: {classroomId: number,setcreateAssignmentBox: (val: boolean) => void,editData?: AssignmentData})
 {
    const isEditing = !!editData?.id
    const [createform, setcreateform] = useState({
        title: editData?.title ?? "",
        description: editData?.description ?? "",
        due_at: editData?.due_at? new Date(editData.due_at).toISOString().slice(0, 16): "",
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const router = useRouter()
    const [file, setfile] = useState<File | null>(null)
    const [fileKey, setFileKey] = useState(0)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        setError("")
        setSuccess("")
        let fileUrl = editData?.fileUrl ?? ""

        if (file) {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/fileupload", { method: "POST", body: formData })
            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Upload failed. Try again.")
                setLoading(false)
                return
            }

            fileUrl = data.result.secure_url
        }

        const endpoint = isEditing? `/api/assignments/${classroomId}/${editData!.id}`
            : "/api/assignments/create-assignment"

        const method = isEditing ? "PATCH" : "POST"

        const res = await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...createform, fileUrl, classroomId }),
        })

        const data = await res.json()

        if (!res.ok) {
            setError(data.message || "Something went wrong. Try again.")
            setLoading(false)
            return
        }

        setSuccess(isEditing ? "Assignment updated!" : "Assignment created!")
        setLoading(false)

        setTimeout(() => {
            setcreateAssignmentBox(false)
            router.refresh()
        }, 800)
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'onClick={() => setcreateAssignmentBox(false)}>
            <Card className='w-full max-w-lg bg-white' onClick={(e) => e.stopPropagation()}>
                <CardHeader>
                    <CardTitle className='font-semibold'>
                        {isEditing ? "Edit Assignment" : "Create Assignment"}
                    </CardTitle>
                    <CardDescription>
                        {isEditing ? "Update the assignment details below." : "Fill up essential details of Assignment"}
                    </CardDescription>
                </CardHeader>

                <CardContent className='space-y-4'>
                    <div className='w-full space-y-2'>
                        <Label htmlFor='title' className='gap-1'>
                            Title <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                            id='title'
                            type='text'
                            placeholder='Title of Assignment'
                            required
                            value={createform.title}
                            onChange={(e) => setcreateform({ ...createform, title: e.target.value })}
                        />
                    </div>

                    <div className='w-full space-y-2'>
                        <Label htmlFor='description' className='gap-1'>
                            Description <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                            id='description'
                            type='text'
                            placeholder='Description'
                            required
                            value={createform.description}
                            onChange={(e) => setcreateform({ ...createform, description: e.target.value })}
                        />
                    </div>

                    <div className='w-full space-y-2'>
                        <Label htmlFor='due_at' className='gap-1'>
                            Due Date <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                            id='due_at'
                            type='datetime-local'
                            required
                            value={createform.due_at}
                            onChange={(e) => setcreateform({ ...createform, due_at: e.target.value })}
                        />
                    </div>

                    <div className='w-full space-y-2'>
                        <Label htmlFor='question-file' className='gap-1'>
                            {isEditing ? "Replace File" : "Upload File"}
                        </Label>
                        <Input
                            key={fileKey}
                            id='question-file'
                            type='file'
                            className='text-muted-foreground file:border-input file:text-foreground p-0 pr-3 italic file:mr-3 file:h-full file:border-0 file:border-r file:border-solid file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic'
                            onChange={(e) => setfile(e.target.files?.[0] || null)}
                        />
                        <p className='text-muted-foreground text-xs'>
                            {isEditing? editData?.fileUrl? "Leave empty to keep the existing file. Max 10MB."
                                    : "No file currently attached. Max 10MB."
                                : "You can upload a file here (Max 10MB)."}
                        </p>
                        {isEditing && editData?.fileUrl && (
                            <a href={editData.fileUrl} target='_blank' rel='noopener noreferrer' className='text-sm text-blue-600 underline hover:text-blue-800'>
                                View current file
                            </a>
                        )}
                    </div>

                    {error && <p className='text-destructive text-sm'>{error}</p>}
                    {success && <p className='text-green-600 text-sm'>{success}</p>}
                </CardContent>

                <CardContent className='flex justify-end gap-2 max-sm:justify-center'>
                    <Button className='max-sm:flex-1' variant='outline' onClick={() => setcreateAssignmentBox(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button className='max-sm:flex-1' type='button' onClick={handleSubmit} disabled={loading}>
                        {loading
                            ? isEditing ? "Saving..." : "Creating..."
                            : isEditing ? "Save Changes" : "Create"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreateAssignment