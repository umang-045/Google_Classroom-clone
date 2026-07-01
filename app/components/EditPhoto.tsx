"use client"
import { useState, useRef, useEffect } from "react"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-black/80">Update profile photo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black cursor-pointer">
            <X className="size-4 text-red-400" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="size-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {preview || currentAvatar.startsWith("http") ? (
              <img
                src={preview !== null ? preview : currentAvatar}
                alt="avatar preview"
                className="size-full object-cover"
              />
            ) : (
              <ImagePlus className="size-8 text-gray-400" />
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-black cursor-pointer hover:bg-gray-50"
          >
            <Upload className="size-4" />
            Choose image
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-2 ">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="rounded-md px-3 py-1.5 bg-gray-100 text-sm cursor-pointer hover:bg-gray-100 text-red-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!file || isUploading}
            className="flex items-center gap-2 rounded-md bg-black px-3 py-1.5 text-sm text-white cursor-pointer "
          >
            {isUploading && <Loader2 className="size-4 animate-spin" />}
            {isUploading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditPhoto