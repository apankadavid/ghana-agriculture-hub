"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/lib/actions/favorites";
import { useRouter } from "next/navigation";

export default function FavoriteButton({
  listingId,
  initiallyFavorited,
  loggedIn,
}: {
  listingId: string;
  initiallyFavorited: boolean;
  loggedIn: boolean;
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initiallyFavorited);
  const [isPending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!loggedIn) {
      router.push("/login");
      return;
    }

    setFavorited(!favorited);
    startTransition(async () => {
      const result = await toggleFavorite(listingId);
      if (result.error) {
        setFavorited(favorited);
      } else if (typeof result.favorited === "boolean") {
        setFavorited(result.favorited);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      className="bg-white/90 rounded-full w-7 h-7 flex items-center justify-center"
    >
      <Heart size={14} fill={favorited ? "#dc2626" : "none"} className={favorited ? "text-red-600" : "text-gray-600"} />
    </button>
  );
}