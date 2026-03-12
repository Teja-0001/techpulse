"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b-2 border-black px-10 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link href="/">
        <h1 className="text-3xl font-black cursor-pointer">
          <span className="text-black">Tech</span>
          <span className="text-orange-500">Pulse</span>
        </h1>
      </Link>

      {/* Search */}
      <SearchBar />

      {/* Links */}
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link
          href="/"
          className="text-gray-600 hover:text-orange-500 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/bookmarks"
          className="text-gray-600 hover:text-orange-500 transition-colors"
        >
          Bookmarks
        </Link>

        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-500">Hi, {session.user?.name}! 👋</span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
