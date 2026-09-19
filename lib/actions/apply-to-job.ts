"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function applyToJob(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to apply." };
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return { error: "Complete your profile before applying." };
  }

  const listingId = formData.get("listingId") as string;
  const message = (formData.get("message") as string) || null;
  const resumeFile = formData.get("resume") as File | null;

  if (!listingId) {
    return { error: "Missing job listing." };
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing || listing.category !== "JOB") {
    return { error: "This listing is not a job posting." };
  }

  const existing = await prisma.jobApplication.findUnique({
    where: {
      listingId_applicantId: {
        listingId,
        applicantId: profile.id,
      },
    },
  });

  if (existing) {
    return { error: "You have already applied to this job." };
  }

  let resumeUrl: string | null = null;

  if (resumeFile && resumeFile.size > 0) {
    if (!ALLOWED_TYPES.includes(resumeFile.type)) {
      return { error: "Resume must be a PDF or Word document." };
    }
    if (resumeFile.size > MAX_FILE_SIZE) {
      return { error: "Resume must be smaller than 5MB." };
    }

    const bytes = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "ghana-agriculture-hub/resumes",
            resource_type: "raw",
            use_filename: true,
            unique_filename: true,
            filename_override: resumeFile.name,
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
      resumeUrl = result.secure_url;
    } catch {
      return { error: "Resume upload failed. Please try again." };
    }
  }

  await prisma.jobApplication.create({
    data: {
      listingId,
      applicantId: profile.id,
      message,
      resumeUrl,
    },
  });

  return { success: true };
}
