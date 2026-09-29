"use client";

import { useState, useEffect, useRef } from "react";
import { getPusherClient } from "@/lib/pusher-client";
import { sendMessage, markConversationRead } from "@/lib/actions/messaging";

type LiveStatus = "unavailable" | "connecting" | "connected" | "error";

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
  pusherKey,
  pusherCluster,
}: {
  conversationId: string;
  currentProfileId: string;
  initialMessages: Message[];
  pusherKey?: string;
  pusherCluster?: string;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [liveStatus, setLiveStatus] = useState<LiveStatus>(
    pusherKey && pusherCluster ? "connecting" : "unavailable"
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markConversationRead(conversationId);

  const client = getPusherClient(pusherKey, pusherCluster);
    if (!client) return;

    const channel = client.subscribe(`private-conversation-${conversationId}`);

    channel.bind("pusher:subscription_succeeded", () => setLiveStatus("connected"));
    channel.bind("pusher:subscription_error", () => setLiveStatus("error"));

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
      client.unsubscribe(`private-conversation-${conversationId}`);
    };
    }, [conversationId, currentProfileId, pusherKey, pusherCluster]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!draft.trim()) return;
    setSending(true);
    const content = draft;
    setDraft("");
    const result = await sendMessage(conversationId, content);
    if (result.success && result.message) {
      const sent = result.message;
      setMessages((prev) => (prev.some((m) => m.id === sent.id) ? prev : [...prev, sent]));
    }
    setSending(false);
  }

  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-4">
      {process.env.NODE_ENV === "production" && (
        <p className="text-[10px] text-gray-300 mb-1">
          debug: key={pusherKey ? "present" : "missing"}, cluster={pusherCluster || "missing"}
        </p>
      )}
      <p
        className={`text-[11px] mb-2 ${
          liveStatus === "connected" ? "text-green-700" : "text-amber-600"
        }`}
      >
        {liveStatus === "connected" && "● Live updates on"}
        {liveStatus === "connecting" && "○ Connecting to live updates..."}
        {liveStatus === "unavailable" &&
          "Live updates unavailable. Refresh to see new messages."}
        {liveStatus === "error" &&
          "Live updates couldn't connect. Refresh to see new messages."}
      </p>
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