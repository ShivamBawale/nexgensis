import ProductDetailsView from "@/components/products/ProductDetailsView";

export const metadata = { title: "Product · Nexgensis Admin" };

export default async function ProductPage({ params }) {
  const { id } = await params;
  return <ProductDetailsView id={id} />;
}
