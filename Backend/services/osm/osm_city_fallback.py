import random
import math
from typing import Dict, Any, List
from .osm_solar_calculator import enrich_building_solar

def generate_city_fallback_buildings(center_lat: float, center_lon: float, count: int = 18) -> List[Dict[str, Any]]:
    # Deterministic pseudo-random seed based on coordinates so the city stays consistent
    seed = int((abs(center_lat) * 1000 + abs(center_lon) * 1000)) % 100000
    rng = random.Random(seed)

    building_types = [
        {"type": "commercial", "w": (18, 32), "d": (18, 30), "h": (12, 28), "tilt": (0, 10), "az": (160, 200)},
        {"type": "residential", "w": (10, 16), "d": (12, 18), "h": (6, 12), "tilt": (25, 42), "az": (170, 190)},
        {"type": "civic", "w": (22, 38), "d": (20, 35), "h": (10, 20), "tilt": (5, 15), "az": (150, 210)},
        {"type": "mixed_use", "w": (14, 24), "d": (16, 26), "h": (15, 32), "tilt": (0, 8), "az": (180, 180)}
    ]

    buildings = []
    grid_size = int(math.ceil(math.sqrt(count)))
    spacing = 38.0

    for idx in range(count):
        row = idx // grid_size
        col = idx % grid_size
        offset_x = (col - grid_size / 2.0) * spacing + rng.uniform(-6, 6)
        offset_z = (row - grid_size / 2.0) * spacing + rng.uniform(-6, 6)

        archetype = rng.choice(building_types)
        w = round(rng.uniform(*archetype["w"]), 1)
        d = round(rng.uniform(*archetype["d"]), 1)
        h = round(rng.uniform(*archetype["h"]), 1)
        tilt = round(rng.uniform(*archetype["tilt"]), 1)
        az = round(rng.uniform(*archetype["az"]), 1)

        half_w, half_d = w / 2.0, d / 2.0
        polygon = [
            [round(offset_x - half_w, 2), round(offset_z - half_d, 2)],
            [round(offset_x + half_w, 2), round(offset_z - half_d, 2)],
            [round(offset_x + half_w, 2), round(offset_z + half_d, 2)],
            [round(offset_x - half_w, 2), round(offset_z + half_d, 2)]
        ]
        area = round(w * d, 1)

        bldg = {
            "osm_id": 100000 + idx,
            "name": f"City Block {row+1}{chr(65+col)} ({archetype['type'].title()})",
            "type": archetype["type"],
            "center": {"x": round(offset_x, 2), "z": round(offset_z, 2)},
            "polygon": polygon,
            "height": h,
            "levels": max(1, int(h / 3.2)),
            "roof_shape": "flat" if tilt < 12 else "gabled",
            "roof_area_m2": area,
            "roof_tilt_deg": tilt,
            "roof_azimuth_deg": az
        }
        enriched = enrich_building_solar(bldg, center_lat)
        buildings.append(enriched)

    return buildings
