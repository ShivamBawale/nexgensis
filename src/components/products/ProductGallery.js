"use client";

import { useState } from "react";
import ProductImage from "./ProductImage";

export default function ProductGallery({ images, title }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = images[selectedIndex] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="flex aspect-square items-center justify-center rounded-xl bg-slate-50">
        <ProductImage src={selected} alt={title} size={480} className="h-full w-full" />
      </div>

      {images.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={index === selectedIndex}
              className={`rounded-lg border-2 p-0.5 ${
                index === selectedIndex ? "border-indigo-600" : "border-transparent"
              }`}
            >
              <ProductImage src={image} alt="" size={64} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
