"use client";

import React, { useState } from "react";

const ChatForm = ({onSendMessage,}: {onSendMessage: (message: string) => Promise<void>}) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed === "" || sending) return;

    setSending(true);
    
    try {
      await onSendMessage(trimmed);
      setMessage("");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={sending}
        className="flex-1 px-4 border-1 border-white/40 py-2 text-white/80 rounded-lg focus:outline-none disabled:opacity-50"
        placeholder="Type your message here..."
      />
      <button
        type="submit"
        disabled={sending}
        className="px-4 py-2 text-white rounded-lg bg-blue-500 disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send"}
      </button>
    </form>
  );
};

export default ChatForm;