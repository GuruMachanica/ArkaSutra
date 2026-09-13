from fastapi import APIRouter, Query

try:
    from Backend.services.satellite import fetch_satellite_solar_telemetry, geocode_location
except ImportError:
    from services.satellite import fetch_satellite_solar_telemetry, geocode_location

router = APIRouter(prefix="/api/satellite", tags=["Satellite Telemetry"])

@router.get("/live-solar")
async def get_live_satellite_solar(
    latitude: float = Query(..., description="Latitude in decimal degrees"),
    longitude: float = Query(..., description="Longitude in decimal degrees")
):
    """Retrieve real-time satellite solar radiation, cloud cover %, and weather telemetry."""
    return await fetch_satellite_solar_telemetry(latitude, longitude)

@router.get("/geocode")
async def geocode_city_search(
    query: str = Query(..., min_length=2, description="City name to search")
):
    """Zero-key geocoding search to resolve any global city or address to coordinates."""
    results = await geocode_location(query)
    return {"query": query, "count": len(results), "results": results}
