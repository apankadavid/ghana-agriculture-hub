"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function completeOnboarding(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in." };
  }

  const displayName = formData.get("displayName") as string;
  const role = formData.get("role") as string;
  const region = formData.get("region") as string;
  const city = formData.get("city") as string;
  const phone = formData.get("phone") as string;

  if (!displayName || !role || !region || !phone) {
    return { error: "Name, role, region, and phone are required." };
  }

  const existing = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (existing) {
    return { error: "Profile already exists." };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { phone },
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { error: "This phone number is already registered to another account." };
    }
    throw error;
  }

  await prisma.profile.create({
    data: {
      userId: session.user.id,
      displayName,
      role: role as never,
      region,
      city: city || null,
    },
  });

  return { success: true };
}