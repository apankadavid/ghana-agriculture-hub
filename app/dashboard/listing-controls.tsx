"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateListingStatus, deleteListing } from "@/lib/actions/manage-listing";

export default function ListingControls({
  listingId,
  currentStatus,
}: {
  listingId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(status: "ACTIVE" | "INACTIVE" | "FULFILLED") {
    setLoading(true);
    await updateListingStatus(listingId, status);
    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this listing permanently? This cannot be undone."
    );
    if (!confirmed) return;

    setLoading(true);
    await deleteListing(listingId);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2 mt-2" onClick={(e) => e.preventDefault()}>
      <Link
        href={`/listings/${listingId}/edit`}
        className="text-xs text-green-700 font-medium"
      >
        Edit
      </Link>

      <select
        value={currentStatus}
        disabled={loading}
        onChange={(e) =>
          handleStatusChange(e.target.value as "ACTIVE" | "INACTIVE" | "FULFILLED")
        }
        className="text-xs border rounded px-1 py-0.5"
      >
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
        <option value="FULFILLED">Fulfilled</option>
      </select>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-xs text-red-600 font-medium"
      >
        Delete
      </button>
    </div>
  );
}