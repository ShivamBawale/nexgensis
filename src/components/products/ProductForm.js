"use client";

import { useState } from "react";
import Link from "next/link";
import { useCategories } from "@/hooks/useProducts";
import { useSubmitGuard } from "@/hooks/useSubmitGuard";
import { toProductPayload, validateProduct } from "@/lib/productValidation";
import FormField, { inputStyles } from "@/components/ui/FormField";
import Spinner from "@/components/ui/Spinner";
import { buttonStyles } from "@/components/ui/buttonStyles";

// Used by both "Add product" and "Edit product".
// `onSubmit(payload)` saves the product and navigates away.
export default function ProductForm({ initialValues, submitLabel, cancelHref, onSubmit }) {
  const { categories, error: categoriesError } = useCategories();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [save, isSaving] = useSubmitGuard(onSubmit);

  function handleChange(event) {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    // Once a field has been left, re-check it on every keystroke.
    if (touched[name]) setErrors(validateProduct(nextValues));
  }

  function handleBlur(event) {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
    setErrors(validateProduct(values));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateProduct(values);
    setErrors(nextErrors);
    setTouched(Object.fromEntries(Object.keys(values).map((key) => [key, true])));
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitError("");
    try {
      await save(toProductPayload(values));
    } catch (error) {
      setSubmitError(error.message);
    }
  }

  // Only show an error after the user has touched the field (or tried to submit).
  function fieldProps(name) {
    const error = touched[name] ? errors[name] : undefined;
    return {
      id: name,
      name,
      value: values[name],
      onChange: handleChange,
      onBlur: handleBlur,
      "aria-invalid": Boolean(error),
      "aria-describedby": error ? `${name}-error` : undefined,
      className: inputStyles(error),
    };
  }

  const errorFor = (name) => (touched[name] ? errors[name] : undefined);

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-6"
    >
      {submitError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <FormField id="title" label="Title *" error={errorFor("title")}>
        <input {...fieldProps("title")} maxLength={100} />
      </FormField>

      <FormField id="description" label="Description *" error={errorFor("description")}>
        <textarea {...fieldProps("description")} rows={4} maxLength={1000} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="category"
          label="Category *"
          error={errorFor("category") || (categoriesError && "Could not load categories.")}
        >
          <select {...fieldProps("category")}>
            <option value="">Choose a category</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id="brand" label="Brand" error={errorFor("brand")}>
          <input {...fieldProps("brand")} maxLength={50} />
        </FormField>

        <FormField id="price" label="Price (USD) *" error={errorFor("price")}>
          <input {...fieldProps("price")} inputMode="decimal" placeholder="19.99" />
        </FormField>

        <FormField id="stock" label="Stock *" error={errorFor("stock")}>
          <input {...fieldProps("stock")} inputMode="numeric" placeholder="0" />
        </FormField>
      </div>

      <FormField
        id="thumbnail"
        label="Image URL"
        error={errorFor("thumbnail")}
        hint="Optional. A link to a product photo."
      >
        <input {...fieldProps("thumbnail")} type="url" placeholder="https://…" />
      </FormField>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <Link href={cancelHref} className={buttonStyles("secondary")}>
          Cancel
        </Link>
        <button type="submit" disabled={isSaving} className={buttonStyles("primary")}>
          {isSaving && <Spinner className="h-4 w-4" />}
          {isSaving ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
