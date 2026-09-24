"use client";

import { useProduct } from "@/hooks/useProducts";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import ProductNotFound from "./ProductNotFound";

// Loads one product by the id from the URL and handles loading / 404 / error.
// `children` is a function that receives the loaded product.
export default function ProductLoader({ id, children }) {
  // Ids are whole numbers; anything else (e.g. /products/abc) is simply not found.
  const isValidId = /^\d+$/.test(id);
  const productId = isValidId ? Number(id) : null;
  const { data: product, error, isLoading, reload } = useProduct(productId);

  if (!isValidId) return <ProductNotFound />;
  if (isLoading) return <LoadingState label="Loading product…" />;
  if (error?.status === 404) return <ProductNotFound />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  return children(product);
}
