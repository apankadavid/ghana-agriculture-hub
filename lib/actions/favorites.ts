"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "./activity";

export async function toggleFavorite(listingId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in." };
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) {
    return { error: "Complete your profile first." };
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      profileId_listingId: {
        profileId: profile.id,
        listingId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    revalidatePath("/marketplace");
    revalidatePath(`/listings/${listingId}`);
    revalidatePath("/favorites");
    return { success: true, favorited: false };
  }

  await prisma.favorite.create({
    data: { profileId: profile.id, listingId },
  });

  const favoritedListing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { title: true, profileId: true },
  });
  if (favoritedListing && favoritedListing.profileId !== profile.id) {
    await logActivity(
      favoritedListing.profileId,
      "NEW_FAVORITE",
      `${profile.displayName} favorited your listing "${favoritedListing.title}"`,
      listingId
    );
  }

  revalidatePath("/marketplace");
  revalidatePath(`/listings/${listingId}`);
  revalidatePath("/favorites");
  return { success: true, favorited: true };
}

export async function isFavorited(listingId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) return false;

  const existing = await prisma.favorite.findUnique({
    where: {
      profileId_listingId: {
        profileId: profile.id,
        listingId,
      },
    },
  });

  return !!existing;
}