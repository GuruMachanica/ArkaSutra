#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
SunMap — 3D Spatial Solar Energy & Rooftop Intelligence Engine
Satellite Service Layer (Open-Meteo & Copernicus ERA5 Zero-Auth Integration)
"""

try:
    from Backend.services.satellite import (
        fetch_satellite_solar_telemetry,
        geocode_location,
        get_sky_condition
    )
except ImportError:
    from services.satellite import (
        fetch_satellite_solar_telemetry,
        geocode_location,
        get_sky_condition
    )

__all__ = ["fetch_satellite_solar_telemetry", "geocode_location", "get_sky_condition"]
