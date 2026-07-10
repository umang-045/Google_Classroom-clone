import React from "react";
import { classphoto } from "../ClassroomCard";

interface ChatMessageProps {
  sender: string;
  message: string;
  isOwnMessage: boolean;
  timestamp?: string;
  image?: string;
}

const formatTime = (isoString?: string) => {
  if (!isoString) return "";

  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const Avatar = ({
  sender,
  image,
}: {
  sender: string;
  image?: string;
}) => (
  <div className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 overflow-hidden rounded-full bg-gray-400 flex items-center justify-center text-xs font-medium text-white">
    {image?.trim() ? (
      <img
        src={image}
        alt={sender}
        className="h-full w-full object-cover"
      />
    ) : (
      classphoto(sender)
    )}
  </div>
);

const ChatMessage = ({
  sender,
  message,
  isOwnMessage,
  timestamp,
  image,
}: ChatMessageProps) => {
  const isSystemMessage = sender === "system";

  return (
  <div
    className={`flex w-full items-end gap-2 ${
      isSystemMessage
        ? "justify-center"
        : isOwnMessage
        ? "justify-end"
        : "justify-start"
    }`}
  >
    {!isSystemMessage && !isOwnMessage && (
      <Avatar sender={sender} image={image} />
    )}

    <div className="flex flex-col">
      <div
        className={`inline-block w-fit min-w-[120px] max-w-[88vw] sm:max-w-[80%] md:max-w-[20rem] rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2 break-words ${
          isSystemMessage
            ? "bg-gray-800 text-center text-xs text-white"
            : isOwnMessage
            ? "rounded-br-none bg-blue-500/70 text-white"
            : "rounded-bl-none bg-white/90 text-black"
        }`}
      >
        {!isSystemMessage && (
          <p className="truncate text-xs font-semibold">
            {sender}
          </p>
        )}

        <p className="mt-0.5 whitespace-pre-wrap break-words text-sm leading-5">
          {message}
        </p>

        {!isSystemMessage && timestamp && (
          <p
            className={`mt-1 text-right text-[9px] ${
              isOwnMessage ? "text-white/80" : "text-black/60"
            }`}
          >
            {formatTime(timestamp)}
          </p>
        )}
      </div>
    </div>

    {!isSystemMessage && isOwnMessage && (
      <Avatar sender={sender} image={image} />
    )}
  </div>
);
};

export default ChatMessage;