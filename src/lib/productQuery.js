// Reads the list page's state (page, size, search, category, sort) from the URL,
// and writes it back. Anything invalid falls back to a safe default, so URLs
// like ?page=abc or ?limit=999 never break the page.
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from "./constants";

const SORT_FIELDS = ["price", "rating", "title"];
const SORT_ORDERS = ["asc", "desc"];
const MAX_PAGE = 100000;
const MAX_SEARCH_LENGTH = 100;
const CATEGORY_PATTERN = /^[a-z0-9-]+$/;

function parsePage(value) {
  if (!value || !/^\d+$/.test(value)) return 1;
  const page = Number(value);
  return page >= 1 && page <= MAX_PAGE ? page : 1;
}

function parseLimit(value) {
  const limit = Number(value);
  return PAGE_SIZES.includes(limit) ? limit : DEFAULT_PAGE_SIZE;
}

export function parseProductQuery(searchParams) {
  const q = (searchParams.get("q") ?? "").trim().slice(0, MAX_SEARCH_LENGTH);

  // The API can't search and filter by category at the same time.
  // If a URL has both, search wins (see README: "Search vs category").
  const rawCategory = (searchParams.get("category") ?? "").trim().toLowerCase();
  const category = !q && CATEGORY_PATTERN.test(rawCategory) ? rawCategory : "";

  const rawSortBy = searchParams.get("sortBy");
  const sortBy = SORT_FIELDS.includes(rawSortBy) ? rawSortBy : "";
  const rawOrder = searchParams.get("order");
  const order = sortBy ? (SORT_ORDERS.includes(rawOrder) ? rawOrder : "asc") : "";

  return {
    page: parsePage(searchParams.get("page")),
    limit: parseLimit(searchParams.get("limit")),
    q,
    category,
    sortBy,
    order,
  };
}

// Builds the query string, leaving out default values to keep URLs short.
export function buildProductSearch(query) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.sortBy) {
    params.set("sortBy", query.sortBy);
    params.set("order", query.order || "asc");
  }
  if (query.limit !== DEFAULT_PAGE_SIZE) params.set("limit", String(query.limit));
  if (query.page > 1) params.set("page", String(query.page));
  return params.toString();
}
