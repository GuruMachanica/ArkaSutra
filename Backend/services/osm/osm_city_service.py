import time
import httpx
from typing import Dict, Any, List

_OSM_CACHE: Dict[str, Dict[str, Any]] = {}
CACHE_TTL = 3600

async def fetch_osm_buildings(lat: float, lon: float, radius: int = 180) -> List[Dict[str, Any]]:
    cache_key = f"osm:{round(lat, 4)}:{round(lon, 4)}:{radius}"
    now = time.time()
    if cache_key in _OSM_CACHE and (now - _OSM_CACHE[cache_key]["time"] < CACHE_TTL):
        return _OSM_CACHE[cache_key]["data"]

    query = f"""
    [out:json][timeout:10];
    way["building"](around:{radius},{lat},{lon});
    out body geom;
    """
    url = "https://overpass-api.de/api/interpreter"
    headers = {
        "User-Agent": "SunMap-3D-Solar-Engine/2.1 (https://github.com/GuruMachanica/SunMap)"
    }

    try:
        async with httpx.AsyncClient(timeout=8.0, headers=headers) as client:
            res = await client.post(url, data={"data": query})
            res.raise_for_status()
            elements = res.json().get("elements", [])
            _OSM_CACHE[cache_key] = {"time": now, "data": elements}
            return elements
    except Exception as exc:
        print(f"OSM Overpass notice: {exc}. Activating zero-downtime urban synthesizer.")
        return []
