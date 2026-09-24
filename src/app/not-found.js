import Link from "next/link";
import { buttonStyles } from "@/components/ui/buttonStyles";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-5xl font-bold text-slate-300">404</p>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="text-sm text-slate-500">The page you are looking for doesn&apos;t exist.</p>
      <Link href="/products" className={buttonStyles("primary", "mt-2")}>
        Go to products
      </Link>
    </main>
  );
}
