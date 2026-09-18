import { apiUrl } from "./apiConfig";

/**
 * Zero-Authentication Global Geocoding Client via Open-Meteo
 */

export async function searchGlobalLocations(query) {
  if (!query || query.trim().length < 2) return [];
  const cleanQ = query.trim();

  // 1. Try FastAPI backend route
  try {
    const res = await fetch(apiUrl(`/api/satellite/geocode?query=${encodeURIComponent(cleanQ)}`));
    if (res.ok) {
      const data = await res.json();
      if (data && data.results && data.results.length > 0) return data.results;
    }
  } catch (err) {
    // Fallback to public Open-Meteo endpoint
  }

  // 2. Direct Open-Meteo Geocoding API fallback
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQ)}&count=5&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((r) => ({
      id: r.id,
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      elevation: r.elevation || 0,
      country: r.country || "",
      country_code: r.country_code || "",
      admin1: r.admin1 || "",
      timezone: r.timezone || "UTC"
    }));
  } catch (err) {
    console.error("Geocoding lookup error:", err);
    return [];
  }
}
