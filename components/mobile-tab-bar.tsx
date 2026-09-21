import Link from "next/link";
import { Home, Store, PlusCircle, CloudSun, LayoutDashboard } from "lucide-react";
import { auth } from "@/lib/auth";

export default async function MobileTabBar() {
  const session = await auth();

  const lastTabHref = session?.user ? "/dashboard" : "/login";
  const lastTabIcon = LayoutDashboard;
  const lastTabLabel = session?.user ? "Dashboard" : "Login";

  const LastIcon = lastTabIcon;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
      <div className="grid grid-cols-5 items-center px-2 py-1.5">
        <Link href="/" className="flex flex-col items-center gap-0.5 py-1 text-gray-500">
          <Home size={20} />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link href="/marketplace" className="flex flex-col items-center gap-0.5 py-1 text-gray-500">
          <Store size={20} />
          <span className="text-[10px]">Marketplace</span>
        </Link>
        <Link href="/listings/new" className="flex flex-col items-center -mt-4">
          <span className="bg-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
            <PlusCircle size={24} />
          </span>
        </Link>
        <Link href="/weather" className="flex flex-col items-center gap-0.5 py-1 text-gray-500">
          <CloudSun size={20} />
          <span className="text-[10px]">Weather</span>
        </Link>
        <Link href={lastTabHref} className="flex flex-col items-center gap-0.5 py-1 text-gray-500">
          <LastIcon size={20} />
          <span className="text-[10px]">{lastTabLabel}</span>
        </Link>
      </div>
    </nav>
  );
}