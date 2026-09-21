import Link from "next/link";
import { signOut } from "next-auth/react";
import { auth } from "@/lib/auth";
import LogoutLink from "./logout-link";
import MobileNav from "./mobile-nav";

export default async function Header() {
  const session = await auth();

  return (
    <header className="bg-white border-b px-4 py-3 relative">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-header.png" alt="Ghana Agriculture Hub" className="h-9 w-auto" />
        </Link>

        <MobileNav loggedIn={!!session?.user} isAdmin={!!session?.user?.isAdmin} />

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-600">
            Home
          </Link>
          <Link href="/marketplace" className="text-gray-600">
            Marketplace
          </Link>
          <Link href="/knowledge" className="text-gray-600">
            Knowledge
          </Link>
          <Link href="/weather" className="text-gray-600">
            Weather
          </Link>

          {session?.user ? (
            <>
              <Link href="/dashboard" className="text-gray-600">
                Dashboard
              </Link>
              {session.user.isAdmin && (
                <Link href="/admin/articles/new" className="text-gray-600">
                  + Article
                </Link>
              )}
              <Link
                href="/listings/new"
                className="bg-green-700 text-white rounded px-3 py-1.5 font-medium"
              >
                Post Listing
              </Link>
              <LogoutLink />
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-green-700 text-white rounded px-3 py-1.5 font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}