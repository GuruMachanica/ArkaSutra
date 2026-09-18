/**
 * ArkaSutra API Configuration
 * Supports VITE_API_URL for remote deployment (e.g. Render/Netlify)
 */

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  ""
).replace(/\/+$/, "");

export function apiUrl(path) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}
