import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CloudSun, Package, PlusCircle, Search, Briefcase, BookOpen } from "lucide-react";
import { geocode, getWeather, detectLocationFromIP, describeWeatherCode } from "@/lib/weather";
import ListingControls from "./listing-controls";
import RecentActivity from "@/components/recent-activity";
import DashboardSidebar from "@/components/dashboard-sidebar";
import DashboardTopbar from "@/components/dashboard-topbar";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
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

  const [myListings, totalViews, unreadCount, favoritesCount, latestArticle] =
    await Promise.all([
      prisma.listing.findMany({
        where: { profileId: profile.id },
        include: { _count: { select: { views: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.listingView.count({ where: { listing: { profileId: profile.id } } }),
      prisma.message.count({
        where: {
          readAt: null,
          senderId: { not: profile.id },
          conversation: { OR: [{ ownerId: profile.id }, { initiatorId: profile.id }] },
        },
      }),
      prisma.favorite.count({ where: { profileId: profile.id } }),
      prisma.article.findFirst({
        where: { published: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const activeCount = myListings.filter((l) => l.status === "ACTIVE").length;

  const productAgg = await prisma.listing.aggregate({
    where: { status: "ACTIVE", category: "PRODUCT", price: { not: null } },
    _avg: { price: true },
  });
  const productSupply = await prisma.listing.count({
    where: { status: "ACTIVE", category: "PRODUCT", type: "OFFER" },
  });
  const productDemand = await prisma.listing.count({
    where: { status: "ACTIVE", category: "PRODUCT", type: "REQUEST" },
  });

  let weatherWidget: { city: string; temp: number; condition: string } | null = null;
  try {
    const location = (await detectLocationFromIP()) || profile.region;
    const place = await geocode(location);
    if (place) {
      const weather = await getWeather(place.latitude, place.longitude);
      weatherWidget = {
        city: place.name,
        temp: Math.round(weather.current.temperature_2m),
        condition: describeWeatherCode(weather.current.weather_code),
      };
    }
  } catch {
    weatherWidget = null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar
          displayName={profile.displayName}
          role={profile.role.replace("_", " ")}
          unreadCount={unreadCount}
        />

        <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4">
          <div className="bg-white rounded-lg shadow p-5 flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold">
                {getGreeting()}, {profile.displayName}!
              </h1>
              <p className="text-gray-500 text-sm">
                Here&apos;s what&apos;s happening with your account today.
              </p>
            </div>
            {weatherWidget && (
              <Link
                href="/weather"
                className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2"
              >
                <CloudSun size={28} className="text-amber-500" />
                <div>
                  <p className="font-semibold">{weatherWidget.temp}°C</p>
                  <p className="text-xs text-gray-500">
                    {weatherWidget.city} · {weatherWidget.condition}
                  </p>
                </div>
                <span className="text-xs text-green-700 font-medium ml-2">
                  View Weather →
                </span>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <Package size={20} className="text-green-700 mx-auto mb-1" />
              <p className="text-xl font-bold">{activeCount}</p>
              <p className="text-xs text-gray-400">Active Listings</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <Search size={20} className="text-green-700 mx-auto mb-1" />
              <p className="text-xl font-bold">{totalViews}</p>
              <p className="text-xs text-gray-400">Total Views</p>
            </div>
            <Link href="/messages" className="bg-white rounded-lg shadow p-4 text-center">
              <Briefcase size={20} className="text-green-700 mx-auto mb-1" />
              <p className="text-xl font-bold">{unreadCount}</p>
              <p className="text-xs text-gray-400">Unread Messages</p>
            </Link>
            <Link href="/favorites" className="bg-white rounded-lg shadow p-4 text-center">
              <Package size={20} className="text-green-700 mx-auto mb-1" />
              <p className="text-xl font-bold">{favoritesCount}</p>
              <p className="text-xs text-gray-400">Favorite Listings</p>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div id="listings" className="lg:col-span-2 bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-medium text-sm">My Listings</h2>
                <Link href="/listings/new" className="text-xs text-green-700 font-medium">
                  + New Listing
                </Link>
              </div>

              {myListings.length === 0 ? (
                <p className="text-sm text-gray-400">
                  You haven&apos;t posted any listings yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {myListings.map((listing) => (
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
            </div>

            <div className="bg-green-50 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-medium text-sm mb-1">Need to post a listing?</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Reach thousands of buyers, suppliers and service providers across
                  Ghana&apos;s agricultural ecosystem.
                </p>
              </div>
              <Link
                href="/listings/new"
                className="flex items-center justify-center gap-1.5 bg-green-700 text-white rounded py-2 text-sm font-medium"
              >
                <PlusCircle size={16} /> Create Listing
              </Link>
            </div>
          </div>

          <RecentActivity profileId={profile.id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium text-sm mb-2">Market Insights — Products</h3>
              {productAgg._avg.price ? (
                <>
                  <p className="text-[11px] text-gray-400">Avg. Asking Price</p>
                  <p className="text-lg font-semibold mb-2">
                    GHS {Math.round(Number(productAgg._avg.price))} / MT
                  </p>
                  <div className="flex gap-6 text-xs text-gray-500">
                    <span>Supply: {productSupply} listings</span>
                    <span>Demand: {productDemand} listings</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400">
                  Not enough product listings yet for insights.
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium text-sm mb-2">Featured Knowledge</h3>
              {latestArticle ? (
                <Link href={`/knowledge/${latestArticle.slug}`} className="block">
                  <p className="text-sm font-medium">{latestArticle.title}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {latestArticle.excerpt}
                  </p>
                  <span className="text-xs text-green-700 font-medium mt-2 inline-flex items-center gap-1">
                    <BookOpen size={12} /> Read Article →
                  </span>
                </Link>
              ) : (
                <p className="text-sm text-gray-400">No articles published yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}