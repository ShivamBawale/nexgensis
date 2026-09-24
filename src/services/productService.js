import api, { ApiError } from "@/lib/axios";
import {
  applyLocalChanges,
  countDeletedMatching,
  findCreatedProduct,
  getCreatedProducts,
  isDeleted,
  matchesFilters,
  saveCreatedProduct,
  saveProductDeletion,
  saveProductEdit,
  sortProducts,
} from "@/lib/localProducts";

const LIST_FIELDS = "title,description,category,brand,price,rating,stock,thumbnail";

// ---- raw API calls ----

async function fetchProductList({ q, category, sortBy, order, skip, limit }, signal) {
  const params = { skip, limit, select: LIST_FIELDS };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order;
  }

  let url = "/products";
  if (q) {
    url = "/products/search";
    params.q = q;
  } else if (category) {
    url = `/products/category/${encodeURIComponent(category)}`;
  }

  const { data } = await api.get(url, { params, signal });
  return data;
}

export async function getCategories(signal) {
  const { data } = await api.get("/products/categories", { signal });
  return data.map(({ slug, name }) => ({ slug, name }));
}

// ---- list page ----

// Locally created products are listed before the API products. This works out
// which slice of each list belongs on the requested page.
function planPage({ page, limit }, localCount) {
  const start = (page - 1) * limit;
  const localTaken = Math.max(0, Math.min(limit, localCount - start));
  const apiLimit = limit - localTaken;
  return {
    localStart: start,
    localTaken,
    apiSkip: Math.max(0, start - localCount),
    // limit=0 means "everything" to DummyJSON, so ask for 1 and ignore it
    // when the page is already full of local products (we still need the total).
    apiLimit: Math.max(apiLimit, 1),
    useApiItems: apiLimit > 0,
  };
}

export async function fetchProductPage(query, signal) {
  const localMatches = sortProducts(
    getCreatedProducts().filter((product) => matchesFilters(product, query)),
    query
  );
  const plan = planPage(query, localMatches.length);

  const data = await fetchProductList(
    { ...query, skip: plan.apiSkip, limit: plan.apiLimit },
    signal
  );

  const products = [
    ...localMatches.slice(plan.localStart, plan.localStart + plan.localTaken),
    ...(plan.useApiItems ? applyLocalChanges(data.products) : []),
  ];
  const total = Math.max(0, data.total + localMatches.length - countDeletedMatching(query));

  return { products, total };
}

// ---- details page ----

export async function fetchProductDetails(id, signal) {
  const local = findCreatedProduct(id);
  if (local) return local;
  if (isDeleted(id)) throw new ApiError(`Product with id '${id}' not found`, 404);

  const { data } = await api.get(`/products/${id}`, { signal });
  return applyLocalChanges([data])[0];
}

// ---- add / edit / delete ----

export async function createProduct(payload) {
  const { data } = await api.post("/products/add", payload);
  // DummyJSON always answers with id 195, so we make our own unique id.
  const product = {
    ...data,
    ...payload,
    id: Date.now(),
    isLocal: true,
    rating: 0,
    images: payload.thumbnail ? [payload.thumbnail] : [],
    reviews: [],
  };
  saveCreatedProduct(product);
  return product;
}

export async function updateProduct(product, payload) {
  // Products we created only exist in this browser, so the API would answer 404.
  if (!product.isLocal) {
    await api.put(`/products/${product.id}`, payload);
  }
  saveProductEdit(product, payload);
  return { ...product, ...payload };
}

export async function deleteProduct(product) {
  if (!product.isLocal) {
    await api.delete(`/products/${product.id}`);
  }
  saveProductDeletion(product);
}
