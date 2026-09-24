"use client";

import { useState } from "react";
import Image from "next/image";
import { OPTIMIZED_IMAGE_HOST } from "@/lib/constants";

// Shows a product image, or a grey placeholder if there is none or it fails to load.
export default function ProductImage({ src, alt, size, className = "" }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400 ${className}`}
      >
        No image
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      // Only DummyJSON's CDN is allowed in next.config.mjs; other URLs (typed into
      // the product form) are shown as-is.
      unoptimized={!src.startsWith(OPTIMIZED_IMAGE_HOST)}
      onError={() => setFailedSrc(src)}
      className={`shrink-0 rounded-lg bg-slate-100 object-contain ${className}`}
    />
  );
}
