import Link from "next/link";
import { buttonStyles } from "@/components/ui/buttonStyles";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-20 text-center">
      <p className="text-5xl font-bold text-slate-300">404</p>
      <h1 className="text-xl font-semibold text-slate-900">Product not found</h1>
      <p className="max-w-md text-sm text-slate-500">
        This product doesn&apos;t exist, or it has been deleted.
      </p>
      <Link href="/products" className={buttonStyles("primary", "mt-2")}>
        Back to products
      </Link>
    </div>
  );
}
