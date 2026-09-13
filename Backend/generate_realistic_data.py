#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Realistic Building Data Generator for SunMap
Creates realistic building geometries with proper solar analysis
"""

import json
import numpy as np
import random
from datetime import datetime

class RealisticBuildingGenerator:
    def __init__(self):
        self.buildings = []
        self.location = (52.01, 4.36)  # Delft, Netherlands
        
    def generate_realistic_buildings(self, num_buildings=15):
        """Generate realistic building data with proper solar analysis"""
        
        # Define building types with realistic characteristics
        building_types = [
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
        
        # Generate buildings in a realistic urban layout
        building_id = 1
        used_positions = set()
        
        for i in range(num_buildings):
            # Select building type
            building_type = random.choice(building_types)
            
            # Generate realistic dimensions
            width = random.uniform(*building_type['width_range'])
            depth = random.uniform(*building_type['depth_range'])
            height = random.uniform(*building_type['height_range'])
            
            # Generate position (avoid overlaps)
            position = self.generate_position(used_positions, width, depth)
            used_positions.add((position['x'], position['z']))
            
            # Generate roof surfaces based on building type
            roof_surfaces = self.generate_roof_surfaces(
                building_type, width, depth, height
            )
            
            # Calculate solar irradiation for each roof surface
            for surface in roof_surfaces:
                surface['irradiation'] = self.calculate_solar_irradiation(
                    surface['azimuth'], surface['tilt']
                )
                surface['totalIrradiation'] = surface['area'] * surface['irradiation']
            
            building = {
                'id': f'building_{building_id:03d}',
                'type': building_type['type'],
                'position': position,
                'dimensions': {
                    'width': round(width, 1),
                    'height': round(height, 1),
                    'depth': round(depth, 1)
                },
                'roofSurfaces': roof_surfaces
            }
            
            self.buildings.append(building)
            building_id += 1
        
        return self.buildings
    
    def generate_position(self, used_positions, width, depth):
        """Generate realistic building positions avoiding overlaps"""
        max_attempts = 100
        min_distance = 5  # Minimum distance between buildings
        
        for attempt in range(max_attempts):
            # Generate position in a realistic urban grid
            x = random.uniform(-100, 100)
            z = random.uniform(-100, 100)
            
            # Check for overlaps
            too_close = False
            for used_x, used_z in used_positions:
                distance = np.sqrt((x - used_x)**2 + (z - used_z)**2)
                if distance < min_distance:
                    too_close = True
                    break
            
            if not too_close:
                return {
                    'x': round(x, 1),
                    'y': 0,
                    'z': round(z, 1)
                }
        
        # If no good position found, place randomly
        return {
            'x': round(random.uniform(-100, 100), 1),
            'y': 0,
            'z': round(random.uniform(-100, 100), 1)
        }
    
    def generate_roof_surfaces(self, building_type, width, depth, height):
        """Generate realistic roof surfaces based on building type"""
        roof_type = random.choice(building_type['roof_types'])
        surfaces = []
        
        if roof_type == 'flat':
            # Flat roof - single surface
            area = width * depth
            surface = {
                'id': f'roof_flat_001',
                'area': round(area, 1),
                'azimuth': random.uniform(0, 360),
                'tilt': random.uniform(0, 5),  # Nearly flat
                'irradiation': 0,  # Will be calculated later
                'totalIrradiation': 0
            }
            surfaces.append(surface)
            
        elif roof_type == 'gabled':
            # Gabled roof - two surfaces
            roof_height = random.uniform(2, 4)
            roof_area = width * np.sqrt(depth**2 + roof_height**2)
            
            # South-facing surface
            surface1 = {
                'id': f'roof_gabled_south',
                'area': round(roof_area / 2, 1),
                'azimuth': 180,  # South-facing
                'tilt': random.uniform(*building_type['roof_tilt_range']),
                'irradiation': 0,
                'totalIrradiation': 0
            }
            
            # North-facing surface
            surface2 = {
                'id': f'roof_gabled_north',
                'area': round(roof_area / 2, 1),
                'azimuth': 0,  # North-facing
                'tilt': random.uniform(*building_type['roof_tilt_range']),
                'irradiation': 0,
                'totalIrradiation': 0
            }
            
            surfaces.extend([surface1, surface2])
            
        elif roof_type == 'hipped':
            # Hipped roof - four surfaces
            roof_height = random.uniform(2, 4)
            roof_area = width * depth * 1.2  # Slightly larger due to hip
            
            for i, azimuth in enumerate([180, 270, 0, 90]):  # S, W, N, E
                surface = {
                    'id': f'roof_hipped_{i+1}',
                    'area': round(roof_area / 4, 1),
                    'azimuth': azimuth,
                    'tilt': random.uniform(*building_type['roof_tilt_range']),
                    'irradiation': 0,
                    'totalIrradiation': 0
                }
                surfaces.append(surface)
                
        elif roof_type == 'shed':
            # Shed roof - single sloped surface
            area = width * depth
            surface = {
                'id': f'roof_shed_001',
                'area': round(area, 1),
                'azimuth': random.choice([180, 90, 270]),  # S, E, W
                'tilt': random.uniform(*building_type['roof_tilt_range']),
                'irradiation': 0,
                'totalIrradiation': 0
            }
            surfaces.append(surface)
            
        elif roof_type == 'sawtooth':
            # Sawtooth roof - multiple surfaces
            num_saws = random.randint(3, 6)
            saw_width = width / num_saws
            
            for i in range(num_saws):
                surface = {
                    'id': f'roof_sawtooth_{i+1}',
                    'area': round(saw_width * depth, 1),
                    'azimuth': 180,  # South-facing
                    'tilt': random.uniform(*building_type['roof_tilt_range']),
                    'irradiation': 0,
                    'totalIrradiation': 0
                }
                surfaces.append(surface)
        
        return surfaces
    
    def calculate_solar_irradiation(self, azimuth, tilt):
        """Calculate realistic solar irradiation based on azimuth and tilt"""
        # Base irradiation for optimal conditions (south-facing, 30° tilt)
        base_irradiation = 1200  # kWh/m²/year
        
        # Azimuth factor (south = 180° is optimal)
        azimuth_diff = abs(azimuth - 180)
        if azimuth_diff > 180:
            azimuth_diff = 360 - azimuth_diff
        
        azimuth_factor = np.cos(np.radians(azimuth_diff))
        
        # Tilt factor (30° is optimal for this latitude)
        optimal_tilt = 30
        tilt_diff = abs(tilt - optimal_tilt)
        tilt_factor = np.cos(np.radians(tilt_diff))
        
        # Calculate final irradiation
        irradiation = base_irradiation * azimuth_factor * tilt_factor
        
        # Add some realistic variation
        variation = random.uniform(0.9, 1.1)
        irradiation *= variation
        
        # Ensure minimum irradiation
        irradiation = max(irradiation, 200)
        
        return round(irradiation, 1)
    
    def save_to_json(self, filename='realistic_buildings.json'):
        """Save the generated buildings to JSON file"""
        # Calculate statistics
        total_buildings = len(self.buildings)
        total_surfaces = sum(len(b['roofSurfaces']) for b in self.buildings)
        total_area = sum(sum(s['area'] for s in b['roofSurfaces']) for b in self.buildings)
        
        # Calculate average irradiation
        total_irradiation = 0
        total_weighted_area = 0
        for building in self.buildings:
            for surface in building['roofSurfaces']:
                total_irradiation += surface['irradiation'] * surface['area']
                total_weighted_area += surface['area']
        
        avg_irradiation = total_irradiation / total_weighted_area if total_weighted_area > 0 else 0
        
        # Create data structure
        data = {
            'buildings': self.buildings,
            'metadata': {
                'generated_at': datetime.now().isoformat(),
                'location': {
                    'latitude': self.location[0],
                    'longitude': self.location[1],
                    'city': 'Delft, Netherlands'
                },
                'statistics': {
                    'totalBuildings': total_buildings,
                    'totalSurfaces': total_surfaces,
                    'totalArea': round(total_area, 1),
                    'avgIrradiation': round(avg_irradiation, 1),
                    'buildingTypes': {
                        'residential': len([b for b in self.buildings if b['type'] == 'residential_house']),
                        'apartment': len([b for b in self.buildings if b['type'] == 'apartment_building']),
                        'commercial': len([b for b in self.buildings if b['type'] == 'commercial_building']),
                        'industrial': len([b for b in self.buildings if b['type'] == 'industrial_building'])
                    }
                }
            }
        }
        
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"Generated realistic building data:")
        print(f"   Total buildings: {total_buildings}")
        print(f"   Building types: {data['metadata']['statistics']['buildingTypes']}")
        print(f"   Total roof surfaces: {total_surfaces}")
        print(f"   Total roof area: {total_area:.1f} m²")
        print(f"   Average irradiation: {avg_irradiation:.1f} kWh/m²")
        print(f"   Saved to: {filename}")
        
        return filename

def main():
    print("Generating Realistic Building Data for SunMap...")
    print("=" * 60)
    
    # Create generator
    generator = RealisticBuildingGenerator()
    
    # Generate buildings
    buildings = generator.generate_realistic_buildings(num_buildings=20)
    
    # Save to JSON
    filename = generator.save_to_json('realistic_buildings.json')
    
    print("\nNext Steps:")
    print("1. Start the web server: python server.py")
    print("2. Open browser: http://localhost:8000")
    print(f"3. Load data file: {filename}")
    print("4. Explore the 3D visualization!")

if __name__ == '__main__':
    main()
