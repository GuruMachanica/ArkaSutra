import random
import numpy as np

def calculate_solar_irradiation(azimuth, tilt, base_irradiation=1200, optimal_tilt=30):
    azimuth_diff = abs(azimuth - 180)
    if azimuth_diff > 180:
        azimuth_diff = 360 - azimuth_diff
    azimuth_factor = np.cos(np.radians(azimuth_diff))
    tilt_factor = np.cos(np.radians(abs(tilt - optimal_tilt)))
    irradiation = base_irradiation * azimuth_factor * tilt_factor * random.uniform(0.9, 1.1)
    return round(max(irradiation, 200), 1)

def generate_roof_surfaces(btype, width, depth, height):
    roof_type = random.choice(btype['roof_types'])
    surfaces = []

    if roof_type == 'flat':
        surfaces.append({
            'id': 'roof_flat_001', 'area': round(width * depth, 1),
            'azimuth': random.uniform(0, 360), 'tilt': random.uniform(0, 5),
            'irradiation': 0, 'totalIrradiation': 0
        })
    elif roof_type == 'gabled':
        rh = random.uniform(2, 4)
        ra = width * np.sqrt(depth**2 + rh**2) / 2
        for tag, az in [('south', 180), ('north', 0)]:
            surfaces.append({
                'id': f'roof_gabled_{tag}', 'area': round(ra, 1),
                'azimuth': az, 'tilt': random.uniform(*btype['roof_tilt_range']),
                'irradiation': 0, 'totalIrradiation': 0
            })
    elif roof_type == 'hipped':
        ra = (width * depth * 1.2) / 4
        for i, az in enumerate([180, 270, 0, 90]):
            surfaces.append({
                'id': f'roof_hipped_{i+1}', 'area': round(ra, 1),
                'azimuth': az, 'tilt': random.uniform(*btype['roof_tilt_range']),
                'irradiation': 0, 'totalIrradiation': 0
            })
    elif roof_type == 'shed':
        surfaces.append({
            'id': 'roof_shed_001', 'area': round(width * depth, 1),
            'azimuth': random.choice([180, 90, 270]), 'tilt': random.uniform(*btype['roof_tilt_range']),
            'irradiation': 0, 'totalIrradiation': 0
        })
    elif roof_type == 'sawtooth':
        num = random.randint(3, 6)
        saw_area = (width / num) * depth
        for i in range(num):
            surfaces.append({
                'id': f'roof_sawtooth_{i+1}', 'area': round(saw_area, 1),
                'azimuth': 180, 'tilt': random.uniform(*btype['roof_tilt_range']),
                'irradiation': 0, 'totalIrradiation': 0
            })
    return surfaces
