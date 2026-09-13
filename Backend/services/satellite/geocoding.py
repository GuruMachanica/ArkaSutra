import httpx
from typing import Dict, Any, List
from .cache import get_cache_key, get_from_cache, set_in_cache

async def geocode_location(query: str) -> List[Dict[str, Any]]:
    """
    Geocodes city name or address into latitude and longitude.
    Uses Open-Meteo Geocoding API (Zero-auth, global coverage).
    """
    if not query or len(query.strip()) < 2:
        return []

    cache_key = get_cache_key("geo", query.strip().lower())
    cached = get_from_cache(cache_key, ttl=3600)
    if cached is not None:
        return cached

    url = "https://geocoding-api.open-meteo.com/v1/search"
    params = {
        "name": query.strip(),
        "count": 5,
        "language": "en",
        "format": "json"
    }

    async with httpx.AsyncClient(timeout=8.0) as client:
        try:
            res = await client.get(url, params=params)
            res.raise_for_status()
            data = res.json()
            raw_results = data.get("results", [])
        except Exception:
            return []

    formatted = []
    for item in raw_results:
        formatted.append({
            "id": item.get("id"),
            "name": item.get("name"),
            "latitude": item.get("latitude"),
            "longitude": item.get("longitude"),
            "elevation": item.get("elevation", 0),
            "country": item.get("country", ""),
            "country_code": item.get("country_code", ""),
            "admin1": item.get("admin1", ""),
            "timezone": item.get("timezone", "UTC")
        })

    set_in_cache(cache_key, formatted)
    return formatted
