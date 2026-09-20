import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  CROPS: "Crops",
  PLANTING: "Planting",
  FERTILIZATION: "Fertilization",
  IRRIGATION: "Irrigation",
  PESTS_DISEASES: "Pests & Diseases",
  MACHINERY: "Machinery",
  HARVEST: "Harvest",
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
  });

  if (!article || !article.published) {
    notFound();
  }

  const paragraphs = article.content.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <Link href="/knowledge" className="text-sm text-green-700">
          ← Back to Knowledge
        </Link>

        <span className="block text-xs font-medium text-green-700 mt-4">
          {CATEGORY_LABELS[article.category]}
        </span>
        <h1 className="text-2xl font-semibold mt-1 mb-4">{article.title}</h1>

        {article.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        <div className="prose prose-sm max-w-none">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-gray-700 mb-4">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}