"use client";

import PusherClient from "pusher-js";

const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

export const pusherClient =
  key && cluster
    ? new PusherClient(key, {
        channelAuthorization: {
          endpoint: "/api/pusher/auth",
          transport: "ajax",
        },
        cluster,
      })
    : null;