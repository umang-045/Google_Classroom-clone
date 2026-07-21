"use client"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { X, Upload, Loader2, ImagePlus } from "lucide-react"
import toast from "react-hot-toast"

interface EditPhotoProps {
  currentAvatar: string
  onClose: () => void
  onSuccess: (url: string) => void
}

const EditPhoto = ({ currentAvatar, onClose, onSuccess }: EditPhotoProps) => {
  const [mounted, setMounted] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Prevent SSR mismatch & block background scrolling
  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
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

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-6 pointer-events-auto"
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#151519] border border-white/10 p-8 shadow-2xl space-y-7 text-zinc-200 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white cursor-pointer transition-colors p-1 rounded-lg hover:bg-white/[0.06]"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 pl-0.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
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

        {/* Preview & File Picker */}
        <div className="flex flex-col items-center justify-center gap-5 py-2">
          <div className="relative size-28 rounded-full overflow-hidden border-2 border-white/10 bg-zinc-900 p-1 flex items-center justify-center shadow-2xl">
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
            className="h-10 px-4 rounded-xl border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors text-xs cursor-pointer"
          >
            <Upload className="mr-2 size-4 text-zinc-400" />
            Choose image file
          </Button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08] max-sm:flex-col-reverse">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isUploading}
            className="rounded-xl px-5 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white border-0 text-xs h-10 max-sm:w-full cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!file || isUploading}
            className="rounded-xl cursor-pointer px-5 bg-blue-600 hover:bg-blue-500 text-white font-medium border-0 text-xs h-10 max-sm:w-full disabled:opacity-50"
          >
            {isUploading && <Loader2 className="mr-2 size-3.5 animate-spin" />}
            {isUploading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default EditPhoto