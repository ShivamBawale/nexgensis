export default function StockBadge({ stock }) {
  let style = "bg-emerald-50 text-emerald-700";
  if (stock === 0) style = "bg-red-50 text-red-700";
  else if (stock < 10) style = "bg-amber-50 text-amber-700";

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>
      {stock === 0 ? "Out of stock" : `${stock} in stock`}
    </span>
  );
}
