"use client";

import { useRouter } from "next/navigation";
import { updateProduct } from "@/services/productService";
import { productToFormValues } from "@/lib/productValidation";
import ProductForm from "./ProductForm";
import ProductLoader from "./ProductLoader";

export default function EditProductView({ id }) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Edit product</h1>
      <ProductLoader id={id}>
        {(product) => (
          <ProductForm
            initialValues={productToFormValues(product)}
            submitLabel="Save changes"
            cancelHref={`/products/${product.id}`}
            onSubmit={async (payload) => {
              await updateProduct(product, payload);
              router.push(`/products/${product.id}`);
            }}
          />
        )}
      </ProductLoader>
    </div>
  );
}
