#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
SunMap — 3D Spatial Solar Energy & Rooftop Intelligence Engine
Calculates yearly solar irradiation of roof surfaces from CityGML data.
"""

import argparse

try:
    from sunmap_tof import load_tof_factors, squareVerts, bilinear_interpolation, irr_from_tof
    from sunmap_building import Building, oparea, get_iter, ns_bldg, ns_gml, ns_citygml
    from sunmap_processor import process_citygml_directory
except ImportError:
    from .sunmap_tof import load_tof_factors, squareVerts, bilinear_interpolation, irr_from_tof
    from .sunmap_building import Building, oparea, get_iter, ns_bldg, ns_gml, ns_citygml
    from .sunmap_processor import process_citygml_directory

__all__ = [
    "load_tof_factors",
    "squareVerts",
    "bilinear_interpolation",
    "irr_from_tof",
    "Building",
    "oparea",
    "process_citygml_directory",
    "ns_bldg",
    "ns_gml",
    "ns_citygml"
]

def main():
    parser = argparse.ArgumentParser(description='Calculate yearly solar irradiation of roof surfaces.')
    parser.add_argument('-i', '--directory', help='Directory containing CityGML file(s).', required=True)
    parser.add_argument('-o', '--results', help='Directory where enriched solar CityGML should be written.', required=True)
    parser.add_argument('-f', '--factors', help='Load the TOF if previously precomputed', required=False)
    args = vars(parser.parse_args())
    process_citygml_directory(args['directory'], args['results'], args['factors'])

if __name__ == '__main__':
    main()