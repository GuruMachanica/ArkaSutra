#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
SunMap Data Converter
Converts CityGML solar analysis results to JSON format for 3D visualization
"""

import json
import os
import argparse
try:
    from lxml import etree
except ImportError:
    import xml.etree.ElementTree as etree
import numpy as np

# Namespaces for CityGML
ns_citygml = "http://www.opengis.net/citygml/2.0"
ns_gml = "http://www.opengis.net/gml"
ns_bldg = "http://www.opengis.net/citygml/building/2.0"

nsmap = {
    None: ns_citygml,
    'gml': ns_gml,
    'bldg': ns_bldg
}

class SolarDataConverter:
    def __init__(self):
        self.buildings = []
    
    def parse_citygml(self, file_path):
        """Parse CityGML file and extract solar data"""
        try:
            tree = etree.parse(file_path)
            root = tree.getroot()
            
            # Find all buildings
            buildings = root.findall('.//{%s}Building' % ns_bldg)
            
            for building in buildings:
                building_data = self.extract_building_data(building)
                if building_data:
                    self.buildings.append(building_data)
                    
        except Exception as e:
            print(f"Error parsing {file_path}: {e}")
    
    def extract_building_data(self, building):
        """Extract solar data from a building element"""
        try:
            # Get building ID
            building_id = building.get('{%s}id' % ns_gml, 'unknown')
            
            # Get building geometry (simplified bounding box)
            geometry = self.get_building_geometry(building)
            
            # Get roof surfaces with solar data
            roof_surfaces = self.extract_roof_surfaces(building)
            
            if not roof_surfaces:
                return None
            
            # Calculate building dimensions from geometry
            dimensions = self.calculate_dimensions(geometry)
            
            # Calculate position (center of building)
            position = self.calculate_position(geometry)
            
            return {
                'id': building_id,
                'position': position,
                'dimensions': dimensions,
                'roofSurfaces': roof_surfaces,
                'geometry': geometry
            }
            
        except Exception as e:
            print(f"Error extracting building data: {e}")
            return None
    
    def get_building_geometry(self, building):
        """Extract building geometry points"""
        points = []
        
        # Find all polygon elements
        polygons = building.findall('.//{%s}Polygon' % ns_gml)
        
        for polygon in polygons:
            # Extract coordinates from polygon
            pos_list = polygon.find('.//{%s}posList' % ns_gml)
            if pos_list is not None:
                coords = pos_list.text.strip().split()
                # Convert to float pairs (x, y, z)
                for i in range(0, len(coords), 3):
                    if i + 2 < len(coords):
                        x = float(coords[i])
                        y = float(coords[i + 1])
                        z = float(coords[i + 2])
                        points.append([x, y, z])
        
        return points
    
    def calculate_dimensions(self, geometry):
        """Calculate building dimensions from geometry"""
        if not geometry:
            return {'width': 20, 'height': 15, 'depth': 20}
        
        points = np.array(geometry)
        
        # Calculate bounding box
        min_coords = np.min(points, axis=0)
        max_coords = np.max(points, axis=0)
        
        width = max_coords[0] - min_coords[0]
        height = max_coords[2] - min_coords[2]  # Z is height
        depth = max_coords[1] - min_coords[1]
        
        # Ensure minimum dimensions
        width = max(width, 5)
        height = max(height, 5)
        depth = max(depth, 5)
        
        return {
            'width': float(width),
            'height': float(height),
            'depth': float(depth)
        }
    
    def calculate_position(self, geometry):
        """Calculate building center position"""
        if not geometry:
            return {'x': 0, 'y': 0, 'z': 0}
        
        points = np.array(geometry)
        center = np.mean(points, axis=0)
        
        return {
            'x': float(center[0]),
            'y': float(center[2]),  # Z becomes Y for 3D visualization
            'z': float(center[1])
        }
    
    def extract_roof_surfaces(self, building):
        """Extract roof surface data with solar information"""
        roof_surfaces = []
        
        # Find roof surfaces
        roof_surfaces_xml = building.findall('.//{%s}RoofSurface' % ns_bldg)
        
        for roof_surface in roof_surfaces_xml:
            surface_data = self.extract_surface_data(roof_surface)
            if surface_data:
                roof_surfaces.append(surface_data)
        
        return roof_surfaces
    
    def extract_surface_data(self, roof_surface):
        """Extract solar data from a roof surface"""
        try:
            # Get surface ID
            surface_id = roof_surface.get('{%s}id' % ns_gml, 'unknown')
            
            # Extract solar data from custom elements
            area_elem = roof_surface.find('area')
            azimuth_elem = roof_surface.find('azimuth')
            tilt_elem = roof_surface.find('tilt')
            irradiation_elem = roof_surface.find('irradiation')
            total_irradiation_elem = roof_surface.find('totalIrradiation')
            
            # Default values
            area = 100.0
            azimuth = 180.0
            tilt = 30.0
            irradiation = 1000.0
            total_irradiation = 100000.0
            
            # Extract values if elements exist
            if area_elem is not None and area_elem.text:
                area = float(area_elem.text)
            
            if azimuth_elem is not None and azimuth_elem.text:
                azimuth = float(azimuth_elem.text)
            
            if tilt_elem is not None and tilt_elem.text:
                tilt = float(tilt_elem.text)
            
            if irradiation_elem is not None and irradiation_elem.text:
                irradiation = float(irradiation_elem.text)
            
            if total_irradiation_elem is not None and total_irradiation_elem.text:
                total_irradiation = float(total_irradiation_elem.text)
            
            return {
                'id': surface_id,
                'area': area,
                'azimuth': azimuth,
                'tilt': tilt,
                'irradiation': irradiation,
                'totalIrradiation': total_irradiation
            }
            
        except Exception as e:
            print(f"Error extracting surface data: {e}")
            return None
    
    def create_sample_data(self):
        """Create sample data for demonstration"""
        sample_buildings = [
            {
                'id': 'building_001',
                'position': {'x': 0, 'y': 0, 'z': 0},
                'dimensions': {'width': 20, 'height': 15, 'depth': 20},
                'roofSurfaces': [
                    {
                        'id': 'roof_001',
                        'area': 200,
                        'azimuth': 180,
                        'tilt': 30,
                        'irradiation': 1200,
                        'totalIrradiation': 240000
                    },
                    {
                        'id': 'roof_002',
                        'area': 150,
                        'azimuth': 90,
                        'tilt': 45,
                        'irradiation': 800,
                        'totalIrradiation': 120000
                    }
                ]
            },
            {
                'id': 'building_002',
                'position': {'x': 50, 'y': 0, 'z': 30},
                'dimensions': {'width': 25, 'height': 20, 'depth': 25},
                'roofSurfaces': [
                    {
                        'id': 'roof_003',
                        'area': 300,
                        'azimuth': 180,
                        'tilt': 25,
                        'irradiation': 1500,
                        'totalIrradiation': 450000
                    },
                    {
                        'id': 'roof_004',
                        'area': 200,
                        'azimuth': 270,
                        'tilt': 35,
                        'irradiation': 900,
                        'totalIrradiation': 180000
                    }
                ]
            },
            {
                'id': 'building_003',
                'position': {'x': -40, 'y': 0, 'z': -20},
                'dimensions': {'width': 18, 'height': 12, 'depth': 18},
                'roofSurfaces': [
                    {
                        'id': 'roof_005',
                        'area': 180,
                        'azimuth': 0,
                        'tilt': 40,
                        'irradiation': 600,
                        'totalIrradiation': 108000
                    },
                    {
                        'id': 'roof_006',
                        'area': 120,
                        'azimuth': 90,
                        'tilt': 20,
                        'irradiation': 1100,
                        'totalIrradiation': 132000
                    }
                ]
            }
        ]
        
        self.buildings = sample_buildings
    
    def save_to_json(self, output_file):
        """Save buildings data to JSON file"""
        data = {
            'buildings': self.buildings,
            'metadata': {
                'totalBuildings': len(self.buildings),
                'totalSurfaces': sum(len(b['roofSurfaces']) for b in self.buildings),
                'totalArea': sum(sum(s['area'] for s in b['roofSurfaces']) for b in self.buildings),
                'avgIrradiation': self.calculate_average_irradiation()
            }
        }
        
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"Data saved to {output_file}")
        print(f"Total buildings: {data['metadata']['totalBuildings']}")
        print(f"Total roof surfaces: {data['metadata']['totalSurfaces']}")
        print(f"Total roof area: {data['metadata']['totalArea']:.1f} m²")
        print(f"Average irradiation: {data['metadata']['avgIrradiation']:.1f} kWh/m²")
    
    def calculate_average_irradiation(self):
        """Calculate average irradiation across all surfaces"""
        total_area = 0
        total_irradiation = 0
        
        for building in self.buildings:
            for surface in building['roofSurfaces']:
                total_area += surface['area']
                total_irradiation += surface['irradiation'] * surface['area']
        
        return total_irradiation / total_area if total_area > 0 else 0

def main():
    parser = argparse.ArgumentParser(description='Convert Solar3Dcity results to JSON for 3D visualization')
    parser.add_argument('-i', '--input', help='Input CityGML file or directory')
    parser.add_argument('-o', '--output', default='solar_data.json', help='Output JSON file')
    parser.add_argument('--sample', action='store_true', help='Generate sample data')
    
    args = parser.parse_args()
    
    converter = SolarDataConverter()
    
    if args.sample:
        print("Generating sample data...")
        converter.create_sample_data()
    elif args.input:
        if os.path.isfile(args.input):
            print(f"Processing file: {args.input}")
            converter.parse_citygml(args.input)
        elif os.path.isdir(args.input):
            print(f"Processing directory: {args.input}")
            for file in os.listdir(args.input):
                if file.endswith('.gml'):
                    file_path = os.path.join(args.input, file)
                    print(f"Processing: {file}")
                    converter.parse_citygml(file_path)
        else:
            print(f"Error: {args.input} is not a valid file or directory")
            return
    else:
        print("No input specified. Generating sample data...")
        converter.create_sample_data()
    
    converter.save_to_json(args.output)

if __name__ == '__main__':
    main()
