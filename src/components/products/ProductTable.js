import Link from "next/link";
import { formatCategory, formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";
import Rating from "./Rating";
import StockBadge from "./StockBadge";
import ProductActions from "./ProductActions";

const COLUMNS = ["Product", "Category", "Price", "Rating", "Stock", "Actions"];

// Desktop layout.
export default function ProductTable({ products, onDelete }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} scope="col" className="px-4 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <ProductImage src={product.thumbnail} alt={product.title} size={48} />
                  <Link
                    href={`/products/${product.id}`}
                    className="font-medium text-slate-900 hover:text-indigo-600"
                  >
                    {product.title}
                  </Link>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-600">{formatCategory(product.category)}</td>
              <td className="px-4 py-3 font-medium text-slate-900">{formatPrice(product.price)}</td>
              <td className="px-4 py-3">
                <Rating value={product.rating} />
              </td>
              <td className="px-4 py-3">
                <StockBadge stock={product.stock} />
              </td>
              <td className="px-4 py-3">
                <ProductActions product={product} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
