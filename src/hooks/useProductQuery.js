"use client";

import { useCallback, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildProductSearch, parseProductQuery } from "@/lib/productQuery";

// The URL is the single source of truth for page, size, search, category and sort.
export function useProductQuery() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = useMemo(() => parseProductQuery(searchParams), [searchParams]);

  const setQuery = useCallback(
    (changes, { replace = false } = {}) => {
      const search = buildProductSearch({ ...query, ...changes });
      const url = search ? `${pathname}?${search}` : pathname;
      if (replace) router.replace(url, { scroll: false });
      else router.push(url, { scroll: false });
    },
    [query, pathname, router]
  );

  // Clean up bad values in the address bar, e.g. ?page=abc → (no page param).
  useEffect(() => {
    const clean = buildProductSearch(query);
    if (searchParams.toString() !== clean) {
      router.replace(clean ? `${pathname}?${clean}` : pathname, { scroll: false });
    }
  }, [query, searchParams, pathname, router]);

  return { query, setQuery };
}
