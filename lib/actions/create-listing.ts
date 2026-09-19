"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createListing(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in." };
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return { error: "Complete your profile before posting a listing." };
  }

  const type = formData.get("type") as string;
  const category = formData.get("category") as string;
  const title = formData.get("title") as string;
  const region = formData.get("region") as string;

  if (!type || !category || !title || !region) {
    return { error: "Type, category, title, and region are required." };
  }

  const priceRaw = formData.get("price") as string;
  const quantityRaw = formData.get("quantity") as string;

  const listing = await prisma.listing.create({
    data: {
      profileId: profile.id,
      type: type as never,
      category: category as never,
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

  return { success: true, listingId: listing.id };
}