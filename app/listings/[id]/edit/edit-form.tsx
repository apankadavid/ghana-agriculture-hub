"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateListing } from "@/lib/actions/manage-listing";

type Listing = {
  id: string;
  title: string;
  description: string | null;
  price: string | null;
  priceUnit: string | null;
  quantity: string | null;
  quantityUnit: string | null;
  availability: string | null;
  qualityGrade: string | null;
  paymentTerms: string | null;
  region: string;
  city: string | null;
};

export default function EditListingForm({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    const result = await updateListing(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(`/listings/${listing.id}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6">Edit Listing</h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="listingId" value={listing.id} />

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={listing.title}
              className="w-full border rounded px-3 py-2"
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
              defaultValue={listing.description ?? ""}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="price">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={listing.price ?? ""}
                className="w-full border rounded px-3 py-2"
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
                defaultValue={listing.priceUnit ?? ""}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="quantity">
                Quantity
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                step="0.01"
                defaultValue={listing.quantity ?? ""}
                className="w-full border rounded px-3 py-2"
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
                defaultValue={listing.quantityUnit ?? ""}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="availability">
              Availability
            </label>
            <input
              id="availability"
              name="availability"
              type="text"
              defaultValue={listing.availability ?? ""}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="qualityGrade">
              Quality Grade
            </label>
            <input
              id="qualityGrade"
              name="qualityGrade"
              type="text"
              defaultValue={listing.qualityGrade ?? ""}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="paymentTerms">
              Payment Terms
            </label>
            <input
              id="paymentTerms"
              name="paymentTerms"
              type="text"
              defaultValue={listing.paymentTerms ?? ""}
              className="w-full border rounded px-3 py-2"
            />
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
              defaultValue={listing.region}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="city">
              City / Town
            </label>
            <input
              id="city"
              name="city"
              type="text"
              defaultValue={listing.city ?? ""}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white rounded py-2 font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}