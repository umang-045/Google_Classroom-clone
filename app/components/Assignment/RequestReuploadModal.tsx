"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface RequestReuploadModalProps {
    classroomId: number
    assignmentId: number
    onClose: () => void
    onSuccess: () => void
}

export default function RequestReuploadModal({
    classroomId,
    assignmentId,
    onClose,
    onSuccess,
}: RequestReuploadModalProps) {
    const [reason, setReason] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!reason.trim()) {
            setError("Please provide a reason for requesting a re-upload.")
            return
        }

        try {
            setLoading(true)
            const res = await fetch(`/api/assignments/${classroomId}/${assignmentId}/request-reupload`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Failed to submit request")
            }

            setSuccess("Request submitted successfully!")
            setTimeout(() => {
                onSuccess()
                onClose()
            }, 1200)
        } catch (err: any) {
            setError(err.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md bg-zinc-900 border-white/10 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/10">
                    <CardTitle className="text-base font-semibold text-white">
                        Request Re-upload Permission
                    </CardTitle>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white transition-colors text-lg leading-none"
                    >
                        ✕
                    </button>
                </CardHeader>

                <CardContent className="pt-4 space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="reason" className="text-xs text-white/80">
                                Reason for request *
                            </Label>
                            <textarea
                                id="reason"
                                rows={4}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Explain why you need to re-upload or make a late submission..."
                                className="w-full rounded-md bg-white/5 border border-white/20 p-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-[11px] font-medium">{error}</p>
                        )}
                        {success && (
                            <p className="text-green-400 text-[11px] font-medium">{success}</p>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={loading}
                                className="text-xs h-8 border-white/20 text-white hover:bg-white/10 bg-transparent"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 font-medium transition-colors"
                            >
                                {loading ? "Submitting..." : "Send Request"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}