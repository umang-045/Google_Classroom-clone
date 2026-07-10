"use client";

import React, { useState } from "react";
import { SendHorizonal } from "lucide-react";

const ChatForm = ({
  onSendMessage,
}: {
  onSendMessage: (message: string) => Promise<void>;
}) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const trimmed = message.trim();

    if (!trimmed || sending) return;

    setSending(true);

    try {
      await onSendMessage(trimmed);
      setMessage("");
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-end gap-2"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={sending}
        placeholder="Type your message..."
        className="flex-1 min-w-0 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 md:text-base"
      />

      <button
        type="submit"
        disabled={sending}
        className="flex h-11 shrink-0 items-center justify-center rounded-xl bg-blue-500 px-4 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? (
          <span className="text-sm">Sending...</span>
        ) : (
          <>
            <SendHorizonal className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:block">Send</span>
          </>
        )}
      </button>
    </form>
  );
};

export default ChatForm;