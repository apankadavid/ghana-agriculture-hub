"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createListing } from "@/lib/actions/create-listing";
import { uploadListingImage } from "@/lib/actions/upload-image";

const CATEGORIES = [
  { value: "PRODUCT", label: "Agricultural Product" },
  { value: "INPUT", label: "Input / Supply" },
  { value: "MACHINERY", label: "Machinery" },
  { value: "SERVICE", label: "Service" },
  { value: "JOB", label: "Job" },
];

export default function NewListingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"OFFER" | "REQUEST">("OFFER");
  const [files, setFiles] = useState<File[]>([]);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    const result = await createListing(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    for (const file of files) {
      const imageFormData = new FormData();
      imageFormData.append("file", file);
      const uploadResult = await uploadListingImage(imageFormData);

      if (uploadResult.success && uploadResult.url) {
        await fetch("/api/listings/attach-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listingId: result.listingId,
            url: uploadResult.url,
          }),
        });
      }
    }

    router.push(`/listings/${result.listingId}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-1">Create Listing</h1>
        <p className="text-gray-500 text-sm mb-6">
          Tell others what you have or what you need.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType("OFFER")}
              className={`flex-1 border rounded py-2 text-sm font-medium ${
                type === "OFFER" ? "bg-green-700 text-white" : "text-gray-600"
              }`}
            >
              I Have (Offer)
            </button>
            <button
              type="button"
              onClick={() => setType("REQUEST")}
              className={`flex-1 border rounded py-2 text-sm font-medium ${
                type === "REQUEST" ? "bg-green-700 text-white" : "text-gray-600"
              }`}
            >
              I Need (Request)
            </button>
          </div>
          <input type="hidden" name="type" value={type} />

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
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Maize (Yellow)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full border rounded px-3 py-2"
              placeholder="Provide detailed information about your listing..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="price">
                Price (optional)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. 1200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="priceUnit">
                Unit
              </label>
              <input
                id="priceUnit"
                name="priceUnit"
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. MT"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="quantity">
                Quantity / Available
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                step="0.01"
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. 100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="quantityUnit">
                Unit
              </label>
              <input
                id="quantityUnit"
                name="quantityUnit"
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. MT"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="region">
              Region
            </label>
            <input
              id="region"
              name="region"
              type="text"
              required
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Northern Region"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="city">
              City / Town (optional)
            </label>
            <input
              id="city"
              name="city"
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Tamale"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="images">
              Photos (optional, up to 5)
            </label>
            <input
              id="images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 5))}
              className="w-full border rounded px-3 py-2"
            />
            {files.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {files.length} photo{files.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white rounded py-2 font-medium disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}