from pydantic import BaseModel, Field

class SolarCalculationRequest(BaseModel):
    latitude: float = Field(..., example=50.1109, description="Geographic latitude in decimal degrees")
    longitude: float = Field(..., example=8.6821, description="Geographic longitude in decimal degrees")
    tilt: float = Field(25.0, ge=0.0, le=90.0, example=25.0, description="Rooftop or PV array tilt in degrees")
    azimuth: float = Field(180.0, ge=0.0, le=360.0, example=180.0, description="Surface azimuth angle (180 = South)")
    rooftop_area: float = Field(120.0, gt=0.0, example=120.0, description="Usable rooftop area in m²")
    module_efficiency: float = Field(0.20, gt=0.0, le=0.40, example=0.20, description="Photovoltaic module efficiency")
    electricity_rate_usd: float = Field(0.16, gt=0.0, example=0.16, description="Grid tariff per kWh in USD")
    system_loss_factor: float = Field(0.14, ge=0.0, le=0.50, example=0.14, description="BOS system losses")

class SolarCalculationResponse(BaseModel):
    latitude: float
    longitude: float
    tilt: float
    azimuth: float
    total_rooftop_area_m2: float
    system_capacity_kwp: float
    annual_poa_irradiance_kwh_m2: float
    annual_generation_kwh: float
    annual_savings_usd: float
    co2_offset_tons: float
    levelized_cost_of_energy_lcoe: float
    estimated_payback_years: float
    calculated_at: str

class SolarPositionRequest(BaseModel):
    latitude: float = Field(50.1109, description="Latitude in decimal degrees")
    longitude: float = Field(8.6821, description="Longitude in decimal degrees")
    hour: float = Field(12.0, ge=0.0, le=24.0, description="Hour of the day in local solar time (0.0 to 24.0)")
    day_of_year: int = Field(172, ge=1, le=366, description="Day of year (1-366)")

class SolarPositionResponse(BaseModel):
    elevation_deg: float
    zenith_deg: float
    azimuth_deg: float
    airmass: float
    extraterrestrial_dni: float
    base_ghi_w_m2: float
