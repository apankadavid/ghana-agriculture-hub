"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/lib/actions/onboarding";

const ROLES = [
  { value: "FARMER", label: "Farmer" },
  { value: "BUYER", label: "Buyer" },
  { value: "SUPPLIER", label: "Input Supplier" },
  { value: "MACHINERY_OWNER", label: "Machinery Owner" },
  { value: "SERVICE_PROVIDER", label: "Service Provider" },
  { value: "TRANSPORTER", label: "Transporter" },
  { value: "AGRONOMIST", label: "Agronomist" },
  { value: "WORKER", label: "Agricultural Worker" },
  { value: "BUSINESS", label: "Agricultural Business" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    const result = await completeOnboarding(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-1">Complete your profile</h1>
        <p className="text-gray-500 text-sm mb-6">
          Tell us a bit about yourself to get started.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="displayName">
              Your Name / Farm / Business Name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Kwame Farms"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="role">
              I am a...
            </label>
            <select
              id="role"
              name="role"
              required
              defaultValue=""
              className="w-full border rounded px-3 py-2"
            >
              <option value="" disabled>
                Select your role
              </option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
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
            <label className="block text-sm font-medium mb-1" htmlFor="phone">
              WhatsApp / Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. 0540354964"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white rounded py-2 font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}