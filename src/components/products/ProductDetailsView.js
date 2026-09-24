"use client";

import ProductLoader from "./ProductLoader";
import ProductDetails from "./ProductDetails";

export default function ProductDetailsView({ id }) {
  return <ProductLoader id={id}>{(product) => <ProductDetails product={product} />}</ProductLoader>;
}
