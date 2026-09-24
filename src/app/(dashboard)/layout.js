import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";

// Everything inside the (dashboard) folder needs a logged-in user.
export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </AuthGuard>
  );
}
