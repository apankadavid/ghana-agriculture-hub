import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Store,
  MessageSquare,
  Heart,
  Briefcase,
  BookOpen,
  CloudSun,
  Sprout,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/dashboard#listings", label: "My Listings", Icon: Package },
  { href: "/marketplace", label: "Marketplace", Icon: Store },
  { href: "/messages", label: "Messages", Icon: MessageSquare },
  { href: "/favorites", label: "Favorites", Icon: Heart },
  { href: "/marketplace?category=JOB", label: "Jobs", Icon: Briefcase },
  { href: "/knowledge", label: "Knowledge", Icon: BookOpen },
  { href: "/weather", label: "Weather", Icon: CloudSun },
  { href: "/my-farm", label: "My Farm", Icon: Sprout },
  { href: "/profile", label: "Profile Settings", Icon: Settings },
];

export default function DashboardSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 bg-green-950 text-green-100 shrink-0 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-header-transparent.png"
          alt="Ghana Agriculture Hub"
          className="h-8 w-auto brightness-0 invert"
        />
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded text-sm text-green-100 hover:bg-green-900"
          >
            <item.Icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto bg-green-900 rounded-lg p-4 text-sm">
        <p className="font-medium mb-1">Grow your farm with the right connections.</p>
        <p className="text-green-300 text-xs mb-3">Buy. Sell. Hire. Learn. All in one place.</p>
        <Link
          href="/marketplace"
          className="block text-center bg-white text-green-800 rounded py-1.5 text-xs font-medium"
        >
          Explore Marketplace →
        </Link>
      </div>
    </aside>
  );
}