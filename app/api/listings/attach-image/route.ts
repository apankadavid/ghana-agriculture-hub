import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId, url } = await req.json();

  if (!listingId || !url) {
    return NextResponse.json({ error: "Missing listingId or url" }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { profile: true },
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (listing.profile.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existingCount = await prisma.listingImage.count({
    where: { listingId },
  });

  if (existingCount >= 5) {
    return NextResponse.json({ error: "Maximum 5 images per listing" }, { status: 400 });
  }

  const image = await prisma.listingImage.create({
    data: {
      listingId,
      url,
      sortOrder: existingCount,
    },
  });

  return NextResponse.json({ success: true, image });
}