"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in." };
  }

  const displayName = formData.get("displayName") as string;
  const region = formData.get("region") as string;
  const city = formData.get("city") as string;
  const bio = formData.get("bio") as string;
  const phone = formData.get("phone") as string;

  if (!displayName || !region) {
    return { error: "Name and region are required." };
  }

  try {
    if (phone) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { phone },
      });
    }

    await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        displayName,
        region,
        city: city || null,
        bio: bio || null,
      },
    });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return { error: "This phone number is already registered to another account." };
    }
    throw error;
  }

  revalidatePath("/dashboard");
  return { success: true };
}