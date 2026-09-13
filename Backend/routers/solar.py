from fastapi import APIRouter

try:
    from Backend.core.schemas import (
        SolarCalculationRequest,
        SolarCalculationResponse,
        SolarPositionRequest,
        SolarPositionResponse,
    )
    from Backend.core.physics import calculate_solar_physics, calculate_solar_position_core
    from Backend.satellite_service import fetch_satellite_solar_telemetry
except ImportError:
    from core.schemas import (
        SolarCalculationRequest,
        SolarCalculationResponse,
        SolarPositionRequest,
        SolarPositionResponse,
    )
    from core.physics import calculate_solar_physics, calculate_solar_position_core
    from satellite_service import fetch_satellite_solar_telemetry

router = APIRouter(prefix="/api/solar", tags=["Solar Physics"])

@router.post("/calculate", response_model=SolarCalculationResponse)
def calculate_solar(req: SolarCalculationRequest):
    return calculate_solar_physics(req)

@router.post("/position", response_model=SolarPositionResponse)
def calculate_solar_position(req: SolarPositionRequest):
    return calculate_solar_position_core(req)

@router.post("/calculate-live")
async def calculate_solar_live(req: SolarCalculationRequest):
    base = calculate_solar_physics(req)
    sat = await fetch_satellite_solar_telemetry(req.latitude, req.longitude)
    curr = sat.get("current", {})

    cloud_derate = curr.get("cloud_derate_factor", 1.0)
    thermal_penalty = curr.get("thermal_efficiency_penalty_pct", 0.0)
    net_multiplier = max(0.15, cloud_derate * (1.0 - thermal_penalty / 100.0))

    live_gen = round(base["annual_generation_kwh"] * net_multiplier, 0)
    live_savings = round(live_gen * req.electricity_rate_usd, 2)
    live_co2 = round((live_gen * 0.385) / 1000.0, 2)

    return {
        **base,
        "satellite_telemetry": {
            "source": sat.get("source"), "status": sat.get("status"),
            "live_dni_w_m2": curr.get("dni_w_m2"), "live_ghi_w_m2": curr.get("ghi_w_m2"),
            "live_cloud_cover_pct": curr.get("cloud_cover_pct"), "live_temperature_c": curr.get("temperature_c"),
            "sky_condition": curr.get("sky_condition"), "cloud_derate_factor": cloud_derate,
            "thermal_penalty_pct": thermal_penalty
        },
        "live_adjusted_generation_kwh": live_gen,
        "live_adjusted_savings_usd": live_savings,
        "live_adjusted_co2_offset_tons": live_co2
    }
