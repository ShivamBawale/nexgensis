import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { buttonStyles } from "@/components/ui/buttonStyles";
import ProductTable from "./ProductTable";
import ProductCards from "./ProductCards";
import ListFooter from "./ListFooter";

// Chooses between the loading, error, empty and "has products" views.
export default function ProductResults({
  query,
  data,
  error,
  isLoading,
  totalPages,
  onChange,
  onRetry,
  onDelete,
}) {
  if (error) return <ErrorState message={error.message} onRetry={onRetry} />;

  // First load: nothing to show yet.
  if (!data) return <LoadingState label="Loading products…" />;

  if (!isLoading && data.products.length === 0) {
    const isFiltered = Boolean(query.q || query.category);
    return (
      <EmptyState
        title="No products found"
        message={
          isFiltered
            ? "Nothing matches your search or filter. Try different words or clear the filters."
            : "There are no products yet."
        }
        action={
          isFiltered && (
            <button
              type="button"
              onClick={() => onChange({ q: "", category: "", page: 1 })}
              className={buttonStyles("secondary")}
            >
              Clear filters
            </button>
          )
        }
      />
    );
  }

  // While a new page loads we keep the old rows on screen (faded) instead of
  // flashing an empty loader on every click.
  return (
    <div className="space-y-4">
      <div aria-busy={isLoading} className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-start justify-center pt-16">
            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow">
              <Spinner className="h-4 w-4 text-indigo-600" /> Loading…
            </span>
          </div>
        )}
        <div className={isLoading ? "pointer-events-none opacity-50" : undefined}>
          <div className="hidden md:block">
            <ProductTable products={data.products} onDelete={onDelete} />
          </div>
          <div className="md:hidden">
            <ProductCards products={data.products} onDelete={onDelete} />
          </div>
        </div>
      </div>

      <ListFooter
        query={query}
        shownCount={data.products.length}
        total={data.total}
        totalPages={totalPages}
        onChange={onChange}
      />
    </div>
  );
}
