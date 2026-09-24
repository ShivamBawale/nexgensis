import { Suspense } from "react";
import ProductsView from "@/components/products/ProductsView";
import LoadingState from "@/components/ui/LoadingState";

export const metadata = { title: "Products · Nexgensis Admin" };

export default function ProductsPage() {
  return (
    // ProductsView reads its state from the URL (useSearchParams), which needs Suspense.
    <Suspense fallback={<LoadingState label="Loading products…" />}>
      <ProductsView />
    </Suspense>
  );
}
