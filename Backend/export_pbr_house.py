#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Blender Photorealistic PBR House Exporter for SunMap
"""

import os
import math

try:
    import bpy
except ImportError:
    bpy = None

def make_pbr_mat(name, base_color, roughness=0.5, metalness=0.0, specular=0.5, emissive=(0,0,0,1), emissive_strength=0.0):
    if not bpy:
        return None
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = base_color
        bsdf.inputs['Roughness'].default_value = roughness
        if 'Metallic' in bsdf.inputs:
            bsdf.inputs['Metallic'].default_value = metalness
        if 'Specular IOR Level' in bsdf.inputs:
            bsdf.inputs['Specular IOR Level'].default_value = specular
        elif 'Specular' in bsdf.inputs:
            bsdf.inputs['Specular'].default_value = specular
        if 'Emission Color' in bsdf.inputs:
            bsdf.inputs['Emission Color'].default_value = emissive
        elif 'Emission' in bsdf.inputs:
            bsdf.inputs['Emission'].default_value = emissive
        if 'Emission Strength' in bsdf.inputs:
            bsdf.inputs['Emission Strength'].default_value = emissive_strength
    return mat

def add_arch_box(name, loc, scale, mat, rot=(0,0,0)):
    if not bpy:
        return None
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    if mat:
        obj.data.materials.append(mat)
    return obj

def generate_and_export_house():
    if not bpy:
        print("Blender (bpy) is not installed in this Python environment.")
        return

    # Reset Blender
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # --- Photorealistic PBR Materials ---
    mat_stucco = make_pbr_mat("Stucco_LightGray", (0.84, 0.86, 0.88, 1.0), roughness=0.75, metalness=0.02)
    mat_trim_white = make_pbr_mat("Trim_CrispWhite", (0.95, 0.96, 0.97, 1.0), roughness=0.4, metalness=0.05)
    mat_roof_metal = make_pbr_mat("Roof_CharcoalStandingSeam", (0.16, 0.18, 0.22, 1.0), roughness=0.32, metalness=0.75)
    mat_roof_trim = make_pbr_mat("Roof_GutterTrim", (0.12, 0.13, 0.16, 1.0), roughness=0.25, metalness=0.85)

    # High-Efficiency Photovoltaic Solar Panels
    mat_solar_glass = make_pbr_mat("Solar_Glass_Monocrystalline", (0.015, 0.05, 0.16, 1.0), roughness=0.08, metalness=0.98, specular=1.0)
    mat_solar_frame = make_pbr_mat("Solar_Frame_SilverAlum", (0.75, 0.77, 0.80, 1.0), roughness=0.2, metalness=0.95)

    # Windows & Emissive Night Lighting
    mat_window_glass = make_pbr_mat("Window_Glass_Emissive", (0.25, 0.45, 0.7, 1.0), roughness=0.04, metalness=0.15, emissive=(1.0, 0.72, 0.3, 1.0), emissive_strength=0.0)
    mat_sconce_emissive = make_pbr_mat("Sconce_Light_Emissive", (1.0, 0.85, 0.5, 1.0), roughness=0.1, emissive=(1.0, 0.8, 0.35, 1.0), emissive_strength=0.0)
    mat_black_fixture = make_pbr_mat("Sconce_BlackFixture", (0.05, 0.05, 0.06, 1.0), roughness=0.3, metalness=0.9)

    # Garage & Doors
    mat_garage_white = make_pbr_mat("Garage_WhitePanels", (0.94, 0.95, 0.96, 1.0), roughness=0.5, metalness=0.1)
    mat_lawn = make_pbr_mat("Lawn_GreenGrass", (0.12, 0.28, 0.10, 1.0), roughness=0.92)
    mat_hedge = make_pbr_mat("Shrub_LushGreen", (0.08, 0.22, 0.07, 1.0), roughness=0.88)
    mat_driveway = make_pbr_mat("Driveway_AggregateConcrete", (0.55, 0.56, 0.58, 1.0), roughness=0.85)

    # 1. Main Villa Structure
    add_arch_box("Wall_Center_Living", (-0.2, 1.1, 0.0), (5.2, 2.2, 3.8), mat_stucco)
    add_arch_box("Wall_Garage_Wing", (-4.2, 1.0, 0.3), (3.6, 2.0, 4.4), mat_stucco)

    add_arch_box("Garage_Door_WhiteFrame", (-4.2, 0.9, 2.52), (3.0, 1.6, 0.06), mat_trim_white)
    for r in range(4):
        for c in range(4):
            gx = -5.35 + c * 0.76
            gy = 0.28 + r * 0.38
            add_arch_box(f"Garage_Panel_{r}_{c}", (gx, gy, 2.55), (0.70, 0.32, 0.03), mat_garage_white)

    add_arch_box("Wall_Entrance_Pavilion", (3.2, 1.25, 0.8), (2.8, 2.5, 4.2), mat_stucco)
    add_arch_box("Entrance_Gable_Trim", (3.2, 2.65, 2.92), (2.85, 0.12, 0.15), mat_trim_white)
    add_arch_box("Door_Outer_Frame", (3.2, 0.95, 2.92), (1.8, 1.7, 0.08), mat_trim_white)
    add_arch_box("Door_Left_Frame", (2.78, 0.95, 2.95), (0.75, 1.6, 0.04), mat_trim_white)
    add_arch_box("Window_Door_Left", (2.78, 0.95, 2.96), (0.55, 1.35, 0.03), mat_window_glass)
    add_arch_box("Door_Right_Frame", (3.62, 0.95, 2.95), (0.75, 1.6, 0.04), mat_trim_white)
    add_arch_box("Window_Door_Right", (3.62, 0.95, 2.96), (0.55, 1.35, 0.03), mat_window_glass)

    for idx, sx in enumerate([2.1, 4.3]):
        add_arch_box(f"Sconce_Fixture_{idx}", (sx, 1.1, 2.95), (0.12, 0.28, 0.14), mat_black_fixture)
        add_arch_box(f"Sconce_Bulb_{idx}", (sx, 1.1, 2.98), (0.08, 0.18, 0.08), mat_sconce_emissive)

    for i in range(6):
        wx = -2.2 + i * 0.78
        add_arch_box(f"Win_Main_Frame_{i}", (wx, 1.05, 1.92), (0.68, 1.45, 0.08), mat_trim_white)
        add_arch_box(f"Window_Glass_Main_{i}", (wx, 1.05, 1.94), (0.56, 1.32, 0.04), mat_window_glass)

    # 2. Pitched Roof & Solar Panels
    roof_pitch = math.radians(22)
    add_arch_box("Roof_Front_Plane", (-0.2, 2.75, 0.95), (5.6, 0.12, 2.6), mat_roof_metal, rot=(roof_pitch, 0, 0))
    add_arch_box("Roof_Back_Plane", (-0.2, 2.75, -0.95), (5.6, 0.12, 2.6), mat_roof_metal, rot=(-roof_pitch, 0, 0))
    add_arch_box("Roof_Ridge_Cap", (-0.2, 3.25, 0.0), (5.7, 0.10, 0.25), mat_roof_trim)

    add_arch_box("Roof_Gable_Front_L", (3.2, 2.95, 1.8), (1.7, 0.12, 2.8), mat_roof_metal, rot=(0, 0, -math.radians(25)))
    add_arch_box("Roof_Gable_Front_R", (3.2, 2.95, 1.8), (1.7, 0.12, 2.8), mat_roof_metal, rot=(0, 0, math.radians(25)))

    mod_w = 0.88
    mod_h = 1.45
    for r in range(2):
        for c in range(5):
            x_pos = -1.96 + c * (mod_w + 0.08)
            offset_down = 0.35 + r * (mod_h + 0.08)
            y_pos = 3.45 - offset_down * math.sin(roof_pitch) + 0.06
            z_pos = -0.8 + offset_down * math.cos(roof_pitch)

            add_arch_box(f"Solar_Upper_Frame_{r}_{c}", (x_pos, y_pos, z_pos), (mod_w * 0.92, 0.03, mod_h * 0.85), mat_solar_frame, rot=(roof_pitch, 0, 0))
            add_arch_box(f"Solar_Upper_Glass_{r}_{c}", (x_pos, y_pos + 0.015, z_pos), (mod_w * 0.88, 0.02, mod_h * 0.80), mat_solar_glass, rot=(roof_pitch, 0, 0))

    # Landscaping
    add_arch_box("Driveway_Concrete", (-4.2, -0.04, 4.8), (3.8, 0.06, 4.5), mat_driveway)
    add_arch_box("Lawn_Front_Grass", (0.5, -0.06, 5.2), (12.0, 0.06, 5.0), mat_lawn)

    shrub_coords = [
        (-2.2, 0.25, 2.7),
        (-1.4, 0.35, 2.8),
        (-0.6, 0.40, 2.9),
        (0.3, 0.32, 2.8),
        (1.4, 0.45, 3.2),
        (4.6, 0.35, 3.2),
        (5.2, 0.45, 2.2)
    ]
    for idx, (sx, sy, sz) in enumerate(shrub_coords):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.42, location=(sx, sy, sz))
        shrub = bpy.context.active_object
        shrub.name = f"Shrub_{idx}"
        shrub.scale = (1.1, 0.85, 1.0)
        shrub.data.materials.append(mat_hedge)

    # Export to GLB
    script_dir = os.path.dirname(os.path.abspath(__file__)) if '__file__' in locals() else os.getcwd()
    output_dir = os.path.abspath(os.path.join(script_dir, "..", "Frontend", "public", "models"))
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "house.glb")

    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_materials='EXPORT',
        export_apply=True
    )

    print("SUCCESS: Photorealistic suburban homestead exported to:", output_path)

if __name__ == '__main__':
    if bpy:
        generate_and_export_house()
    else:
        print("Note: export_pbr_house.py is designed to run inside Blender (`blender --background --python export_pbr_house.py`).")
