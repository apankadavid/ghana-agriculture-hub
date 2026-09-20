import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Wheat,
  Package,
  Tractor,
  Wrench,
  Briefcase,
  ShoppingCart,
  Tag,
  Key,
  Handshake,
  BookOpen,
  Link2,
  CheckCircle,
  MapPin,
  Heart,
  ArrowRight,
  Search,
  Folder,
  Wheat as WheatMark,
  Users,
  LayoutGrid,
  Globe2,
  Cloud,
  CloudRain,
  CloudSun,
  Sun,
  TrendingUp,
} from "lucide-react";
import {
  geocode,
  getWeather,
  detectLocationFromIP,
  describeWeatherCode,
} from "@/lib/weather";

const CATEGORIES = [
  { value: "PRODUCT", label: "Agricultural Products", Icon: Wheat },
  { value: "INPUT", label: "Inputs & Supplies", Icon: Package },
  { value: "MACHINERY", label: "Machinery & Equipment", Icon: Tractor },
  { value: "SERVICE", label: "Services", Icon: Wrench },
  { value: "JOB", label: "Jobs", Icon: Briefcase },
];
const GHANA_REGIONS = [
  "Ahafo",
  "Ashanti",
  "Bono",
  "Bono East",
  "Central",
  "Eastern",
  "Greater Accra",
  "North East",
  "Northern",
  "Oti",
  "Savannah",
  "Upper East",
  "Upper West",
  "Volta",
  "Western",
  "Western North",
];

const QUICK_ACTIONS = [
  { label: "Buy", Icon: ShoppingCart },
  { label: "Sell", Icon: Tag },
  { label: "Rent", Icon: Key },
  { label: "Hire", Icon: Handshake },
  { label: "Learn", Icon: BookOpen },
  { label: "Connect", Icon: Link2 },
  { label: "Decide", Icon: CheckCircle },
];
function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function weatherIcon(code: number) {
  if (code === 0 || code === 1) return Sun;
  if (code === 2) return CloudSun;
  if (code >= 51) return CloudRain;
  return Cloud;
}

export default async function HomePage() {
  const [featuredListings, userCount, listingCount, regionsRaw, categoriesRaw] =
    await Promise.all([
      prisma.listing.findMany({
        where: { status: "ACTIVE" },
        include: { profile: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.user.count(),
      prisma.listing.count({ where: { status: "ACTIVE" } }),
      prisma.listing.findMany({
        where: { status: "ACTIVE" },
        select: { region: true },
        distinct: ["region"],
      }),
      prisma.listing.findMany({
        where: { status: "ACTIVE" },
        select: { category: true },
        distinct: ["category"],
      }),
    ]);

  const regionCount = regionsRaw.length;
  const categoryCount = categoriesRaw.length;

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

  let weatherWidget: {
    city: string;
    temp: number;
    condition: string;
    humidity: number;
    wind: number;
    precipitation: number;
    daily: {
      date: string;
      high: number;
      low: number;
      code: number;
    }[];
  } | null = null;

  try {
    const location = (await detectLocationFromIP()) || "Accra";
    const place = await geocode(location);
    if (place) {
      const weather = await getWeather(place.latitude, place.longitude);
      weatherWidget = {
        city: place.name,
        temp: Math.round(weather.current.temperature_2m),
        condition: describeWeatherCode(weather.current.weather_code),
        humidity: weather.current.relative_humidity_2m,
        wind: Math.round(weather.current.wind_speed_10m),
        precipitation: weather.daily.precipitation_probability_max[0] ?? 0,
        daily: weather.daily.time.slice(0, 5).map((date, i) => ({
          date,
          high: Math.round(weather.daily.temperature_2m_max[i]),
          low: Math.round(weather.daily.temperature_2m_min[i]),
          code: weather.daily.weather_code[i],
        })),
      };
    }
  } catch {
    weatherWidget = null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="relative bg-green-900 text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1600&auto=format&fit=crop"
          alt="Farmer in a field"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="flex justify-between items-start gap-8 mb-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-5">
                <WheatMark size={18} className="text-amber-400" />
                <span className="text-amber-300 text-sm font-medium tracking-wide">
                  Ghana&apos;s Agricultural Marketplace
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
                Everything Agriculture.
                <br />
                <span className="text-green-400">One Place.</span>
              </h1>
              <p className="text-green-100">
                Connect with farmers, buyers, suppliers and service providers
                across Ghana&apos;s agricultural ecosystem.
              </p>
            </div>

            {weatherWidget && (
              <div className="hidden md:block bg-black/30 backdrop-blur border border-white/10 rounded-lg p-4 w-56 shrink-0">
                <p className="text-2xl font-semibold">{weatherWidget.temp}°C</p>
                <p className="text-sm text-green-100 flex items-center gap-1 mb-1">
                  <MapPin size={14} /> {weatherWidget.city}, Ghana
                </p>
                <p className="text-sm text-green-100 mb-3">
                  {weatherWidget.condition}
                </p>
                <Link
                  href="/weather"
                  className="text-xs font-medium text-green-300"
                >
                  View Forecast →
                </Link>
              </div>
            )}
          </div>

          <form
            action="/marketplace"
            className="flex flex-col sm:flex-row gap-2 bg-white rounded-lg p-2 mb-6 text-gray-900 max-w-4xl"
          >
            <div className="flex-1 flex items-center gap-2 px-2">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                name="q"
                placeholder="Search for products, machinery, services, jobs..."
                className="w-full py-2.5 outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-1.5 px-2 border-t sm:border-t-0 sm:border-l">
              <Folder size={16} className="text-gray-400 shrink-0" />
              <select
                name="category"
                defaultValue=""
                className="py-2.5 outline-none text-sm bg-transparent"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 px-2 border-t sm:border-t-0 sm:border-l">
              <MapPin size={16} className="text-gray-400 shrink-0" />
              <select
                name="region"
                defaultValue=""
                className="py-2.5 outline-none text-sm bg-transparent"
              >
                <option value="">All Locations</option>
                {GHANA_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-green-700 text-white rounded px-8 py-2.5 font-semibold shrink-0"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-4">
            {QUICK_ACTIONS.map((a) => (
              <span
                key={a.label}
                className="flex items-center gap-1.5 text-sm text-green-100"
              >
                <a.Icon size={16} />
                {a.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE CATEGORIES */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-baseline mb-1">
          <h2 className="text-xl font-semibold">Explore Categories</h2>
          <Link href="/marketplace" className="text-green-700 text-sm font-medium">
            View All Categories →
          </Link>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Find what you need, from farm produce to services and more.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={`/marketplace?category=${c.value}`}
              className="bg-white border rounded-lg p-5 text-center hover:shadow-md transition"
            >
              <div className="mb-2 text-green-700">
                <c.Icon size={28} />
              </div>
              <p className="text-sm font-medium">{c.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-baseline mb-1">
          <h2 className="text-xl font-semibold">Featured Listings</h2>
          <Link href="/marketplace" className="text-green-700 text-sm font-medium">
            View All Listings →
          </Link>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Handpicked opportunities from our community.
        </p>

        {featuredListings.length === 0 ? (
          <p className="text-gray-500">No listings yet — be the first to post one.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {featuredListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition relative"
              >
                {/* Decorative only — no favorites feature built yet */}
                <span className="absolute top-2 right-2 z-10 bg-white/90 rounded-full w-7 h-7 flex items-center justify-center">
                  <Heart size={14} />
                </span>
                <div className="h-28 bg-green-50 flex items-center justify-center text-green-700">
                  {(() => {
                    const cat = CATEGORIES.find((c) => c.value === listing.category);
                    const Icon = cat?.Icon ?? Package;
                    return <Icon size={32} />;
                  })()}
                </div>
                <div className="p-3">
                  <span className="text-xs font-medium text-green-700">
                    {listing.type === "OFFER" ? "For Sale" : "Wanted"}
                  </span>
                  <h3 className="font-semibold text-sm mt-0.5">{listing.title}</h3>
                  {listing.price && (
                    <p className="text-green-700 text-sm font-medium mt-1">
                      GHS {listing.price.toString()}
                      {listing.priceUnit ? ` / ${listing.priceUnit}` : ""}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-5 h-5 rounded-full bg-green-700 text-white text-[10px] flex items-center justify-center">
                      {initials(listing.profile.displayName)}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                      {listing.profile.displayName}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {timeAgo(listing.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* OUR MISSION / STATS */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-green-50 rounded-lg overflow-hidden flex flex-col md:flex-row items-stretch">
          <div className="md:w-64 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop"
              alt="Hands holding a seedling"
              className="w-full h-48 md:h-full object-cover"
            />
          </div>

          <div className="flex-1 p-6 md:p-8">
            <span className="inline-block bg-green-700 text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
              Our Mission
            </span>
            <h2 className="text-2xl font-semibold mb-3">
              Empowering Ghana&apos;s Agricultural Community
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              We are building a digital platform that connects{" "}
              <strong className="text-gray-800">farmers, buyers</strong>,{" "}
              <strong className="text-gray-800">suppliers and service providers</strong>{" "}
              to create more opportunities, better information and a stronger
              agricultural economy.
            </p>
            <Link
              href="/knowledge"
              className="inline-flex items-center gap-1.5 bg-green-700 text-white text-sm font-medium rounded px-4 py-2"
            >
              Learn More <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex md:flex-col justify-around md:justify-center gap-6 md:gap-8 p-6 border-t md:border-t-0 md:border-l border-green-100 shrink-0">
            <div className="text-center">
              <Users size={20} className="text-green-700 mx-auto mb-1" />
              <p className="text-xl font-bold text-green-800">{userCount}</p>
              <p className="text-[11px] text-gray-500">Users</p>
            </div>
            <div className="text-center">
              <Package size={20} className="text-green-700 mx-auto mb-1" />
              <p className="text-xl font-bold text-green-800">{listingCount}</p>
              <p className="text-[11px] text-gray-500">Listings</p>
            </div>
            <div className="text-center">
              <LayoutGrid size={20} className="text-green-700 mx-auto mb-1" />
              <p className="text-xl font-bold text-green-800">{categoryCount}</p>
              <p className="text-[11px] text-gray-500">Categories</p>
            </div>
            <div className="text-center">
              <Globe2 size={20} className="text-green-700 mx-auto mb-1" />
              <p className="text-xl font-bold text-green-800">{regionCount}</p>
              <p className="text-[11px] text-gray-500">Regions</p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM ROW: WEATHER + MARKET INSIGHTS + KNOWLEDGE PROMO */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-sm">Weather Forecast</h3>
            <span className="text-xs text-gray-400">
              {weatherWidget?.city ?? ""}, Ghana
            </span>
          </div>
          {weatherWidget ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <CloudSun size={32} className="text-amber-500" />
                <div>
                  <p className="text-2xl font-semibold leading-none">
                    {weatherWidget.temp}°C
                  </p>
                  <p className="text-xs text-gray-500">{weatherWidget.condition}</p>
                </div>
                <div className="ml-auto grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-[10px] text-gray-400">Humidity</p>
                    <p className="text-xs font-medium">{weatherWidget.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Wind</p>
                    <p className="text-xs font-medium">{weatherWidget.wind} km/h</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Rain</p>
                    <p className="text-xs font-medium">{weatherWidget.precipitation}%</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 text-center border-t pt-3">
                {weatherWidget.daily.map((d, i) => {
                  const DayIcon = weatherIcon(d.code);
                  return (
                    <div key={d.date}>
                      <p className="text-[10px] text-gray-400">
                        {i === 0
                          ? "Today"
                          : new Date(d.date).toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                      </p>
                      <DayIcon size={16} className="mx-auto my-1 text-amber-500" />
                      <p className="text-[11px]">
                        {d.high}°<span className="text-gray-400">{d.low}°</span>
                      </p>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/weather"
                className="text-xs text-green-700 font-medium mt-3 inline-block"
              >
                View Full Forecast →
              </Link>
            </>
          ) : (
            <p className="text-sm text-gray-400">Weather unavailable right now.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-sm">Market Insights</h3>
            <Link href="/marketplace?category=PRODUCT" className="text-xs text-green-700 font-medium">
              View All →
            </Link>
          </div>

          {productAgg._avg.price ? (
            <>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-medium">Products</p>
                  <p className="text-xs text-gray-400">Across all regions</p>
                </div>
                {productDemand > productSupply && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-medium px-2 py-1 rounded">
                    High Demand
                  </span>
                )}
              </div>

              <p className="text-[11px] text-gray-400">Avg. Asking Price</p>
              <p className="text-lg font-semibold mb-2">
                GHS {Math.round(Number(productAgg._avg.price))} / MT
              </p>

              <div className="flex gap-6 text-xs mb-3">
                <div>
                  <p className="text-gray-400">Supply Listed</p>
                  <p className="font-medium">{productSupply} listings</p>
                </div>
                <div>
                  <p className="text-gray-400">Demand Listed</p>
                  <p className="font-medium">{productDemand} listings</p>
                </div>
              </div>

              {/* Simulated trend — not backed by real historical price tracking yet */}
              <div className="border-t pt-3">
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-2">
                  <TrendingUp size={12} />
                  Simulated trend (historical tracking not yet available)
                </div>
                <svg viewBox="0 0 200 40" className="w-full h-10" preserveAspectRatio="none">
                  <polyline
                    points="0,30 30,25 60,28 90,15 120,20 150,8 180,12 200,5"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                  />
                </svg>
                <div className="flex gap-1 mt-2">
                  {["7 Days", "30 Days", "6 Months", "1 Year"].map((label, i) => (
                    <span
                      key={label}
                      className={`text-[10px] px-2 py-1 rounded ${
                        i === 0
                          ? "bg-green-700 text-white"
                          : "text-gray-400 border"
                      }`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400">
              Not enough product listings yet for insights.
            </p>
          )}
        </div>

        <div className="relative rounded-lg overflow-hidden flex flex-col justify-end p-4 min-h-[240px]">
          <img
            src="https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=800&auto=format&fit=crop"
            alt="Farmer checking her phone"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="relative text-white">
            <h3 className="font-medium text-sm mb-3">
              Get the latest agri-news, tips and market updates.
            </h3>
            <Link
              href="/knowledge"
              className="inline-block bg-white text-green-800 text-sm font-medium rounded px-4 py-2"
            >
              Explore Knowledge →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}