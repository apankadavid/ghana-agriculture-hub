"use client";

import { useState, useEffect, useRef } from "react";
import { pusherClient } from "@/lib/pusher-client";
import { sendMessage, markConversationRead } from "@/lib/actions/messaging";

type Message = {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  createdAt: string;
};

export default function ConversationThread({
  conversationId,
  currentProfileId,
  initialMessages,
}: {
  conversationId: string;
  currentProfileId: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markConversationRead(conversationId);

    const channel = pusherClient.subscribe(`private-conversation-${conversationId}`);

    channel.bind("new-message", (data: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
      if (data.senderId !== currentProfileId) {
        markConversationRead(conversationId);
      }
    });

    return () => {
      pusherClient.unsubscribe(`private-conversation-${conversationId}`);
    };
  }, [conversationId, currentProfileId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!draft.trim()) return;
    setSending(true);
    const content = draft;
    setDraft("");
    await sendMessage(conversationId, content);
    setSending(false);
  }

  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-4">
      <div className="flex-1 space-y-3 overflow-y-auto mb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.senderId === currentProfileId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                m.senderId === currentProfileId
                  ? "bg-green-700 text-white"
                  : "bg-white border"
              }`}
            >
              <p>{m.content}</p>
              <p
                className={`text-[10px] mt-1 ${
                  m.senderId === currentProfileId ? "text-green-200" : "text-gray-400"
                }`}
              >
                {new Date(m.createdAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleSend}
          disabled={sending}
          className="bg-green-700 text-white rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}