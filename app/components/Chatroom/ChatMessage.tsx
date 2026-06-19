import React from "react";

interface ChatMessageProps {
  sender: string;
  message: string;
  isOwnMessage: boolean;
  timestamp?: string;
}

const ChatMessage = ({ sender, message, isOwnMessage,timestamp }: ChatMessageProps) => {
  const isSystemMessage = sender === "system";
  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "";
    }
  };
  return (
    <div className={`flex ${
        isSystemMessage
          ? "justify-center"
          : isOwnMessage
          ? "justify-end"
          : "justify-start"
      } mb-3`}
    >
      <div
        className={`max-w-xs min-w-[250px] px-4 pt-2 rounded-lg ${
          isSystemMessage
            ? "bg-gray-800 text-white text-center text-xs"
            : isOwnMessage
            ? "bg-blue-500/60 text-white"
            : "bg-white/80 text-black"
        }`}
      >
        {!isSystemMessage && <p className="text-sm font-bold">{sender}</p>}
        <p>{message}</p>
        {!isSystemMessage && timestamp && (
          <p className={`text-[10px] mt-1  text-right ${
            isOwnMessage ? "text-white" : "text-black"
          }`}>
            {formatTime(timestamp)}
          </p>
          )}
      </div>
    </div>
  );
};

export default ChatMessage;