// The one shared Axios instance. Every API call in the app goes through here.
import axios from "axios";
import { API_BASE_URL, API_DELAY } from "./constants";
import { clearSession, getToken } from "./session";

export class ApiError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach the login token to every request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (API_DELAY) {
    config.params = { ...config.params, delay: API_DELAY };
  }
  return config;
});

function toApiError(error) {
  if (error.code === "ECONNABORTED") {
    return new ApiError("The server took too long to respond. Please try again.");
  }
  if (!error.response) {
    return new ApiError("Network error. Check your internet connection and try again.");
  }
  const { status, data } = error.response;
  const fallback =
    status >= 500 ? "The server had a problem. Please try again." : "Something went wrong.";
  return new ApiError(data?.message || fallback, status);
}

// Turn every failure into an ApiError with a readable message, in one place.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Requests we cancelled on purpose (see hooks/useProducts.js) are passed through
    // untouched so callers can recognise and ignore them.
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Token expired or invalid: log out. AuthGuard sees the empty session and
    // sends the user to /login.
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !isLoginRequest && typeof window !== "undefined") {
      clearSession();
    }

    return Promise.reject(toApiError(error));
  }
);

export default api;
