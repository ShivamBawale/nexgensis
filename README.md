# Nexgensis Admin: Product Dashboard

A small admin dashboard where a user logs in and manages products, built on the free
[DummyJSON](https://dummyjson.com) API.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Axios

- Live demo: _coming soon (Vercel)_
- Demo login: `emilys` / `emilyspass`

## Setup

Requirements: Node.js 20.9 or newer, npm.

```bash
git clone <repo-url>
cd nexgensis
npm install
npm run dev
```

Open http://localhost:3000.

Optional `.env.local`:

```bash
# Use a different API base URL (default: https://dummyjson.com)
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
# Add a delay (ms) to every API call, to test slow networks and search race conditions
NEXT_PUBLIC_API_DELAY=2000
```

Other scripts: `npm run build` (production build), `npm start`, `npm run lint`.

## What's finished

- [x] **Login** with `POST /auth/login`, error messages for wrong details, protected pages, logout
- [x] **Product list** with image, title, category, price, rating and stock. Table on desktop, cards on mobile
- [x] **Pagination** loaded from the API with `limit` and `skip`: page numbers, Previous/Next, page size (10/20/50) and "Showing 21–40 of 194"
- [x] **Search** with `/products/search?q=`, debounced (400 ms), goes back to page 1
- [x] **Category filter** (`/products/categories`) and **sort** by price, rating or title
- [x] **Product details** at `/products/[id]` with images, description, price and reviews, plus a "not found" page for bad ids
- [x] **Add / edit** form with validation, and a **confirm popup** before deleting
- [x] **Loading, empty and error states**, with a Retry button on errors
- [x] One shared **Axios instance** that adds the token and handles errors in one place
- [x] Page, size, search, category and sort are kept **in the URL**
- [x] No React Query, SWR, or table/pagination libraries

## Project structure

```
src/
  app/                        Routes only (thin files)
    login/                    Login page
    (dashboard)/              Pages that need login: AuthGuard + Navbar in layout.js
      products/               List
      products/new/           Add
      products/[id]/          Details
      products/[id]/edit/     Edit
  components/
    ui/                       Generic pieces: Spinner, ErrorState, ConfirmDialog, FormField…
    auth/                     AuthGuard, LoginView, LoginForm
    layout/                   Navbar
    products/                 Everything product-related, split into small components
  context/AuthContext.js      Logged-in user, login(), logout()
  hooks/                      useRequest, useProducts, useProductQuery, useDebouncedValue, useSubmitGuard
  services/                   All API calls (authService, productService). No API calls in UI code.
  lib/
    axios.js                  The shared Axios instance + interceptors
    session.js                Token storage
    productQuery.js           Read/validate/write the list state in the URL
    localProducts.js          Local copy of add/edit/delete (see below)
    pagination.js, productValidation.js, format.js, constants.js
```

## How the tricky parts are handled

**Old search results never replace new ones.** Every request goes through `useRequest`
(`src/hooks/useRequest.js`). When the search (or any list setting) changes, the old
request is **aborted** with an `AbortController`. Each result is also stored with the
key of the request it belongs to, and a result only counts if its key is still the
latest. So even if an old response arrives late, it is ignored. To test it, set
`NEXT_PUBLIC_API_DELAY=2000` and type fast.

**Search vs category.** DummyJSON can't search inside one category. I made them
**mutually exclusive**: typing a search clears the category, and choosing a category
clears the search. A note under the filters says this. I chose this because filtering
search results on the client would break server-side pagination: the page counts and
"Showing X of Y" would be wrong unless I downloaded every result. If a URL has both,
search wins. Sorting works with both.

**Add, edit and delete aren't really saved by the API.** The app still calls
`POST /products/add`, `PUT /products/:id` and `DELETE /products/:id` (so API errors
are still shown). After the API answers, the change is saved in `localStorage`
(`src/lib/localProducts.js`) and laid over every API response:
- New products get a unique local id and show first in the list (and in matching searches or categories).
- Edits are merged into the API product wherever it appears.
- Deleted products are filtered out, their details page shows "not found", and totals are adjusted.

The changes survive a refresh. Known limitation: after deleting, that page shows one row
fewer, because the API still counts the product.

**Bad URL values.** `src/lib/productQuery.js` checks every value. `?page=abc`,
`?limit=7` or `?sortBy=hack` fall back to defaults, and the address bar is cleaned up.
`?page=999` goes to the last page once the total is known. `/products/abc` shows the
"not found" page without calling the API.

**Clicking Save or Login many times.** `useSubmitGuard` uses a ref as a lock, so a second
click is ignored even before React re-renders the button as disabled. After a success
the lock stays on while the app navigates away.

**Auth.** The token is stored in `localStorage` and added to every request by the Axios
interceptor. A `401` on any request (except login) clears the session, and `AuthGuard`
sends the user to `/login?next=…` so they come back to the same page after logging in.
Logging in or out in one tab is picked up by other tabs too (`storage` event).
