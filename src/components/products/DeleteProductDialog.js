"use client";

import { useState } from "react";
import { deleteProduct } from "@/services/productService";
import { useSubmitGuard } from "@/hooks/useSubmitGuard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function DeleteProductDialog({ product, onCancel, onDeleted }) {
  const [error, setError] = useState("");
  const [runDelete, isDeleting] = useSubmitGuard(deleteProduct);

  async function handleConfirm() {
    setError("");
    try {
      await runDelete(product);
      onDeleted(product);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <ConfirmDialog
      title="Delete product?"
      message={`"${product.title}" will be removed. This can't be undone.`}
      confirmLabel={isDeleting ? "Deleting…" : "Delete"}
      isBusy={isDeleting}
      error={error}
      onConfirm={handleConfirm}
      onCancel={onCancel}
    />
  );
}
