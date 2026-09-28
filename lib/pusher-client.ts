"use client";

import PusherClient from "pusher-js";

let client: PusherClient | null = null;

export function getPusherClient(key?: string, cluster?: string) {
  if (!key || !cluster) return null;

  if (!client) {
    client = new PusherClient(key, {
      channelAuthorization: {
        endpoint: "/api/pusher/auth",
        transport: "ajax",
      },
      cluster,
    });
  }

  return client;
}
