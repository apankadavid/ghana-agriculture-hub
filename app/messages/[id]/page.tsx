import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import ConversationThread from "./conversation-thread";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) {
    redirect("/onboarding");
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      listing: true,
      owner: true,
      initiator: true,
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: true },
      },
    },
  });

  if (!conversation) {
    notFound();
  }

  if (conversation.ownerId !== profile.id && conversation.initiatorId !== profile.id) {
    redirect("/messages");
  }

  const otherParty =
    conversation.ownerId === profile.id ? conversation.initiator : conversation.owner;

  const initialMessages = conversation.messages.map((m) => ({
    id: m.id,
    content: m.content,
    senderId: m.senderId,
    senderName: m.sender.displayName,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/messages" className="text-xs text-green-700">
              ← Back to Messages
            </Link>
            <p className="text-sm font-medium mt-0.5">{otherParty.displayName}</p>
            <Link href={`/listings/${conversation.listing.id}`} className="text-xs text-gray-400">
              Re: {conversation.listing.title}
            </Link>
          </div>
        </div>
      </div>

      <ConversationThread
        conversationId={conversation.id}
        currentProfileId={profile.id}
        initialMessages={initialMessages}
      />
    </div>
  );
}