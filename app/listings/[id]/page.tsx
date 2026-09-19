import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

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
