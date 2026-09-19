"use client";

import { useState } from "react";
import { applyToJob } from "@/lib/actions/apply-to-job";

export default function ApplyForm({ listingId }: { listingId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    const result = await applyToJob(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3">
        Application submitted successfully.
      </p>
    );
  }

  return (
    <form action={handleSubmit} className="border rounded-lg p-4 space-y-3">
      <h3 className="font-medium text-sm">Apply for this job</h3>

      <input type="hidden" name="listingId" value={listingId} />

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="message">
          Message (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Briefly introduce yourself..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="resume">
          Resume / CV (optional, PDF or Word, max 5MB)
        </label>
        <input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-700 text-white rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}