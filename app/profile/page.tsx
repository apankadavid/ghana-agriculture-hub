import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  if (!user || !user.profile) {
    redirect("/onboarding");
  }

  return (
    <ProfileForm
      profile={{
        displayName: user.profile.displayName,
        region: user.profile.region,
        city: user.profile.city,
        bio: user.profile.bio,
        phone: user.phone,
      }}
    />
  );
}