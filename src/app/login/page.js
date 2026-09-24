import { Suspense } from "react";
import LoginView from "@/components/auth/LoginView";
import LoadingState from "@/components/ui/LoadingState";

export const metadata = { title: "Log in · Nexgensis Admin" };

export default function LoginPage() {
  return (
    // LoginView reads ?next= from the URL, which needs a Suspense boundary.
    <Suspense fallback={<LoadingState />}>
      <LoginView />
    </Suspense>
  );
}
