import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

function CreateAssignment({ classroomId, setcreateAssignmentBox }) {
    const [createform, setcreateform] = useState({ title: "", description: "", due_at: "" })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const router = useRouter()
    const [file, setfile] = useState(null)
    const [upload, setupload] = useState(false)
    const [fileKey, setFileKey] = useState(0)
    const [loading, setLoading] = useState(false)

    const handleCreate = async (e) => {
        setLoading(true);
        setError("");
        setSuccess("");
        let fileUrl = "";

        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/fileupload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Try again");
                setLoading(false);
                return;
            }

            setupload(false);
            fileUrl = data.result.secure_url;
        }

        const res = await fetch("/api/assignments/create-assignment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...createform, fileUrl, classroomId }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || "Try again");
            setLoading(false);
            return;
        }

        setcreateform({ title: "", description: "", due_at: "" });
        setfile(null);
        setFileKey(k => k + 1);
        setSuccess("Assignment created successfully!");
        setLoading(false);
        setcreateAssignmentBox(false);
        router.refresh();
    };

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
            onClick={() => setcreateAssignmentBox(false)}
        >
            <Card
                className='w-full max-w-lg bg-white'
                onClick={(e) => e.stopPropagation()}
            >
                <CardHeader>
                    <CardTitle className='font-semibold'>Create Assignment</CardTitle>
                    <CardDescription>Fill up essential details of Assignment</CardDescription>
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
                            Upload File <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                            key={fileKey}
                            id='question-file'
                            type='file'
                            className='text-muted-foreground file:border-input file:text-foreground p-0 pr-3 italic file:mr-3 file:h-full file:border-0 file:border-r file:border-solid file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic'
                            onChange={(e) => setfile(e.target.files[0] || null)}
                        />
                        <p className='text-muted-foreground text-xs'>You can upload a file here (Max-10MB).</p>
                    </div>
                    {error && <p className='text-destructive text-sm'>{error}</p>}
                    {success && <p className='text-green-600 text-sm'>{success}</p>}
                </CardContent>
                <CardContent className='flex justify-end gap-2 max-sm:justify-center'>
                    <Button className='max-sm:flex-1' variant='outline' onClick={() => setcreateAssignmentBox(false)}>
                        Cancel
                    </Button>
                    <Button className='max-sm:flex-1' type='button' onClick={handleCreate} disabled={loading}>
                        {loading ? "Creating..." : "Create"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreateAssignment