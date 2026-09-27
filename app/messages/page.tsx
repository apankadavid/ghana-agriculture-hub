import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MessagesInboxPage() {
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

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ ownerId: profile.id }, { initiatorId: profile.id }],
    },
    include: {
      listing: true,
      owner: true,
      initiator: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: {
        select: {
          messages: {
            where: { readAt: null, senderId: { not: profile.id } },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Messages</h1>

        {conversations.length === 0 ? (
          <p className="text-gray-500">
            No conversations yet. Message a seller from a listing to start one.
          </p>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y">
            {conversations.map((conv) => {
              const otherParty =
                conv.ownerId === profile.id ? conv.initiator : conv.owner;
              const unread = conv._count.messages;

              return (
                <Link
                  key={conv.id}
                  href={`/messages/${conv.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {otherParty.displayName} · {conv.listing.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {conv.messages[0]?.content ?? "No messages yet"}
                    </p>
                  </div>
                  {unread > 0 && (
                    <span className="bg-green-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0 ml-2">
                      {unread}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}