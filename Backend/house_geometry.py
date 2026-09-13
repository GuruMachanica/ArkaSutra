import math
from .blender_pbr_materials import add_arch_box

def build_villa_structure(mats, bpy):
    # Main living & garage
    add_arch_box("Wall_Center_Living", (-0.2, 1.1, 0.0), (5.2, 2.2, 3.8), mats["stucco"])
    add_arch_box("Wall_Garage_Wing", (-4.2, 1.0, 0.3), (3.6, 2.0, 4.4), mats["stucco"])
    add_arch_box("Garage_Door_WhiteFrame", (-4.2, 0.9, 2.52), (3.0, 1.6, 0.06), mats["trim_white"])
    for r in range(4):
        for c in range(4):
            add_arch_box(f"Garage_Panel_{r}_{c}", (-5.35 + c * 0.76, 0.28 + r * 0.38, 2.55), (0.70, 0.32, 0.03), mats["garage_white"])

    add_arch_box("Wall_Entrance_Pavilion", (3.2, 1.25, 0.8), (2.8, 2.5, 4.2), mats["stucco"])
    add_arch_box("Entrance_Gable_Trim", (3.2, 2.65, 2.92), (2.85, 0.12, 0.15), mats["trim_white"])
    add_arch_box("Door_Outer_Frame", (3.2, 0.95, 2.92), (1.8, 1.7, 0.08), mats["trim_white"])
    add_arch_box("Door_Left_Frame", (2.78, 0.95, 2.95), (0.75, 1.6, 0.04), mats["trim_white"])
    add_arch_box("Window_Door_Left", (2.78, 0.95, 2.96), (0.55, 1.35, 0.03), mats["window_glass"])
    add_arch_box("Door_Right_Frame", (3.62, 0.95, 2.95), (0.75, 1.6, 0.04), mats["trim_white"])
    add_arch_box("Window_Door_Right", (3.62, 0.95, 2.96), (0.55, 1.35, 0.03), mats["window_glass"])

    for idx, sx in enumerate([2.1, 4.3]):
        add_arch_box(f"Sconce_Fixture_{idx}", (sx, 1.1, 2.95), (0.12, 0.28, 0.14), mats["black_fixture"])
        add_arch_box(f"Sconce_Bulb_{idx}", (sx, 1.1, 2.98), (0.08, 0.18, 0.08), mats["sconce_emissive"])

    for i in range(6):
        add_arch_box(f"Win_Main_Frame_{i}", (-2.2 + i * 0.78, 1.05, 1.92), (0.68, 1.45, 0.08), mats["trim_white"])
        add_arch_box(f"Window_Glass_Main_{i}", (-2.2 + i * 0.78, 1.05, 1.94), (0.56, 1.32, 0.04), mats["window_glass"])

def build_roof_and_panels(mats, bpy):
    roof_pitch = math.radians(22)
    add_arch_box("Roof_Front_Plane", (-0.2, 2.75, 0.95), (5.6, 0.12, 2.6), mats["roof_metal"], rot=(roof_pitch, 0, 0))
    add_arch_box("Roof_Back_Plane", (-0.2, 2.75, -0.95), (5.6, 0.12, 2.6), mats["roof_metal"], rot=(-roof_pitch, 0, 0))
    add_arch_box("Roof_Ridge_Cap", (-0.2, 3.25, 0.0), (5.7, 0.10, 0.25), mats["roof_trim"])
    add_arch_box("Roof_Gable_Front_L", (3.2, 2.95, 1.8), (1.7, 0.12, 2.8), mats["roof_metal"], rot=(0, 0, -math.radians(25)))
    add_arch_box("Roof_Gable_Front_R", (3.2, 2.95, 1.8), (1.7, 0.12, 2.8), mats["roof_metal"], rot=(0, 0, math.radians(25)))

    mod_w, mod_h = 0.88, 1.45
    for r in range(2):
        for c in range(5):
            x_pos = -1.96 + c * (mod_w + 0.08)
            offset_down = 0.35 + r * (mod_h + 0.08)
            y_pos = 3.45 - offset_down * math.sin(roof_pitch) + 0.06
            z_pos = -0.8 + offset_down * math.cos(roof_pitch)
            add_arch_box(f"Solar_Upper_Frame_{r}_{c}", (x_pos, y_pos, z_pos), (mod_w * 0.92, 0.03, mod_h * 0.85), mats["solar_frame"], rot=(roof_pitch, 0, 0))
            add_arch_box(f"Solar_Upper_Glass_{r}_{c}", (x_pos, y_pos + 0.015, z_pos), (mod_w * 0.88, 0.02, mod_h * 0.80), mats["solar_glass"], rot=(roof_pitch, 0, 0))
