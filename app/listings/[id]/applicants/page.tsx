import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export default async function ApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { profile: true },
  });

  if (!listing) {
    notFound();
  }

  if (listing.profile.userId !== session.user.id) {
    redirect(`/listings/${id}`);
  }

  const applications = await prisma.jobApplication.findMany({
    where: { listingId: id },
    include: { applicant: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href={`/listings/${id}`} className="text-sm text-green-700">
          ← Back to listing
        </Link>

        <h1 className="text-xl font-semibold mt-2 mb-1">
          Applicants for {listing.title}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {applications.length} application{applications.length !== 1 ? "s" : ""}
        </p>

        {applications.length === 0 ? (
          <p className="text-gray-500">No applications yet.</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-lg shadow p-4">
                <p className="font-medium">{app.applicant.displayName}</p>
                <p className="text-xs text-gray-400 mb-2">
                  {app.applicant.user.phone ?? "No phone on file"} ·{" "}
                  {app.applicant.user.email}
                </p>
                {app.message && (
                  <p className="text-sm text-gray-600 mb-2">{app.message}</p>
                )}
                {app.resumeUrl && (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-700 font-medium"
                  >
                    View Resume &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
