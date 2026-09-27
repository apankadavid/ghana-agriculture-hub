import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) {
    return NextResponse.json({ error: "No profile" }, { status: 403 });
  }

  const formData = await req.formData();
  const socketId = formData.get("socket_id") as string;
  const channel = formData.get("channel_name") as string;

  if (!socketId || !channel) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  if (channel.startsWith("private-conversation-")) {
    const conversationId = channel.replace("private-conversation-", "");
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (
      !conversation ||
      (conversation.ownerId !== profile.id && conversation.initiatorId !== profile.id)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } else if (channel.startsWith("private-inbox-")) {
    const channelProfileId = channel.replace("private-inbox-", "");
    if (channelProfileId !== profile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } else {
    return NextResponse.json({ error: "Unknown channel" }, { status: 403 });
  }

  const authResponse = pusherServer.authorizeChannel(socketId, channel);
  return NextResponse.json(authResponse);
}