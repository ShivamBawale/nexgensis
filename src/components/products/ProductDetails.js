"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCategory, formatPrice } from "@/lib/format";
import { buttonStyles } from "@/components/ui/buttonStyles";
import ProductGallery from "./ProductGallery";
import ProductReviews from "./ProductReviews";
import Rating from "./Rating";
import StockBadge from "./StockBadge";
import DeleteProductDialog from "./DeleteProductDialog";

export default function ProductDetails({ product }) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const images = product.images?.length ? product.images : [product.thumbnail].filter(Boolean);

  return (
    <div className="space-y-6">
      <Link href="/products" className="text-sm text-indigo-600 hover:underline">
        ← Back to products
      </Link>

      <div className="grid gap-8 rounded-xl border border-slate-200 bg-white p-6 lg:grid-cols-2">
        <ProductGallery images={images} title={product.title} />

        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">
              {formatCategory(product.category)}
              {product.brand && ` · ${product.brand}`}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{product.title}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold text-slate-900">{formatPrice(product.price)}</span>
            {product.discountPercentage > 0 && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                {product.discountPercentage}% off
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Rating value={product.rating} />
            <StockBadge stock={product.stock} />
          </div>

          <p className="leading-relaxed text-slate-700">{product.description}</p>

          {product.isLocal && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Added in this browser. DummyJSON doesn&apos;t really save new products.
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Link href={`/products/${product.id}/edit`} className={buttonStyles("primary")}>
              Edit
            </Link>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className={buttonStyles("danger")}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <ProductReviews reviews={product.reviews ?? []} />

      {isDeleteOpen && (
        <DeleteProductDialog
          product={product}
          onCancel={() => setIsDeleteOpen(false)}
          onDeleted={() => router.replace("/products")}
        />
      )}
    </div>
  );
}
