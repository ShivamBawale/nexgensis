export default function Rating({ value }) {
  if (!value) return <span className="text-sm text-slate-400">No rating</span>;
  return (
    <span className="inline-flex items-center gap-1 text-sm text-slate-700">
      <span aria-hidden="true" className="text-amber-500">
        ★
      </span>
      {value.toFixed(1)}
      <span className="sr-only">out of 5</span>
    </span>
  );
}
