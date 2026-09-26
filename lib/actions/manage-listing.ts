"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getOwnedListing(listingId: string, userId: string) {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { profile: true },
  });

  if (!listing || listing.profile.userId !== userId) {
    return null;
  }

  return listing;
}

export async function updateListing(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in." };
  }

  const listingId = formData.get("listingId") as string;
  const listing = await getOwnedListing(listingId, session.user.id);
  if (!listing) {
    return { error: "Listing not found or you don't have permission to edit it." };
  }

  const title = formData.get("title") as string;
  const region = formData.get("region") as string;

  if (!title || !region) {
    return { error: "Title and region are required." };
  }

  const priceRaw = formData.get("price") as string;
  const quantityRaw = formData.get("quantity") as string;

  await prisma.listing.update({
    where: { id: listingId },
    data: {
      title,
      description: (formData.get("description") as string) || null,
      price: priceRaw ? parseFloat(priceRaw) : null,
      priceUnit: (formData.get("priceUnit") as string) || null,
      quantity: quantityRaw ? parseFloat(quantityRaw) : null,
      quantityUnit: (formData.get("quantityUnit") as string) || null,
      availability: (formData.get("availability") as string) || null,
      qualityGrade: (formData.get("qualityGrade") as string) || null,
      paymentTerms: (formData.get("paymentTerms") as string) || null,
      region,
      city: (formData.get("city") as string) || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/listings/${listingId}`);

  return { success: true };
}

export async function updateListingStatus(listingId: string, status: "ACTIVE" | "INACTIVE" | "FULFILLED") {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in." };
  }

  const listing = await getOwnedListing(listingId, session.user.id);
  if (!listing) {
    return { error: "Listing not found or you don't have permission." };
  }

  await prisma.listing.update({
    where: { id: listingId },
    data: { status },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/listings/${listingId}`);

  return { success: true };
}

export async function deleteListing(listingId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in." };
  }

  const listing = await getOwnedListing(listingId, session.user.id);
  if (!listing) {
    return { error: "Listing not found or you don't have permission." };
  }

  await prisma.listing.delete({ where: { id: listingId } });

  revalidatePath("/dashboard");

  return { success: true };
}