"use client";

import { useEffect } from "react";

export default function ViewTracker({ listingId }: { listingId: string }) {
  useEffect(() => {
    fetch("/api/listings/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    }).catch(() => {
      // Best-effort tracking; a failed view-count ping shouldn't disrupt the page
    });
  }, [listingId]);

  return null;
}