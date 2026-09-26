import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import ApplyForm from "./apply-form";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      profile: { include: { user: true } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!listing) {
    notFound();
  }

  const session = await auth();
  const isOwner = session?.user?.id === listing.profile.userId;

  let alreadyApplied = false;
  if (session?.user?.id && listing.category === "JOB" && !isOwner) {
    const viewerProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });
    if (viewerProfile) {
      const existing = await prisma.jobApplication.findUnique({
        where: {
          listingId_applicantId: {
            listingId: listing.id,
            applicantId: viewerProfile.id,
          },
        },
      });
      alreadyApplied = !!existing;
    }
  }

  function toWhatsAppFormat(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("233")) {
      return digits;
    }
    if (digits.startsWith("0")) {
      return "233" + digits.slice(1);
    }
    return "233" + digits;
  }

  const rawPhone = listing.profile.user.phone;
  const whatsappLink = rawPhone
    ? `https://wa.me/${toWhatsAppFormat(rawPhone)}?text=${encodeURIComponent(
        `Hi, I'm interested in your listing: ${listing.title}`
      )}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
            {listing.type === "OFFER" ? "For Sale / Offer" : "Request / Wanted"}
          </span>
          <span className="text-xs text-gray-400">{listing.category}</span>
        </div>

        {listing.images.length > 0 && (
          <div className="mb-4">
            <img
              src={listing.images[0].url}
              alt={listing.title}
              className="w-full max-h-[32rem] object-contain bg-gray-100 rounded-lg"
            />
            {listing.images.length > 1 && (
              <div className="flex gap-2 mt-2">
                {listing.images.slice(1).map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt={listing.title}
                    className="w-16 h-16 object-contain bg-gray-100 rounded border"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <h1 className="text-2xl font-semibold mt-2">{listing.title}</h1>

        {listing.price && (
          <p className="text-green-700 text-xl font-semibold mt-1">
            GHS {listing.price.toString()}
            {listing.priceUnit ? ` / ${listing.priceUnit}` : ""}
          </p>
        )}

        <p className="text-gray-500 text-sm mt-1">
          {listing.region}
          {listing.city ? `, ${listing.city}` : ""}
        </p>

        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-medium">{listing.profile.displayName}</p>
          <p className="text-xs text-gray-400">
            {listing.profile.role.replace("_", " ")}
          </p>
        </div>

        {isOwner && listing.category === "JOB" && (
          <Link
            href={`/listings/${listing.id}/applicants`}
            className="inline-block text-sm text-green-700 font-medium mt-2"
          >
            View Applicants →
          </Link>
        )}

        <div className="flex gap-3 mt-4">
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-700 text-white rounded px-4 py-2 text-sm font-medium"
            >
              Contact via WhatsApp
            </a>
          )}
        </div>

        {listing.category === "JOB" && !isOwner && (
          <div className="mt-4">
            {alreadyApplied ? (
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3">
                You have already applied to this job.
              </p>
            ) : session?.user ? (
              <ApplyForm listingId={listing.id} />
            ) : (
              <p className="text-sm text-gray-500">
                <Link href="/login" className="text-green-700 font-medium">
                  Log in
                </Link>{" "}
                to apply for this job.
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t text-sm">
          {listing.quantity && (
            <div>
              <p className="text-gray-400">Quantity</p>
              <p className="font-medium">
                {listing.quantity.toString()} {listing.quantityUnit}
              </p>
            </div>
          )}
          {listing.availability && (
            <div>
              <p className="text-gray-400">Availability</p>
              <p className="font-medium">{listing.availability}</p>
            </div>
          )}
          {listing.qualityGrade && (
            <div>
              <p className="text-gray-400">Quality</p>
              <p className="font-medium">{listing.qualityGrade}</p>
            </div>
          )}
          {listing.paymentTerms && (
            <div>
              <p className="text-gray-400">Payment Terms</p>
              <p className="font-medium">{listing.paymentTerms}</p>
            </div>
          )}
        </div>

        {listing.description && (
          <div className="mt-6 pt-6 border-t">
            <h2 className="text-sm font-medium mb-2">Description</h2>
            <p className="text-sm text-gray-600">{listing.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
