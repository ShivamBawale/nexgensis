"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingState from "@/components/ui/LoadingState";

// Wraps every page that needs a logged-in user.
export default function AuthGuard({ children }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // Remember where the user wanted to go, so we can send them back after login.
      const next = window.location.pathname + window.location.search;
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return <LoadingState label="Checking your session…" />;
  }

  return children;
}
