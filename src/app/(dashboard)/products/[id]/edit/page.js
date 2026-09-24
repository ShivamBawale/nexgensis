import EditProductView from "@/components/products/EditProductView";

export const metadata = { title: "Edit product · Nexgensis Admin" };

export default async function EditProductPage({ params }) {
  const { id } = await params;
  return <EditProductView id={id} />;
}
