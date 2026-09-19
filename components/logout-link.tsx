"use client";

import { signOut } from "next-auth/react";

export default function LogoutLink() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/" })} className="text-gray-600">
      Log out
    </button>
  );
}