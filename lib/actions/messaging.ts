"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { revalidatePath } from "next/cache";

export async function startConversation(listingId: string, firstMessage: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in." };
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) {
    return { error: "Complete your profile first." };
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { profile: true },
  });
  if (!listing) {
    return { error: "Listing not found." };
  }

  if (listing.profile.id === profile.id) {
    return { error: "You can't message yourself about your own listing." };
  }

  let conversation = await prisma.conversation.findUnique({
    where: {
      listingId_initiatorId: {
        listingId,
        initiatorId: profile.id,
      },
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        listingId,
        ownerId: listing.profile.id,
        initiatorId: profile.id,
      },
    });
  }

  if (firstMessage.trim()) {
    await sendMessageInternal(conversation.id, profile.id, firstMessage.trim());
  }

  return { success: true, conversationId: conversation.id };
}

async function sendMessageInternal(conversationId: string, senderId: string, content: string) {
  const message = await prisma.message.create({
    data: { conversationId, senderId, content },
    include: { sender: true },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  await pusherServer.trigger(
    `private-conversation-${conversationId}`,
    "new-message",
    {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      senderName: message.sender.displayName,
      createdAt: message.createdAt.toISOString(),
    }
  );

  if (conversation) {
    const recipientId =
      conversation.ownerId === senderId ? conversation.initiatorId : conversation.ownerId;
    await pusherServer.trigger(`private-inbox-${recipientId}`, "new-message-notification", {
      conversationId,
    });
  }

  return message;
}

export async function sendMessage(conversationId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in." };
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) {
    return { error: "Complete your profile first." };
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (
    !conversation ||
    (conversation.ownerId !== profile.id && conversation.initiatorId !== profile.id)
  ) {
    return { error: "Conversation not found or access denied." };
  }

  if (!content.trim()) {
    return { error: "Message cannot be empty." };
  }

  const message = await sendMessageInternal(conversationId, profile.id, content.trim());
  revalidatePath("/messages");

  return {
    success: true,
    message: {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      senderName: message.sender.displayName,
      createdAt: message.createdAt.toISOString(),
    },
  };
}

export async function markConversationRead(conversationId: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) return;

  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: profile.id },
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  revalidatePath("/messages");
}