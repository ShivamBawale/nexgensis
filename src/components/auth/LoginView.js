"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingState from "@/components/ui/LoadingState";
import LoginForm from "./LoginForm";

// Only allow redirects inside this app ("/products"), never to "//evil.com".
function getSafeRedirect(next) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/products";
}

export default function LoginView() {
  const { status } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get("next"));

  // Already logged in (or just logged in) → go to the app.
  useEffect(() => {
    if (status === "authenticated") router.replace(redirectTo);
  }, [status, redirectTo, router]);

  if (status !== "unauthenticated") return <LoadingState />;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Nexgensis Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Log in to manage products</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>

        <p className="text-center text-xs text-slate-500">
          Demo account: <code className="font-mono">emilys</code> /{" "}
          <code className="font-mono">emilyspass</code>
        </p>
      </div>
    </main>
  );
}
