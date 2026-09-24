export const EMPTY_PRODUCT_FORM = {
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  stock: "",
  thumbnail: "",
};

export function productToFormValues(product) {
  return {
    title: product.title ?? "",
    description: product.description ?? "",
    category: product.category ?? "",
    brand: product.brand ?? "",
    price: product.price != null ? String(product.price) : "",
    stock: product.stock != null ? String(product.stock) : "",
    thumbnail: product.thumbnail ?? "",
  };
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Returns { fieldName: "message" } for every invalid field. Empty object = valid.
export function validateProduct(values) {
  const errors = {};

  const title = values.title.trim();
  if (!title) errors.title = "Title is required.";
  else if (title.length < 3) errors.title = "Title must be at least 3 characters.";
  else if (title.length > 100) errors.title = "Title must be 100 characters or less.";

  const description = values.description.trim();
  if (!description) errors.description = "Description is required.";
  else if (description.length < 10)
    errors.description = "Description must be at least 10 characters.";
  else if (description.length > 1000)
    errors.description = "Description must be 1000 characters or less.";

  if (!values.category) errors.category = "Choose a category.";

  if (values.brand.trim().length > 50) errors.brand = "Brand must be 50 characters or less.";

  const price = values.price.trim();
  if (!price) errors.price = "Price is required.";
  else if (!/^\d+(\.\d{1,2})?$/.test(price))
    errors.price = "Enter a valid price with up to 2 decimals, e.g. 19.99.";
  else if (Number(price) <= 0) errors.price = "Price must be more than 0.";
  else if (Number(price) > 1000000) errors.price = "Price must be 1,000,000 or less.";

  const stock = values.stock.trim();
  if (!stock) errors.stock = "Stock is required.";
  else if (!/^\d+$/.test(stock)) errors.stock = "Stock must be a whole number (0 or more).";
  else if (Number(stock) > 100000) errors.stock = "Stock must be 100,000 or less.";

  const thumbnail = values.thumbnail.trim();
  if (thumbnail && !isValidUrl(thumbnail))
    errors.thumbnail = "Enter a full image URL starting with http:// or https://.";

  return errors;
}

// Converts form strings into the object we send to the API.
export function toProductPayload(values) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category,
    brand: values.brand.trim(),
    price: Number(values.price),
    stock: Number(values.stock),
    thumbnail: values.thumbnail.trim(),
  };
}
