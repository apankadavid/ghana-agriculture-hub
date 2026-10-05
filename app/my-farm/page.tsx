import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md text-center bg-white rounded-lg shadow p-8">
        <h1 className="text-xl font-semibold mb-2">My Farm — Coming Soon</h1>
        <p className="text-gray-500 text-sm mb-6">
          Crop calendars, farm records, and planning tools are on our roadmap.
          We&apos;re focused on the marketplace first — this feature is planned
          for a future update.
        </p>
        <Link href="/dashboard" className="text-green-700 font-medium text-sm">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}