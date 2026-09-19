import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-semibold">
              Good morning, {profile.displayName}!
            </h1>
            <p className="text-gray-500 text-sm">
              {profile.role.replace("_", " ")} · {profile.region}
              {profile.city ? `, ${profile.city}` : ""}
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="border-t pt-4 text-sm text-gray-500">
          Account email: {session.user.email}
        </div>
      </div>
    </div>
  );
}