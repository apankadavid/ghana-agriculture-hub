import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const { listingId } = await req.json();

  if (!listingId) {
    return NextResponse.json({ error: "Missing listingId" }, { status: 400 });
  }

  let visitorId = req.cookies.get("visitor_id")?.value;
  const response = NextResponse.json({ success: true });

  if (!visitorId) {
    visitorId = randomUUID();
    response.cookies.set("visitor_id", visitorId, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: "lax",
    });
  }

  const session = await auth();
  if (session?.user?.id) {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { profile: true },
    });
    if (listing && listing.profile.userId === session.user.id) {
      return response;
    }
  }

  const viewDate = new Date().toISOString().slice(0, 10);

  try {
    await prisma.listingView.create({
      data: { listingId, visitorId, viewDate },
    });
  } catch {
    // Already viewed today — expected, not an error
  }

  return response;
}