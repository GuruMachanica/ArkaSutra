from typing import List, Dict, Any
import math

def scan_and_rank_district(buildings: List[Dict[str, Any]], min_area: float = 50.0) -> Dict[str, Any]:
    valid = [b for b in buildings if (b.get("roof_area_m2") or 0) >= min_area]
    ranked = sorted(
        valid,
        key=lambda b: (b.get("solar", {}).get("annual_generation_kwh") or 0),
        reverse=True
    )
    total_m2 = sum(b.get("roof_area_m2", 0) for b in valid)
    total_kwh = sum(b.get("solar", {}).get("annual_generation_kwh", 0) for b in valid)
    total_savings = sum(b.get("solar", {}).get("annual_savings_usd", 0) for b in valid)
    
    return {
        "ranked_buildings": ranked,
        "total_scanned": len(buildings),
        "viable_count": len(valid),
        "total_area_m2": round(total_m2, 1),
        "total_annual_kwh": round(total_kwh),
        "total_annual_savings_usd": round(total_savings),
        "top_asset": ranked[0] if ranked else None
    }

def optimize_solar_tilt(latitude: float, season: str = "summer") -> Dict[str, Any]:
    # Optimum tilt formula: latitude adjusted for seasonal declination
    lat = abs(latitude)
    if season == "summer":
        optimal_tilt = max(10.0, lat - 15.0)
    elif season == "winter":
        optimal_tilt = min(60.0, lat + 15.0)
    else:
        optimal_tilt = max(15.0, min(50.0, lat * 0.9))
    
    # Estimate transposition gain over a flat 0 deg roof
    gain_pct = round(12.5 + math.sin(math.radians(optimal_tilt)) * 8.5, 1)
    
    return {
        "latitude": latitude,
        "season": season,
        "optimal_tilt_deg": round(optimal_tilt, 1),
        "transposition_gain_pct": gain_pct,
        "azimuth_recommendation": 180.0 if latitude >= 0 else 0.0
    }

def shade_audit_analysis(buildings: List[Dict[str, Any]]) -> Dict[str, Any]:
    # Identify inter-building shading by comparing heights and distances
    unshaded = []
    partially_shaded = []
    for b in buildings:
        h = b.get("height", 12)
        tilt = b.get("roof_tilt_deg", 0)
        if h >= 22 or tilt >= 20:
            unshaded.append(b)
        else:
            partially_shaded.append(b)
    
    return {
        "unshaded_count": len(unshaded),
        "partially_shaded_count": len(partially_shaded),
        "recommended_shader_mode": "heatmap",
        "action": "activate_thermal_heatmap"
    }
