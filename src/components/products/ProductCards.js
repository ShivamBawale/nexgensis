import Link from "next/link";
import { formatCategory, formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";
import Rating from "./Rating";
import StockBadge from "./StockBadge";
import ProductActions from "./ProductActions";

// Mobile layout.
export default function ProductCards({ products, onDelete }) {
  return (
    <ul className="space-y-3">
      {products.map((product) => (
        <li key={product.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex gap-3">
            <ProductImage src={product.thumbnail} alt={product.title} size={72} />
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${product.id}`}
                className="block truncate font-medium text-slate-900 hover:text-indigo-600"
              >
                {product.title}
              </Link>
              <p className="text-xs text-slate-500">{formatCategory(product.category)}</p>
              <p className="mt-1 font-semibold text-slate-900">{formatPrice(product.price)}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Rating value={product.rating} />
                <StockBadge stock={product.stock} />
              </div>
            </div>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-2">
            <ProductActions product={product} onDelete={onDelete} />
          </div>
        </li>
      ))}
    </ul>
  );
}
