"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/services/productService";
import { EMPTY_PRODUCT_FORM } from "@/lib/productValidation";
import ProductForm from "./ProductForm";

export default function CreateProductView() {
  const router = useRouter();

  const handleSubmit = useCallback(
    async (payload) => {
      const product = await createProduct(payload);
      router.push(`/products/${product.id}`);
    },
    [router]
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Add product</h1>
      <ProductForm
        initialValues={EMPTY_PRODUCT_FORM}
        submitLabel="Add product"
        cancelHref="/products"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
