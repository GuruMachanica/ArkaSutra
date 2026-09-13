#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""Realistic Building Data Generator for SunMap"""

import json
import random
from datetime import datetime

try:
    from generator_config import BUILDING_TYPES, generate_position
    from generator_roofs import generate_roof_surfaces, calculate_solar_irradiation
except ImportError:
    from .generator_config import BUILDING_TYPES, generate_position
    from .generator_roofs import generate_roof_surfaces, calculate_solar_irradiation

class RealisticBuildingGenerator:
    def __init__(self):
        self.buildings = []
        self.location = (52.01, 4.36)

    def generate_realistic_buildings(self, num_buildings=15):
        used_positions = set()
        for i in range(num_buildings):
            btype = random.choice(BUILDING_TYPES)
            w = random.uniform(*btype['width_range'])
            d = random.uniform(*btype['depth_range'])
            h = random.uniform(*btype['height_range'])
            pos = generate_position(used_positions, w, d)
            used_positions.add((pos['x'], pos['z']))

            roofs = generate_roof_surfaces(btype, w, d, h)
            for surf in roofs:
                surf['irradiation'] = calculate_solar_irradiation(surf['azimuth'], surf['tilt'])
                surf['totalIrradiation'] = surf['area'] * surf['irradiation']

            self.buildings.append({
                'id': f'building_{i+1:03d}',
                'type': btype['type'],
                'position': pos,
                'dimensions': {'width': round(w, 1), 'height': round(h, 1), 'depth': round(d, 1)},
                'roofSurfaces': roofs
            })
        return self.buildings

    def save_to_json(self, filename='realistic_buildings.json'):
        total_buildings = len(self.buildings)
        total_surfaces = sum(len(b['roofSurfaces']) for b in self.buildings)
        total_area = sum(sum(s['area'] for s in b['roofSurfaces']) for b in self.buildings)
        total_irr = sum(sum(s['totalIrradiation'] for s in b['roofSurfaces']) for b in self.buildings)
        avg_irr = round(total_irr / total_area, 1) if total_area > 0 else 0

        data = {
            'buildings': self.buildings,
            'metadata': {
                'generated_at': datetime.now().isoformat(),
                'location': {'latitude': self.location[0], 'longitude': self.location[1], 'city': 'Delft, Netherlands'},
                'statistics': {
                    'totalBuildings': total_buildings,
                    'totalSurfaces': total_surfaces,
                    'totalArea': round(total_area, 1),
                    'avgIrradiation': avg_irr,
                    'buildingTypes': {t: len([b for b in self.buildings if b['type'] == t]) for t in ['residential_house', 'apartment_building', 'commercial_building', 'industrial_building']}
                }
            }
        }
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        return filename

def main():
    print("Generating Realistic Building Data for SunMap...")
    gen = RealisticBuildingGenerator()
    gen.generate_realistic_buildings(num_buildings=20)
    saved = gen.save_to_json('realistic_buildings.json')
    print(f"Generated and saved building dataset to {saved}")

if __name__ == '__main__':
    main()
