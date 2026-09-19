import Link from "next/link";
import { prisma } from "@/lib/prisma";

const CATEGORIES = [
  { value: "PRODUCT", label: "Agricultural Products" },
  { value: "INPUT", label: "Inputs & Supplies" },
  { value: "MACHINERY", label: "Machinery & Equipment" },
  { value: "SERVICE", label: "Services" },
  { value: "JOB", label: "Jobs" },
];

export default async function HomePage() {
  const featuredListings = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    include: { profile: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-green-800 text-white px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Everything Agriculture. One Place.</h1>
          <p className="text-green-100 mb-8">
            Connect with farmers, buyers, suppliers and service providers across
            Ghana&apos;s agricultural ecosystem.
          </p>

          <form action="/marketplace" className="flex gap-2 max-w-xl mx-auto">
            <input
              type="text"
              name="q"
              placeholder="Search for products, machinery, services, jobs..."
              className="flex-1 rounded px-4 py-3 text-gray-900"
            />
            <button
              type="submit"
              className="bg-white text-green-800 rounded px-6 py-3 font-semibold"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-lg font-semibold mb-4">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={`/marketplace?category=${c.value}`}
              className="bg-white border rounded-lg p-4 text-center text-sm font-medium hover:shadow-md transition"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Featured Listings</h2>
          <Link href="/marketplace" className="text-green-700 text-sm font-medium">
            View all →
          </Link>
        </div>

        {featuredListings.length === 0 ? (
          <p className="text-gray-500">No listings yet — be the first to post one.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featuredListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-sm">{listing.title}</h3>
                {listing.price && (
                  <p className="text-green-700 font-medium text-sm mt-1">
                    GHS {listing.price.toString()}
                    {listing.priceUnit ? ` / ${listing.priceUnit}` : ""}
                  </p>
                )}
                <p className="text-gray-400 text-xs mt-1">{listing.region}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}