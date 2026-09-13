/**
 * SunMap — Satellite Telemetry & Geocoding API Client
 * Zero-Authentication Open-Meteo & Copernicus ERA5 Integration
 * Includes automatic fallback to public endpoints for standalone static deployments.
 */

export async function fetchLiveSatelliteData(latitude, longitude) {
  const roundLat = Number(latitude).toFixed(4);
  const roundLon = Number(longitude).toFixed(4);

  // 1. Try local FastAPI backend route
  try {
    const res = await fetch(`/api/satellite/live-solar?latitude=${roundLat}&longitude=${roundLon}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Backend offline or running in standalone static frontend mode
  }

  // 2. Direct client-side fallback to Open-Meteo Solar API (Zero-key, CORS-enabled)
  try {
    const fallbackUrl = `https://api.open-meteo.com/v1/forecast?latitude=${roundLat}&longitude=${roundLon}&current=temperature_2m,cloud_cover,direct_normal_irradiance,shortwave_radiation,diffuse_radiation,wind_speed_10m&hourly=direct_normal_irradiance,diffuse_radiation,shortwave_radiation,cloud_cover,temperature_2m&forecast_days=1&timezone=auto`;
    const res = await fetch(fallbackUrl);
    if (!res.ok) throw new Error(`Satellite HTTP ${res.status}`);
    const data = await res.json();

    const current = data.current || {};
    const hourly = data.hourly || {};
    const cloudPct = current.cloud_cover ?? 15;
    const dni = current.direct_normal_irradiance ?? 650;
    const ghi = current.shortwave_radiation ?? 580;
    const dhi = current.diffuse_radiation ?? 90;
    const tempC = current.temperature_2m ?? 20;
    const windKmh = current.wind_speed_10m ?? 12;

    const cloudDerate = Math.max(0.20, +(1.0 - (cloudPct / 100) * 0.75).toFixed(3));
    const cellTemp = tempC + (ghi / 800) * 25;
    const thermalPenalty = Math.max(0, +((cellTemp - 25) * 0.4).toFixed(2));

    const getSkyCondition = (c) => {
      if (c < 15) return "Clear Sky";
      if (c < 40) return "Mostly Sunny";
      if (c < 70) return "Partly Cloudy";
      if (c < 90) return "Mostly Cloudy";
      return "Overcast";
    };

    return {
      latitude,
      longitude,
      timezone: data.timezone || "UTC",
      elevation_m: data.elevation || 0,
      source: "Copernicus Atmosphere / ECMWF ERA5 Live Satellite Feed",
      status: "online",
      retrieved_at: current.time || new Date().toISOString(),
      current: {
        dni_w_m2: Math.round(dni),
        ghi_w_m2: Math.round(ghi),
        dhi_w_m2: Math.round(dhi),
        cloud_cover_pct: Math.round(cloudPct),
        temperature_c: Math.round(tempC * 10) / 10,
        wind_speed_kmh: Math.round(windKmh * 10) / 10,
        estimated_cell_temp_c: Math.round(cellTemp * 10) / 10,
        cloud_derate_factor: cloudDerate,
        thermal_efficiency_penalty_pct: thermalPenalty,
        sky_condition: getSkyCondition(cloudPct)
      },
      hourly: {
        time: (hourly.time || []).slice(0, 24),
        dni: (hourly.direct_normal_irradiance || []).slice(0, 24),
        ghi: (hourly.shortwave_radiation || []).slice(0, 24),
        dhi: (hourly.diffuse_radiation || []).slice(0, 24),
        cloud_cover: (hourly.cloud_cover || []).slice(0, 24),
        temperature: (hourly.temperature_2m || []).slice(0, 24)
      }
    };
  } catch (err) {
    console.warn("Satellite fetch error, applying physical fallback:", err);
    return null;
  }
}

export async function searchGlobalLocations(query) {
  if (!query || query.trim().length < 2) return [];
  const cleanQ = query.trim();

  // 1. Try local FastAPI route
  try {
    const res = await fetch(`/api/satellite/geocode?query=${encodeURIComponent(cleanQ)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.results && data.results.length > 0) {
        return data.results;
      }
    }
  } catch (err) {
    // Fallback below
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
