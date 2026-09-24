import Link from "next/link";
import { buttonStyles } from "@/components/ui/buttonStyles";

// View / Edit / Delete buttons used by both the table and the cards.
export default function ProductActions({ product, onDelete }) {
  return (
    <div className="flex items-center gap-1">
      <Link href={`/products/${product.id}`} className={buttonStyles("ghost", "px-2 py-1")}>
        View
      </Link>
      <Link href={`/products/${product.id}/edit`} className={buttonStyles("ghost", "px-2 py-1")}>
        Edit
      </Link>
      <button
        type="button"
        onClick={() => onDelete(product)}
        className={buttonStyles("ghost", "px-2 py-1 text-red-600 hover:bg-red-50")}
      >
        Delete
      </button>
    </div>
  );
}
