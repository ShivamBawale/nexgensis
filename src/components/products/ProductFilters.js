"use client";

import { SORT_OPTIONS } from "@/lib/constants";
import { inputStyles } from "@/components/ui/FormField";
import { buttonStyles } from "@/components/ui/buttonStyles";
import SearchInput from "./SearchInput";

export default function ProductFilters({ query, categories, onChange }) {
  const sortValue = query.sortBy ? `${query.sortBy}-${query.order}` : "";
  const hasFilters = Boolean(query.q || query.category || query.sortBy);

  // Search and category can't be combined in the API, so each one clears the other.
  function handleSearch(q) {
    onChange({ q, category: q ? "" : query.category, page: 1 }, { replace: true });
  }

  function handleCategory(event) {
    onChange({ category: event.target.value, q: "", page: 1 });
  }

  function handleSort(event) {
    const [sortBy = "", order = ""] = event.target.value.split("-");
    onChange({ sortBy, order, page: 1 });
  }

  function handleClear() {
    onChange({ q: "", category: "", sortBy: "", order: "", page: 1 });
  }

  return (
    <div className="space-y-2">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_220px_220px_auto]">
        <SearchInput value={query.q} onSearch={handleSearch} />

        <div>
          <label htmlFor="category-filter" className="sr-only">
            Filter by category
          </label>
          <select
            id="category-filter"
            value={query.category}
            onChange={handleCategory}
            className={inputStyles(false)}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sort-select" className="sr-only">
            Sort products
          </label>
          <select
            id="sort-select"
            value={sortValue}
            onChange={handleSort}
            className={inputStyles(false)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleClear}
          disabled={!hasFilters}
          className={buttonStyles("secondary")}
        >
          Clear
        </button>
      </div>

      {query.q && (
        <p className="text-xs text-slate-500">
          Searching across all categories. Choosing a category will clear the search.
        </p>
      )}
    </div>
  );
}
