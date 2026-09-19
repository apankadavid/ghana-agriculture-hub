"use server";

import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadListingImage(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in." };
  }

  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    return { error: "No file provided." };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Only JPEG, PNG, and WEBP images are allowed." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: "Image must be smaller than 5MB." };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ghana-agriculture-hub/listings",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return { success: true, url: result.secure_url };
  } catch {
    return { error: "Upload failed. Please try again." };
  }
}