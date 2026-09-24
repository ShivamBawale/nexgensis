export function getTotalPages(total, limit) {
  return Math.max(1, Math.ceil(total / limit));
}

// Page buttons to show, e.g. [1, "ellipsis-start", 4, 5, 6, "ellipsis-end", 20].
export function getPageNumbers(currentPage, totalPages, siblings = 1) {
  const pages = [1];
  const start = Math.max(2, currentPage - siblings);
  const end = Math.min(totalPages - 1, currentPage + siblings);

  if (start > 2) pages.push("ellipsis-start");
  for (let page = start; page <= end; page++) pages.push(page);
  if (end < totalPages - 1) pages.push("ellipsis-end");
  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

// Text like "Showing 21–40 of 194".
export function getRangeLabel(page, limit, shownCount, total) {
  if (shownCount === 0) return `Showing 0 of ${total}`;
  const from = (page - 1) * limit + 1;
  const to = from + shownCount - 1;
  return `Showing ${from}–${to} of ${total}`;
}
