"use server";

import { prisma } from "@/lib/prisma";

export async function logActivity(
  profileId: string,
  type: "NEW_FAVORITE" | "NEW_MESSAGE" | "NEW_JOB_APPLICATION",
  message: string,
  listingId?: string
) {
  try {
    await prisma.activity.create({
      data: { profileId, type, message, listingId },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}