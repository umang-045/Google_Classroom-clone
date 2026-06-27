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
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return "";
  }
};
const Avatar = ({ sender, image }: { sender: string; image?: string }) => (
  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-medium text-xs shrink-0 overflow-hidden">
    {image?.trim() ? (
      <img src={image} alt="" className="w-full h-full object-cover" />
    ) : (
      classphoto(sender)
    )}
  </div>
);
const ChatMessage = ({ sender, message, isOwnMessage, timestamp, image }: ChatMessageProps) => {
  const isSystemMessage = sender === "system";

  return (
    <div className={`flex items-end gap-2 mb-3 w-68  ${isSystemMessage
        ? "justify-center"
        : isOwnMessage
          ? "justify-end flex-row-reverse ml-auto"
          : "justify-start"
      }`}>
      {!isSystemMessage && <Avatar sender={sender} image={image} />}

      <div className={`flex-1 max-w-xs  px-4 pt-2 rounded-lg ${isSystemMessage
          ? "bg-gray-800 text-white text-center text-xs"
          : isOwnMessage
            ? "bg-blue-500/60 text-white rounded-br-none"
            : "bg-white/80 text-black rounded-bl-none"
        }`}>
        {!isSystemMessage && <p className="text-sm font-bold">{sender}</p>}
        <p>{message}</p>
        {!isSystemMessage && timestamp && (
          <p className={`text-[10px] mt-1 text-right ${isOwnMessage ? "text-white" : "text-black"
            }`}>
            {formatTime(timestamp)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;