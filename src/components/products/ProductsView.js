"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProductQuery } from "@/hooks/useProductQuery";
import { useCategories, useProducts } from "@/hooks/useProducts";
import { getTotalPages } from "@/lib/pagination";
import { buttonStyles } from "@/components/ui/buttonStyles";
import ProductFilters from "./ProductFilters";
import ProductResults from "./ProductResults";
import DeleteProductDialog from "./DeleteProductDialog";

export default function ProductsView() {
  const { query, setQuery } = useProductQuery();
  const { data, error, isLoading, reload } = useProducts(query);
  const { categories } = useCategories();
  const [productToDelete, setProductToDelete] = useState(null);

  const total = data?.total ?? 0;
  const totalPages = getTotalPages(total, query.limit);
  const isPageTooHigh = !isLoading && !error && total > 0 && query.page > totalPages;

  // ?page=999 → go to the last page once we know how many pages there are.
  useEffect(() => {
    if (isPageTooHigh) setQuery({ page: totalPages }, { replace: true });
  }, [isPageTooHigh, totalPages, setQuery]);

  function handleDeleted() {
    setProductToDelete(null);
    reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500">Browse, search and manage your catalogue.</p>
        </div>
        <Link href="/products/new" className={buttonStyles("primary")}>
          + Add product
        </Link>
      </div>

      <ProductFilters query={query} categories={categories} onChange={setQuery} />

      <ProductResults
        query={query}
        data={data}
        error={error}
        isLoading={isLoading || isPageTooHigh}
        totalPages={totalPages}
        onChange={setQuery}
        onRetry={reload}
        onDelete={setProductToDelete}
      />

      {productToDelete && (
        <DeleteProductDialog
          product={productToDelete}
          onCancel={() => setProductToDelete(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
