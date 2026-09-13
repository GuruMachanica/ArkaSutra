import math
from typing import Dict, Any, List

def lat_lon_to_meters(lat: float, lon: float, center_lat: float, center_lon: float):
    # Equirectangular approximation for small radii (<5km)
    d_lat = (lat - center_lat) * 111139.0
    d_lon = (lon - center_lon) * (111139.0 * math.cos(math.radians(center_lat)))
    return round(d_lon, 2), round(-d_lat, 2)

def polygon_area_2d(pts: List[List[float]]) -> float:
    n = len(pts)
    if n < 3: return 0.0
    area = 0.0
    for i in range(n):
        j = (i + 1) % n
        area += pts[i][0] * pts[j][1] - pts[j][0] * pts[i][1]
    return round(abs(area) * 0.5, 1)

def parse_osm_element(el: Dict[str, Any], center_lat: float, center_lon: float) -> Dict[str, Any]:
    tags = el.get("tags", {})
    geom = el.get("geometry", [])
    if len(geom) < 3: return None

    cartesian_pts = [lat_lon_to_meters(pt["lat"], pt["lon"], center_lat, center_lon) for pt in geom]
    area = polygon_area_2d(cartesian_pts)
    if area < 15.0: return None  # Skip tiny sheds/kiosks

    # Parse height or estimate from levels
    levels = float(tags.get("building:levels", 2.0)) if tags.get("building:levels", "").replace(".", "", 1).isdigit() else 2.0
    height_tag = tags.get("height", "")
    height = float(height_tag.replace("m", "").strip()) if height_tag.replace("m", "").strip().replace(".", "", 1).isdigit() else levels * 3.2

    # Roof shape & orientation
    roof_shape = tags.get("roof:shape", "flat").lower()
    roof_orientation = float(tags.get("roof:direction", 180.0)) if tags.get("roof:direction", "").isdigit() else 180.0
    roof_tilt = 30.0 if roof_shape in ["gabled", "hipped", "pitched"] else 5.0

    center_x = round(sum(p[0] for p in cartesian_pts) / len(cartesian_pts), 2)
    center_z = round(sum(p[1] for p in cartesian_pts) / len(cartesian_pts), 2)

    return {
        "osm_id": el.get("id"),
        "name": tags.get("name") or tags.get("addr:housename") or f"Building #{el.get('id')}",
        "type": tags.get("building", "yes"),
        "center": {"x": center_x, "z": center_z},
        "polygon": cartesian_pts,
        "height": round(height, 1),
        "levels": int(levels),
        "roof_shape": roof_shape,
        "roof_area_m2": area,
        "roof_tilt_deg": roof_tilt,
        "roof_azimuth_deg": roof_orientation
    }
