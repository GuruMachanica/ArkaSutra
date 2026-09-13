import math
from typing import Dict, Any

def enrich_building_solar(bldg: Dict[str, Any], lat: float, electricity_rate: float = 0.16) -> Dict[str, Any]:
    area = bldg["roof_area_m2"]
    tilt = bldg["roof_tilt_deg"]
    az = bldg["roof_azimuth_deg"]

    # Clear-sky transposition factor
    base_ghi = max(900.0, 2200.0 * math.cos(math.radians(lat * 0.85)))
    optimum_tilt = abs(lat) * 0.87
    tilt_penalty = math.cos(math.radians(abs(tilt - optimum_tilt))) ** 1.3
    azimuth_penalty = math.cos(math.radians(abs(az - 180.0) * 0.5)) ** 1.6
    poa_irradiance = round(base_ghi * max(0.55, tilt_penalty * azimuth_penalty), 1)

    # 70% usable rooftop packing fraction with 20% high-efficiency PV panels
    usable_area = round(area * 0.70, 1)
    kwp_capacity = round(usable_area * 0.20, 2)
    annual_gen_kwh = round(kwp_capacity * poa_irradiance * 0.86, 0)
    annual_savings_usd = round(annual_gen_kwh * electricity_rate, 2)
    co2_offset_tons = round((annual_gen_kwh * 0.385) / 1000.0, 2)

    roof_facet = {
        "facet_id": f"roof_{bldg['osm_id']}",
        "name": f"{bldg['name']} Roof",
        "tilt_deg": tilt,
        "azimuth_deg": az,
        "area_m2": area,
        "usable_area_m2": usable_area,
        "pv_capacity_kwp": kwp_capacity,
        "annual_poa_irradiance_kwh_m2": poa_irradiance,
        "annual_generation_kwh": annual_gen_kwh,
        "annual_savings_usd": annual_savings_usd,
        "co2_offset_tons": co2_offset_tons
    }

    return {
        **bldg,
        "solar": roof_facet
    }
