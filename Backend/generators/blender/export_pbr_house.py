#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""Blender Photorealistic PBR House Exporter for ArkaSutra"""

import os

try:
    import bpy
except ImportError:
    bpy = None

try:
    from blender_pbr_materials import make_pbr_mat, add_arch_box
    from house_geometry import build_villa_structure, build_roof_and_panels
except ImportError:
    from .blender_pbr_materials import make_pbr_mat, add_arch_box
    from .house_geometry import build_villa_structure, build_roof_and_panels

def get_pbr_materials():
    return {
        "stucco": make_pbr_mat("Stucco_LightGray", (0.84, 0.86, 0.88, 1.0), 0.75, 0.02),
        "trim_white": make_pbr_mat("Trim_CrispWhite", (0.95, 0.96, 0.97, 1.0), 0.4, 0.05),
        "roof_metal": make_pbr_mat("Roof_CharcoalStandingSeam", (0.16, 0.18, 0.22, 1.0), 0.32, 0.75),
        "roof_trim": make_pbr_mat("Roof_GutterTrim", (0.12, 0.13, 0.16, 1.0), 0.25, 0.85),
        "solar_glass": make_pbr_mat("Solar_Glass_Monocrystalline", (0.015, 0.05, 0.16, 1.0), 0.08, 0.98, specular=1.0),
        "solar_frame": make_pbr_mat("Solar_Frame_SilverAlum", (0.75, 0.77, 0.80, 1.0), 0.2, 0.95),
        "window_glass": make_pbr_mat("Window_Glass_Emissive", (0.25, 0.45, 0.7, 1.0), 0.04, 0.15, (1.0, 0.72, 0.3, 1.0), 0.0),
        "sconce_emissive": make_pbr_mat("Sconce_Light_Emissive", (1.0, 0.85, 0.5, 1.0), 0.1, emissive=(1.0, 0.8, 0.35, 1.0), emissive_strength=0.0),
        "black_fixture": make_pbr_mat("Sconce_BlackFixture", (0.05, 0.05, 0.06, 1.0), 0.3, 0.9),
        "garage_white": make_pbr_mat("Garage_WhitePanels", (0.94, 0.95, 0.96, 1.0), 0.5, 0.1),
        "lawn": make_pbr_mat("Lawn_GreenGrass", (0.12, 0.28, 0.10, 1.0), 0.92),
        "hedge": make_pbr_mat("Shrub_LushGreen", (0.08, 0.22, 0.07, 1.0), 0.88),
        "driveway": make_pbr_mat("Driveway_AggregateConcrete", (0.55, 0.56, 0.58, 1.0), 0.85)
    }

def generate_and_export_house():
    if not bpy:
        print("Blender (bpy) is not installed in this Python environment.")
        return

    bpy.ops.wm.read_factory_settings(use_empty=True)
    mats = get_pbr_materials()

    build_villa_structure(mats, bpy)
    build_roof_and_panels(mats, bpy)

    add_arch_box("Driveway_Concrete", (-4.2, -0.04, 4.8), (3.8, 0.06, 4.5), mats["driveway"])
    add_arch_box("Lawn_Front_Grass", (0.5, -0.06, 5.2), (12.0, 0.06, 5.0), mats["lawn"])

    shrub_coords = [(-2.2, 0.25, 2.7), (-1.4, 0.35, 2.8), (-0.6, 0.40, 2.9), (0.3, 0.32, 2.8), (1.4, 0.45, 3.2), (4.6, 0.35, 3.2), (5.2, 0.45, 2.2)]
    for idx, (sx, sy, sz) in enumerate(shrub_coords):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.42, location=(sx, sy, sz))
        shrub = bpy.context.active_object
        shrub.name = f"Shrub_{idx}"
        shrub.scale = (1.1, 0.85, 1.0)
        shrub.data.materials.append(mats["hedge"])

    script_dir = os.path.dirname(os.path.abspath(__file__)) if '__file__' in locals() else os.getcwd()
    output_dir = os.path.abspath(os.path.join(script_dir, "..", "Frontend", "public", "models"))
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "house.glb")

    bpy.ops.export_scene.gltf(filepath=output_path, export_format='GLB', use_selection=False, export_materials='EXPORT', export_apply=True)
    print("SUCCESS: Photorealistic suburban homestead exported to:", output_path)

if __name__ == '__main__':
    if bpy:
        generate_and_export_house()
    else:
        print("Note: export_pbr_house.py is designed to run inside Blender (`blender --background --python export_pbr_house.py`).")
