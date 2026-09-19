import Link from "next/link";
import { auth } from "@/lib/auth";
import { signOut } from "next-auth/react";
import LogoutLink from "./logout-link";

export default async function Header() {
  const session = await auth();

  return (
    <header className="bg-white border-b px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg text-green-700">
          Ghana Agriculture Hub
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-600">
            Home
          </Link>
          <Link href="/marketplace" className="text-gray-600">
            Marketplace
          </Link>

          {session?.user ? (
            <>
              <Link href="/dashboard" className="text-gray-600">
                Dashboard
              </Link>
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