"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startConversation } from "@/lib/actions/messaging";

export default function MessageButton({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    setLoading(true);
    setError(null);
    const result = await startConversation(listingId, message);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push(`/messages/${result.conversationId}`);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="border border-green-700 text-green-700 rounded px-4 py-2 text-sm font-medium"
      >
        Message Seller
      </button>
    );
  }

  return (
    <div className="border rounded p-3 mt-2">
      {error && (
        <p className="text-xs text-red-600 mb-2">{error}</p>
      )}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={2}
        placeholder="Hi, I'm interested in this listing..."
        className="w-full border rounded px-2 py-1.5 text-sm mb-2"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-green-700 text-white rounded px-4 py-1.5 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="text-sm text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}