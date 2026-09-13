import random
import numpy as np

BUILDING_TYPES = [
    {
        'type': 'residential_house',
        'width_range': (8, 12),
        'depth_range': (10, 15),
        'height_range': (6, 10),
        'roof_types': ['gabled', 'hipped', 'flat'],
        'roof_tilt_range': (25, 45)
    },
    {
        'type': 'apartment_building',
        'width_range': (15, 25),
        'depth_range': (20, 35),
        'height_range': (15, 30),
        'roof_types': ['flat', 'gabled'],
        'roof_tilt_range': (0, 15)
    },
    {
        'type': 'commercial_building',
        'width_range': (20, 40),
        'depth_range': (25, 50),
        'height_range': (10, 25),
        'roof_types': ['flat', 'shed'],
        'roof_tilt_range': (0, 10)
    },
    {
        'type': 'industrial_building',
        'width_range': (30, 60),
        'depth_range': (40, 80),
        'height_range': (8, 15),
        'roof_types': ['sawtooth', 'flat'],
        'roof_tilt_range': (5, 20)
    }
]

def generate_position(used_positions, width, depth, min_distance=5):
    for _ in range(100):
        x = random.uniform(-100, 100)
        z = random.uniform(-100, 100)
        if not any(np.sqrt((x - ux)**2 + (z - uz)**2) < min_distance for ux, uz in used_positions):
            return {'x': round(x, 1), 'y': 0, 'z': round(z, 1)}
    return {'x': round(random.uniform(-100, 100), 1), 'y': 0, 'z': round(random.uniform(-100, 100), 1)}
