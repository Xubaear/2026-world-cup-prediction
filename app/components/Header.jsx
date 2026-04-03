"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  if (pathname === "/") return null; // home page এ header দরকার নেই

  return (
    <header className="sticky top-0 z-50 bg-gray-950 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <Link
        href="/"
        className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition font-semibold text-sm"
      >
        ⚽ <span>Home</span>
      </Link>
      <span className="text-gray-600 text-xs">FIFA World Cup 2026</span>
    </header>
  );
}
