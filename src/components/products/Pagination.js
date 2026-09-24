import { getPageNumbers } from "@/lib/pagination";

const pageButton =
  "min-w-9 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={`${pageButton} text-slate-700 hover:bg-slate-100`}
      >
        Previous
      </button>

      {getPageNumbers(page, totalPages).map((item) =>
        typeof item === "string" ? (
          <span key={item} className="px-2 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={`${pageButton} ${
              item === page ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={`${pageButton} text-slate-700 hover:bg-slate-100`}
      >
        Next
      </button>
    </nav>
  );
}
