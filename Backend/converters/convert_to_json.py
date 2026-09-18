#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""ArkaSutra Data Converter: Converts CityGML solar analysis to JSON for 3D visualization."""

import os
import json
import argparse
try:
    from lxml import etree
except ImportError:
    import xml.etree.ElementTree as etree

try:
    from converter_xml import extract_building_data, ns_bldg
    from converter_samples import get_sample_buildings
except ImportError:
    from .converter_xml import extract_building_data, ns_bldg
    from .converter_samples import get_sample_buildings

class SolarDataConverter:
    def __init__(self):
        self.buildings = []

    def parse_citygml(self, file_path):
        try:
            tree = etree.parse(file_path)
            for building in tree.getroot().findall('.//{%s}Building' % ns_bldg):
                data = extract_building_data(building)
                if data:
                    self.buildings.append(data)
        except Exception as e:
            print(f"Error parsing {file_path}: {e}")

    def create_sample_data(self):
        self.buildings = get_sample_buildings()

    def calculate_average_irradiation(self):
        total_area = sum(sum(s['area'] for s in b['roofSurfaces']) for b in self.buildings)
        total_irr = sum(sum(s['irradiation'] * s['area'] for s in b['roofSurfaces']) for b in self.buildings)
        return total_irr / total_area if total_area > 0 else 0

    def save_to_json(self, output_file):
        total_area = sum(sum(s['area'] for s in b['roofSurfaces']) for b in self.buildings)
        data = {
            'buildings': self.buildings,
            'metadata': {
                'totalBuildings': len(self.buildings),
                'totalSurfaces': sum(len(b['roofSurfaces']) for b in self.buildings),
                'totalArea': round(total_area, 1),
                'avgIrradiation': round(self.calculate_average_irradiation(), 1)
            }
        }
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Data saved to {output_file}. Buildings: {len(self.buildings)}, Surfaces: {data['metadata']['totalSurfaces']}")

def main():
    parser = argparse.ArgumentParser(description='Convert Solar3Dcity results to JSON')
    parser.add_argument('-i', '--input', help='Input CityGML file or directory')
    parser.add_argument('-o', '--output', default='solar_data.json', help='Output JSON file')
    parser.add_argument('--sample', action='store_true', help='Generate sample data')
    args = parser.parse_args()

    converter = SolarDataConverter()
    if args.sample or not args.input:
        converter.create_sample_data()
    elif os.path.isfile(args.input):
        converter.parse_citygml(args.input)
    elif os.path.isdir(args.input):
        for f in os.listdir(args.input):
            if f.endswith('.gml'):
                converter.parse_citygml(os.path.join(args.input, f))
    converter.save_to_json(args.output)

if __name__ == '__main__':
    main()
