import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import EditListingForm from "./edit-form";

export default async function EditListingPage({
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

  const plainListing = {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    price: listing.price ? listing.price.toString() : null,
    priceUnit: listing.priceUnit,
    quantity: listing.quantity ? listing.quantity.toString() : null,
    quantityUnit: listing.quantityUnit,
    availability: listing.availability,
    qualityGrade: listing.qualityGrade,
    paymentTerms: listing.paymentTerms,
    region: listing.region,
    city: listing.city,
  };

  return <EditListingForm listing={plainListing} />;
}