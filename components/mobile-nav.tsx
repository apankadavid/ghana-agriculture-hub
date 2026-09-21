"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileNav({
  loggedIn,
  isAdmin,
}: {
  loggedIn: boolean;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg flex flex-col p-4 gap-3 text-sm z-50">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/marketplace" onClick={() => setOpen(false)}>Marketplace</Link>
          <Link href="/knowledge" onClick={() => setOpen(false)}>Knowledge</Link>
          <Link href="/weather" onClick={() => setOpen(false)}>Weather</Link>

          {loggedIn ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
              {isAdmin && (
                <Link href="/admin/articles/new" onClick={() => setOpen(false)}>
                  + Article
                </Link>
              )}
              <Link href="/listings/new" onClick={() => setOpen(false)}>Post Listing</Link>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link href="/register" onClick={() => setOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}