"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Upload, Loader2, ImagePlus } from "lucide-react"
import toast from "react-hot-toast"

interface EditPhotoProps {
  currentAvatar: string
  onClose: () => void
  onSuccess: (url: string) => void
}

const EditPhoto = ({ currentAvatar, onClose, onSuccess }: EditPhotoProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleFileSelect = (selected: File | null) => {
    if (!selected) return
    if (!selected.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    if (selected.size > 10 * 1024 * 1024) {
      toast.error("File too large, max 10MB")
      return
    }
    setFile(selected)
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setPreview(URL.createObjectURL(selected))
  }

  const handleSave = async () => {
    if (!file) return
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const uploadRes = await fetch("/api/fileupload", {
        method: "POST",
        body: formData,
      })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.message || "Upload failed")

      const imageUrl = uploadData.result.secure_url

      const updateRes = await fetch("/api/edituserinfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageUrl }),
      })
      const updateData = await updateRes.json()
      if (!updateRes.ok) throw new Error(updateData.message || "Failed to update profile")

      toast.success("Profile photo updated!")
      onSuccess(imageUrl)
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        style={{ background: 'linear-gradient(to top, #27272a, #151519)' }}
        className="relative w-full max-w-md rounded-xl border border-zinc-800/80 p-8 shadow-2xl space-y-7 animate-in fade-in-50 zoom-in-95 duration-150 text-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
 
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-red-400 cursor-pointer transition-colors"
        >
          <X size={20} />
        </button>

      
        <div className="flex items-center gap-4 pl-0.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800/70 text-cyan-400 border border-zinc-700/60 shadow-inner">
            <ImagePlus size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-2xl tracking-tight text-white">
              Update Profile Photo
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Upload a personalized avatar image up to 10MB
            </p>
          </div>
        </div>

      
        <div className="flex flex-col items-center justify-center gap-5 py-2">
          <div className="relative size-28 rounded-full overflow-hidden border-2 border-zinc-700/80 bg-zinc-900/60 p-1 flex items-center justify-center shadow-2xl">
            {preview || currentAvatar?.startsWith("http") ? (
              <img
                src={preview !== null ? preview : currentAvatar}
                alt="avatar preview"
                className="size-full rounded-full object-cover"
              />
            ) : (
              <ImagePlus className="size-8 text-zinc-600" />
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />

          <Button
            type="button"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            className="h-10 px-4 rounded-md border border-zinc-700 bg-zinc-900/20 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-xs"
          >
            <Upload className="mr-2 size-4 text-zinc-400" />
            Choose image file
          </Button>
        </div>

       
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/60 max-sm:flex-col-reverse">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isUploading}
            className="rounded-md px-5 bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white border-0 text-xs h-10 max-sm:w-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!file || isUploading}
            className="rounded-md cursor-pointer px-5 bg-blue-700 hover:bg-blue-800 text-white font-medium border-0 text-xs h-10 max-sm:w-full"
          >
            {isUploading && <Loader2 className="mr-2 size-3.5 animate-spin" />}
            {isUploading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditPhoto