"use client";

import { ApiError } from "@/lib/axios";
import { fetchProductDetails, fetchProductPage, getCategories } from "@/services/productService";
import { useRequest } from "./useRequest";

export function useProducts(query) {
  return useRequest((signal) => fetchProductPage(query, signal), JSON.stringify(query));
}

// `id` is null when the URL id isn't a number; we skip the API call then.
export function useProduct(id) {
  return useRequest(
    (signal) =>
      id === null
        ? Promise.reject(new ApiError("Product not found", 404))
        : fetchProductDetails(id, signal),
    String(id)
  );
}

export function useCategories() {
  const { data, error, isLoading, reload } = useRequest(getCategories, "categories");
  return { categories: data ?? [], error, isLoading, reload };
}
