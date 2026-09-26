import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import FavoriteButton from "@/components/favorite-button";

export default async function FavoritesPage() {
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

  const favorites = await prisma.favorite.findMany({
    where: { profileId: profile.id },
    include: {
      listing: {
        include: {
          profile: true,
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1">My Favorites</h1>
        <p className="text-gray-500 text-sm mb-6">Listings you&apos;ve saved.</p>

        {favorites.length === 0 ? (
          <p className="text-gray-500">
            You haven&apos;t saved any listings yet. Browse the{" "}
            <Link href="/marketplace" className="text-green-700 font-medium">
              marketplace
            </Link>{" "}
            and tap the heart on anything you want to save.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favorites.map((fav) => (
              <Link
                key={fav.id}
                href={`/listings/${fav.listing.id}`}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition"
              >
                <div className="relative">
                  {fav.listing.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={fav.listing.images[0].url}
                      alt={fav.listing.title}
                      className="w-full h-36 object-contain bg-gray-100"
                    />
                  )}
                  <div className="absolute top-2 right-2">
                    <FavoriteButton
                      listingId={fav.listing.id}
                      initiallyFavorited={true}
                      loggedIn={true}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{fav.listing.title}</h3>
                  {fav.listing.price && (
                    <p className="text-green-700 font-medium text-sm mt-1">
                      GHS {fav.listing.price.toString()}
                      {fav.listing.priceUnit ? ` / ${fav.listing.priceUnit}` : ""}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">
                    {fav.listing.profile.displayName}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}