// DummyJSON only pretends to save add/edit/delete. We still call the API, then
// remember the change here (in localStorage) and lay it over every API response,
// so the change shows up in the list and details pages and survives a refresh.
//
// Shape: { created: [product], updated: { [id]: fields }, deleted: { [id]: product } }

const STORAGE_KEY = "nexgensis.productChanges";

function emptyChanges() {
  return { created: [], updated: {}, deleted: {} };
}

function readChanges() {
  if (typeof window === "undefined") return emptyChanges();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...emptyChanges(), ...JSON.parse(raw) } : emptyChanges();
  } catch {
    return emptyChanges();
  }
}

function writeChanges(changes) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(changes));
  } catch {
    // Storage full or blocked: the change still shows until the next reload.
  }
}

export function matchesFilters(product, { q, category }) {
  if (q) {
    const term = q.toLowerCase();
    return (
      product.title?.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term)
    );
  }
  if (category) return product.category === category;
  return true;
}

export function sortProducts(products, { sortBy, order }) {
  if (!sortBy) return products;
  const direction = order === "desc" ? -1 : 1;
  return [...products].sort((a, b) => {
    const left = a[sortBy] ?? "";
    const right = b[sortBy] ?? "";
    if (typeof left === "string") return left.localeCompare(right) * direction;
    return (left - right) * direction;
  });
}

// ---- reading ----

export function getCreatedProducts() {
  return readChanges().created;
}

export function findCreatedProduct(id) {
  return readChanges().created.find((product) => product.id === id) ?? null;
}

export function isDeleted(id) {
  return Boolean(readChanges().deleted[id]);
}

// Applies local edits and deletions to products that came from the API.
export function applyLocalChanges(products) {
  const { updated, deleted } = readChanges();
  return products
    .filter((product) => !deleted[product.id])
    .map((product) => (updated[product.id] ? { ...product, ...updated[product.id] } : product));
}

// How many API products matching the current filters were deleted locally.
export function countDeletedMatching(filters) {
  return Object.values(readChanges().deleted).filter(
    (product) => !product.isLocal && matchesFilters(product, filters)
  ).length;
}

// ---- writing ----

export function saveCreatedProduct(product) {
  const changes = readChanges();
  changes.created = [product, ...changes.created];
  writeChanges(changes);
}

export function saveProductEdit(product, fields) {
  const changes = readChanges();
  if (product.isLocal) {
    changes.created = changes.created.map((item) =>
      item.id === product.id ? { ...item, ...fields } : item
    );
  } else {
    changes.updated[product.id] = { ...changes.updated[product.id], ...fields };
  }
  writeChanges(changes);
}

export function saveProductDeletion(product) {
  const changes = readChanges();
  if (product.isLocal) {
    changes.created = changes.created.filter((item) => item.id !== product.id);
  } else {
    // Keep a small snapshot so we can adjust totals for matching searches.
    changes.deleted[product.id] = {
      id: product.id,
      title: product.title,
      description: product.description,
      category: product.category,
    };
    delete changes.updated[product.id];
  }
  writeChanges(changes);
}

export function clearLocalChanges() {
  writeChanges(emptyChanges());
}
