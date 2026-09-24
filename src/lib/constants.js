export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://dummyjson.com";

// Adds DummyJSON's `delay` param to every request. Set NEXT_PUBLIC_API_DELAY=2000
// in .env.local to test slow responses and out-of-order search results.
export const API_DELAY = process.env.NEXT_PUBLIC_API_DELAY || "";

export const PAGE_SIZES = [10, 20, 50];
export const DEFAULT_PAGE_SIZE = 10;

export const SEARCH_DEBOUNCE_MS = 400;

export const SORT_OPTIONS = [
  { value: "", label: "Default order" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Rating: high to low" },
  { value: "rating-asc", label: "Rating: low to high" },
  { value: "title-asc", label: "Title: A to Z" },
  { value: "title-desc", label: "Title: Z to A" },
];

// Images from this host go through Next's image optimizer (see next.config.mjs).
export const OPTIMIZED_IMAGE_HOST = "https://cdn.dummyjson.com/";
