"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm text-red-600 border border-red-200 rounded px-3 py-1"
    >
      Log out
    </button>
  );
}