/**
 * Frontend env helpers.
 * Set these in frontend/.env (Vite requires the VITE_ prefix).
 *
 * VITE_API_URL=http://localhost:8080
 * VITE_CONTRACT_ADDRESS=0xeB98...
 * VITE_CHAT_API_URL=http://localhost:5000
 */

const trimSlash = (value) => (value || "").replace(/\/+$/, "");

export const API_URL = trimSlash(
  import.meta.env.VITE_API_URL || "http://localhost:8080"
);

export const CHAT_API_URL = trimSlash(
  import.meta.env.VITE_CHAT_API_URL ||
    import.meta.env.VITE_API_BASE ||
    "http://localhost:5000"
);

export const CONTRACT_ADDRESS =
  (import.meta.env.VITE_CONTRACT_ADDRESS || "").trim() ||
  "0xeB98EC380e7FA5F2b53A8BE2C4AB1982A536C6EB";

/** Build a full backend API URL from a path like "/api/auctions" */
export const apiUrl = (path = "") => {
  if (!path) return API_URL;
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

/** Build a full chatbot API URL */
export const chatApiUrl = (path = "") => {
  if (!path) return CHAT_API_URL;
  return `${CHAT_API_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
