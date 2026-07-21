"use client"

import React from "react"
import { classphoto } from "../ClassroomCard"

interface ChatMessageProps {
  sender: string
  message: string
  isOwnMessage: boolean
  timestamp?: string
  image?: string
}

const formatTime = (isoString?: string) => {
  if (!isoString) return ""

  try {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return ""
  }
}

const getInitials = (name: string) => {
  if (!name) return "?"
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

const Avatar = ({ sender, image }: { sender: string; image?: string }) => (
  <div className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 overflow-hidden rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-xs font-semibold text-sky-400 select-none">
    {image?.trim() ? (
      <img
        src={image}
        alt={sender}
        className="h-full w-full object-cover"
      />
    ) : typeof classphoto === "function" ? (
      classphoto(sender)
    ) : (
      getInitials(sender)
    )}
  </div>
)

const ChatMessage = ({
  sender,
  message,
  isOwnMessage,
  timestamp,
  image,
}: ChatMessageProps) => {
  const isSystemMessage = sender?.toLowerCase() === "system"

  if (isSystemMessage) {
    return (
      <div className="flex w-full justify-center my-2">
        <span className="rounded-full bg-zinc-800/80 border border-zinc-700/60 px-3 py-1 text-[10px] sm:text-[11px] font-medium text-zinc-400 tracking-wide text-center">
          {message}
        </span>
      </div>
    )
  }

  return (
    <div
      className={`flex w-full items-end gap-2 my-1 ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      {!isOwnMessage && <Avatar sender={sender} image={image} />}

      {/* COMPACT FIXED WIDTH: w-48 (~192px) on mobile, w-56 (~224px) on desktop */}
      <div className="w-48 sm:w-56 shrink-0">
        <div
          className={`relative w-full rounded-2xl px-3 py-2 transition-all duration-200 ${
            isOwnMessage
              ? "rounded-br-xs bg-sky-600/90 text-white shadow-sm shadow-sky-600/10"
              : "rounded-bl-xs bg-zinc-800/90 border border-zinc-700/60 text-zinc-100 shadow-sm"
          }`}
        >
          {!isOwnMessage && (
            <p className="text-[10px] font-semibold text-sky-400 mb-0.5 truncate">
              {sender}
            </p>
          )}

          <p className="whitespace-pre-wrap break-words text-xs leading-snug">
            {message}
          </p>

          {timestamp && (
            <p
              className={`mt-1 text-[9px] text-right font-medium leading-none ${
                isOwnMessage ? "text-sky-200/80" : "text-zinc-400"
              }`}
            >
              {formatTime(timestamp)}
            </p>
          )}
        </div>
      </div>

      {isOwnMessage && <Avatar sender={sender} image={image} />}
    </div>
  )
}

export default ChatMessage