import math
from datetime import datetime, timezone
from typing import Dict, Any
from .schemas import SolarCalculationRequest, SolarPositionRequest

def calculate_solar_physics(req: SolarCalculationRequest) -> Dict[str, Any]:
    lat, lon, tilt, az = req.latitude, req.longitude, req.tilt, req.azimuth
    area, eff, rate, loss = req.rooftop_area, req.module_efficiency, req.electricity_rate_usd, req.system_loss_factor

    base_ghi = max(900.0, 2200.0 * math.cos(math.radians(lat * 0.85)))
    optimum_tilt = abs(lat) * 0.87
    tilt_penalty = math.cos(math.radians(abs(tilt - optimum_tilt))) ** 1.3
    azimuth_penalty = math.cos(math.radians(abs(az - 180.0) * 0.5)) ** 1.6
    tof_factor = max(0.55, tilt_penalty * azimuth_penalty)
    annual_poa_kwh_m2 = round(base_ghi * tof_factor, 1)

    system_capacity_kwp = round(area * (eff * 1.0), 2)
    annual_generation_kwh = round(system_capacity_kwp * annual_poa_kwh_m2 * (1.0 - loss), 0)
    annual_savings_usd = round(annual_generation_kwh * rate, 2)
    co2_offset_tons = round((annual_generation_kwh * 0.385) / 1000.0, 2)

    total_capex = system_capacity_kwp * 1150.0
    estimated_payback_years = round(total_capex / max(1.0, annual_savings_usd), 1)
    lifetime_generation = annual_generation_kwh * 25.0 * 0.92
    lcoe = round(total_capex / max(1.0, lifetime_generation), 4)

    return {
        "latitude": lat, "longitude": lon, "tilt": tilt, "azimuth": az,
        "total_rooftop_area_m2": area, "system_capacity_kwp": system_capacity_kwp,
        "annual_poa_irradiance_kwh_m2": annual_poa_kwh_m2, "annual_generation_kwh": annual_generation_kwh,
        "annual_savings_usd": annual_savings_usd, "co2_offset_tons": co2_offset_tons,
        "levelized_cost_of_energy_lcoe": lcoe, "estimated_payback_years": estimated_payback_years,
        "calculated_at": datetime.now(timezone.utc).isoformat()
    }

def calculate_solar_position_core(req: SolarPositionRequest) -> Dict[str, Any]:
    declination = 23.45 * math.sin(math.radians(360 / 365 * (req.day_of_year - 81)))
    hour_angle = 15.0 * (req.hour - 12.0)
    lat_rad = math.radians(req.latitude)
    dec_rad = math.radians(declination)
    ha_rad = math.radians(hour_angle)

    sin_elev = math.sin(lat_rad) * math.sin(dec_rad) + math.cos(lat_rad) * math.cos(dec_rad) * math.cos(ha_rad)
    elev_rad = math.asin(max(-1.0, min(1.0, sin_elev)))
    elev_deg = max(0.0, math.degrees(elev_rad))
    zenith_deg = 90.0 - elev_deg

    if elev_deg > 0.01:
        cos_az = (math.sin(dec_rad) * math.cos(lat_rad) - math.cos(dec_rad) * math.sin(lat_rad) * math.cos(ha_rad)) / math.cos(elev_rad)
        az_deg = math.degrees(math.acos(max(-1.0, min(1.0, cos_az))))
        if hour_angle > 0:
            az_deg = 360.0 - az_deg
    else:
        az_deg = 180.0

    airmass = 1.0 / (math.sin(elev_rad) + 0.50572 * ((elev_deg + 6.07995) ** -1.6364)) if elev_deg > 0.5 else 38.0
    eti = 1361.0 * (1.0 + 0.033 * math.cos(math.radians(360.0 * req.day_of_year / 365.0)))
    dni = eti * (0.7 ** (airmass ** 0.678)) if elev_deg > 0 else 0.0
    ghi = dni * math.sin(elev_rad) if elev_deg > 0 else 0.0

    return {
        "elevation_deg": round(elev_deg, 2), "zenith_deg": round(zenith_deg, 2),
        "azimuth_deg": round(az_deg, 2), "airmass": round(airmass, 2),
        "extraterrestrial_dni": round(dni, 1), "base_ghi_w_m2": round(ghi, 1)
    }
