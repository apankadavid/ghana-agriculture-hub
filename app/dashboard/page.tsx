import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CloudSun, Package } from "lucide-react";
import { geocode, getWeather, detectLocationFromIP, describeWeatherCode } from "@/lib/weather";
import LogoutButton from "./logout-button";
import ListingControls from "./listing-controls";

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

  const myListings = await prisma.listing.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  const activeCount = myListings.filter((l) => l.status === "ACTIVE").length;

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
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-lg font-semibold">
                {getGreeting()}, {profile.displayName}!
              </h1>
              <p className="text-gray-500 text-sm">
                {profile.role.replace("_", " ")} · {profile.region}
                {profile.city ? `, ${profile.city}` : ""}
              </p>
            </div>
            <LogoutButton />
          </div>
          <p className="text-xs text-gray-400 mt-2">Account email: {session.user.email}</p>
        </div>

        {weatherWidget && (
          <Link
            href="/weather"
            className="bg-white rounded-lg shadow p-4 flex items-center gap-3"
          >
            <CloudSun size={28} className="text-amber-500 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">{weatherWidget.temp}°C</p>
              <p className="text-xs text-gray-500">
                {weatherWidget.city} · {weatherWidget.condition}
              </p>
            </div>
            <span className="text-xs text-green-700 font-medium">View Weather →</span>
          </Link>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <Package size={20} className="text-green-700 mx-auto mb-1" />
            <p className="text-xl font-bold">{activeCount}</p>
            <p className="text-xs text-gray-400">Active Listings</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <Package size={20} className="text-green-700 mx-auto mb-1" />
            <p className="text-xl font-bold">{myListings.length}</p>
            <p className="text-xs text-gray-400">Total Listings</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium text-sm">My Listings</h2>
            <Link href="/listings/new" className="text-xs text-green-700 font-medium">
              + New Listing
            </Link>
          </div>

          {myListings.length === 0 ? (
            <p className="text-sm text-gray-400">You haven&apos;t posted any listings yet.</p>
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
                      {listing.price && (
                        <p className="text-xs text-green-700">
                          GHS {listing.price.toString()}
                          {listing.priceUnit ? ` / ${listing.priceUnit}` : ""}
                        </p>
                      )}
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
      </div>
    </div>
  );
}