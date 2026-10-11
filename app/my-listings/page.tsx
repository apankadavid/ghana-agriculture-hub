import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import ListingControls from "@/app/dashboard/listing-controls";

const PAGE_SIZE = 10;

export default async function MyListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
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

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where: { profileId: profile.id },
      include: { _count: { select: { views: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.listing.count({ where: { profileId: profile.id } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Deleting the last listing on a page leaves that page empty; step back.
  if (listings.length === 0 && total > 0) {
    redirect(`/my-listings?page=${totalPages}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="text-sm text-green-700">
          ← Back to Dashboard
        </Link>

        <div className="flex justify-between items-baseline mt-2 mb-1">
          <h1 className="text-2xl font-semibold">My Listings</h1>
          <Link href="/listings/new" className="text-sm text-green-700 font-medium">
            + New Listing
          </Link>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          {total} {total === 1 ? "listing" : "listings"} in total.
        </p>

        {listings.length === 0 ? (
          <p className="text-gray-500">You haven&apos;t posted any listings yet.</p>
        ) : (
          <div className="bg-white rounded-lg shadow p-4 space-y-3">
            {listings.map((listing) => (
              <div key={listing.id} className="border rounded p-3">
                <Link
                  href={`/listings/${listing.id}`}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{listing.title}</p>
                    <div className="flex items-center gap-2">
                      {listing.price && (
                        <p className="text-xs text-green-700">
                          GHS {listing.price.toString()}
                          {listing.priceUnit ? ` / ${listing.priceUnit}` : ""}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        · {listing._count.views} views
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2 py-1 rounded ${
                      listing.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {listing.status}
                  </span>
                </Link>
                <ListingControls listingId={listing.id} currentStatus={listing.status} />
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            {page > 1 ? (
              <Link
                href={`/my-listings?page=${page - 1}`}
                className="border rounded px-4 py-2 text-sm font-medium bg-white"
              >
                Previous
              </Link>
            ) : (
              <span className="border rounded px-4 py-2 text-sm font-medium text-gray-300">
                Previous
              </span>
            )}

            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>

            {page < totalPages ? (
              <Link
                href={`/my-listings?page=${page + 1}`}
                className="border rounded px-4 py-2 text-sm font-medium bg-white"
              >
                Next
              </Link>
            ) : (
              <span className="border rounded px-4 py-2 text-sm font-medium text-gray-300">
                Next
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}