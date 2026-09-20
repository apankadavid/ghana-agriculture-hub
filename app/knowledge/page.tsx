import { prisma } from "@/lib/prisma";
import Link from "next/link";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "CROPS", label: "Crops" },
  { value: "PLANTING", label: "Planting" },
  { value: "FERTILIZATION", label: "Fertilization" },
  { value: "IRRIGATION", label: "Irrigation" },
  { value: "PESTS_DISEASES", label: "Pests & Diseases" },
  { value: "MACHINERY", label: "Machinery" },
  { value: "HARVEST", label: "Harvest" },
];

export default async function KnowledgePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = params.category ?? "";
  const q = params.q ?? "";

  const articles = await prisma.article.findMany({
    where: {
      published: true,
      ...(category ? { category: category as never } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { excerpt: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  function buildUrl(overrides: Record<string, string>) {
    const next = new URLSearchParams({ category, q, ...overrides });
    for (const [key, value] of [...next.entries()]) {
      if (!value) next.delete(key);
    }
    return `/knowledge?${next.toString()}`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-semibold mb-1">Knowledge</h1>
          <p className="text-gray-500 text-sm mb-4">
            Better farming, better yields. A more sustainable future.
          </p>

          <form className="flex gap-2 mb-4" action="/knowledge">
            <input type="hidden" name="category" value={category} />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search articles..."
              className="flex-1 border rounded px-3 py-2"
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
                href={buildUrl({ category: c.value })}
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
        {articles.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            No articles found. Try a different search or category.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/knowledge/${article.slug}`}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition"
              >
                {article.coverImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.coverImageUrl}
                    alt={article.title}
                    className="w-full h-36 object-cover"
                  />
                )}
                <div className="p-4">
                  <span className="text-xs font-medium text-green-700">
                    {CATEGORIES.find((c) => c.value === article.category)?.label}
                  </span>
                  <h3 className="font-semibold mt-1">{article.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {article.excerpt}
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