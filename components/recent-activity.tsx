import { prisma } from "@/lib/prisma";
import Link from "next/link";

const TYPE_ICON: Record<string, string> = {
  NEW_FAVORITE: "♥",
  NEW_MESSAGE: "💬",
  NEW_JOB_APPLICATION: "📋",
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

export default async function RecentActivity({ profileId }: { profileId: string }) {
  const activities = await prisma.activity.findMany({
    where: { profileId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-medium text-sm mb-3">Recent Activity</h3>
      {activities.length === 0 ? (
        <p className="text-sm text-gray-400">No activity yet.</p>
      ) : (
        <div className="space-y-3">
          {activities.map((a) => (
            <Link
              key={a.id}
              href={a.listingId ? `/listings/${a.listingId}` : "#"}
              className="flex items-start gap-2 text-sm"
            >
              <span>{TYPE_ICON[a.type] ?? "•"}</span>
              <div>
                <p className="text-gray-700">{a.message}</p>
                <p className="text-xs text-gray-400">{timeAgo(a.createdAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}