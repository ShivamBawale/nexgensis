import { PAGE_SIZES } from "@/lib/constants";
import { getRangeLabel } from "@/lib/pagination";
import Pagination from "./Pagination";

export default function ListFooter({ query, shownCount, total, totalPages, onChange }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <p aria-live="polite">{getRangeLabel(query.page, query.limit, shownCount, total)}</p>
        <label className="flex items-center gap-2">
          Rows per page
          <select
            value={query.limit}
            onChange={(event) => onChange({ limit: Number(event.target.value), page: 1 })}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Pagination
        page={query.page}
        totalPages={totalPages}
        onPageChange={(page) => onChange({ page })}
      />
    </div>
  );
}
