"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants";
import { inputStyles } from "@/components/ui/FormField";

// `value` is the search term in the URL. The box keeps its own text while the
// user types, and only reports it (onSearch) once typing stops.
export default function SearchInput({ value, onSearch }) {
  const [text, setText] = useState(value);
  const debouncedText = useDebouncedValue(text, SEARCH_DEBOUNCE_MS);
  const lastSentRef = useRef(value);

  const sendSearch = useEffectEvent((term) => onSearch(term));

  // Typing stopped → update the URL.
  useEffect(() => {
    const term = debouncedText.trim();
    if (term === lastSentRef.current) return;
    lastSentRef.current = term;
    sendSearch(term);
  }, [debouncedText]);

  // The URL changed from somewhere else (Back button, "Clear filters") → update the box.
  useEffect(() => {
    if (value === lastSentRef.current) return;
    lastSentRef.current = value;
    setText(value);
  }, [value]);

  return (
    <div className="relative">
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <input
        id="product-search"
        type="search"
        placeholder="Search products…"
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={100}
        className={inputStyles(false)}
      />
    </div>
  );
}
