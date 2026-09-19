import { prisma } from "@/lib/prisma";
import Link from "next/link";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "PRODUCT", label: "Products" },
  { value: "INPUT", label: "Inputs" },
  { value: "MACHINERY", label: "Machinery" },
  { value: "SERVICE", label: "Services" },
  { value: "JOB", label: "Jobs" },
];

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; region?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  const category = params.category ?? "";
  const region = params.region ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const pageSize = 12;

  const where = {
    status: "ACTIVE" as const,
    ...(category ? { category: category as never } : {}),
    ...(region ? { region: { contains: region, mode: "insensitive" as const } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [listings, totalCount] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { profile: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.listing.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  function buildUrl(overrides: Record<string, string>) {
    const next = new URLSearchParams({
      q,
      category,
      region,
      page: String(page),
      ...overrides,
    });
    for (const [key, value] of [...next.entries()]) {
      if (!value || value === "1" && key === "page") next.delete(key);
    }
    return `/marketplace?${next.toString()}`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-semibold mb-1">Marketplace</h1>
          <p className="text-gray-500 text-sm mb-4">
            Find and connect with the right people, products and services.
          </p>

          <form className="flex gap-2 mb-4" action="/marketplace">
            <input type="hidden" name="category" value={category} />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search listings..."
              className="flex-1 border rounded px-3 py-2"
            />
            <input
              type="text"
              name="region"
              defaultValue={region}
              placeholder="Location"
              className="border rounded px-3 py-2 w-48"
            />
            <button
              type="submit"
              className="bg-green-700 text-white rounded px-5 py-2 font-medium"
            >
              Search
            </button>
          </form>

          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <Link
                key={c.value}
                href={buildUrl({ category: c.value, page: "1" })}
                className={`px-3 py-1.5 rounded text-sm font-medium border ${
                  category === c.value
                    ? "bg-green-700 text-white border-green-700"
                    : "text-gray-600"
                }`}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {listings.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            No listings found. Try adjusting your search or filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
              >
                <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                  {listing.type === "OFFER" ? "For Sale" : "Wanted"}
                </span>
                <h3 className="font-semibold mt-2">{listing.title}</h3>
                {listing.price && (
                  <p className="text-green-700 font-medium text-sm mt-1">
                    GHS {listing.price.toString()}
                    {listing.priceUnit ? ` / ${listing.priceUnit}` : ""}
                  </p>
                )}
                <p className="text-gray-400 text-xs mt-1">
                  {listing.region}
                  {listing.city ? `, ${listing.city}` : ""}
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  {listing.profile.displayName}
                </p>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            {page > 1 ? (
              <Link
                href={buildUrl({ page: String(page - 1) })}
                className="border rounded px-4 py-2 text-sm font-medium"
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
                href={buildUrl({ page: String(page + 1) })}
                className="border rounded px-4 py-2 text-sm font-medium"
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