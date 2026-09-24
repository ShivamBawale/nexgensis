"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { buttonStyles } from "@/components/ui/buttonStyles";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/products" className="text-lg font-bold text-slate-900">
          Nexgensis <span className="font-normal text-slate-500">Admin</span>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden items-center gap-2 sm:flex">
              {user.image && (
                <Image
                  src={user.image}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full bg-slate-100"
                />
              )}
              <span className="text-sm text-slate-700">
                {user.firstName} {user.lastName}
              </span>
            </div>
          )}
          {/* AuthGuard notices the session is gone and redirects to /login. */}
          <button type="button" onClick={logout} className={buttonStyles("secondary")}>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
