"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArticle } from "@/lib/actions/create-article";

const CATEGORIES = [
  { value: "CROPS", label: "Crops" },
  { value: "PLANTING", label: "Planting" },
  { value: "FERTILIZATION", label: "Fertilization" },
  { value: "IRRIGATION", label: "Irrigation" },
  { value: "PESTS_DISEASES", label: "Pests & Diseases" },
  { value: "MACHINERY", label: "Machinery" },
  { value: "HARVEST", label: "Harvest" },
];

export default function NewArticlePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    const result = await createArticle(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(`/knowledge/${result.slug}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-xl font-semibold mb-6">New Article</h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              defaultValue=""
              className="w-full border rounded px-3 py-2"
            >
              <option value="" disabled>
                Select category
              </option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="excerpt">
              Excerpt (short summary for the card grid)
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="content">
              Content (separate paragraphs with a blank line)
            </label>
            <textarea
              id="content"
              name="content"
              rows={12}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" />
            Publish immediately (otherwise saved as a draft)
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white rounded py-2 font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create Article"}
          </button>
        </form>
      </div>
    </div>
  );
}