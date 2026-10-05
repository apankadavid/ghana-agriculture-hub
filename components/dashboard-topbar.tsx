"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, ChevronDown } from "lucide-react";
import LogoutLink from "./logout-link";

export default function DashboardTopbar({
  displayName,
  role,
  unreadCount,
}: {
  displayName: string;
  role: string;
  unreadCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q") as string;
    router.push(`/marketplace?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="bg-white border-b px-4 py-3 flex items-center gap-4">
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="flex items-center gap-2 border rounded px-3 py-1.5">
          <Search size={16} className="text-gray-400" />
          <input
            name="q"
            type="text"
            placeholder="Search for products, services, jobs..."
            className="w-full text-sm outline-none"
          />
        </div>
      </form>

      <Link href="/messages" className="relative text-gray-500">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Link>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-sm"
        >
          <span className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-medium">
            {displayName.slice(0, 2).toUpperCase()}
          </span>
          <span className="hidden sm:block text-left">
            <span className="block font-medium">{displayName}</span>
            <span className="block text-xs text-gray-400">{role}</span>
          </span>
          <ChevronDown size={14} />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg w-40 py-1 z-50">
            <Link
              href="/profile"
              className="block px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              Profile Settings
            </Link>
            <div className="px-3 py-2">
              <LogoutLink />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}