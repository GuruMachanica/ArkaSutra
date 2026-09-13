import numpy as np
try:
    from lxml import etree
except ImportError:
    import xml.etree.ElementTree as etree

ns_citygml = "http://www.opengis.net/citygml/2.0"
ns_gml = "http://www.opengis.net/gml"
ns_bldg = "http://www.opengis.net/citygml/building/2.0"

def get_building_geometry(building):
    points = []
    polygons = building.findall('.//{%s}Polygon' % ns_gml)
    for polygon in polygons:
        pos_list = polygon.find('.//{%s}posList' % ns_gml)
        if pos_list is not None and pos_list.text:
            coords = pos_list.text.strip().split()
            for i in range(0, len(coords), 3):
                if i + 2 < len(coords):
                    points.append([float(coords[i]), float(coords[i+1]), float(coords[i+2])])
    return points

def calculate_dimensions(geometry):
    if not geometry:
        return {'width': 20.0, 'height': 15.0, 'depth': 20.0}
    pts = np.array(geometry)
    mn, mx = np.min(pts, axis=0), np.max(pts, axis=0)
    return {
        'width': float(max(mx[0] - mn[0], 5.0)),
        'height': float(max(mx[2] - mn[2], 5.0)),
        'depth': float(max(mx[1] - mn[1], 5.0))
    }

def calculate_position(geometry):
    if not geometry:
        return {'x': 0.0, 'y': 0.0, 'z': 0.0}
    center = np.mean(np.array(geometry), axis=0)
    return {'x': float(center[0]), 'y': float(center[2]), 'z': float(center[1])}

def extract_surface_data(roof_surface):
    try:
        surface_id = roof_surface.get('{%s}id' % ns_gml, 'unknown')
        def _get_val(tag, default):
            el = roof_surface.find(tag)
            return float(el.text) if el is not None and el.text else default
        return {
            'id': surface_id, 'area': _get_val('area', 100.0),
            'azimuth': _get_val('azimuth', 180.0), 'tilt': _get_val('tilt', 30.0),
            'irradiation': _get_val('irradiation', 1000.0),
            'totalIrradiation': _get_val('totalIrradiation', 100000.0)
        }
    except Exception:
        return None

def extract_roof_surfaces(building):
    roof_surfaces = []
    for r in building.findall('.//{%s}RoofSurface' % ns_bldg):
        data = extract_surface_data(r)
        if data:
            roof_surfaces.append(data)
    return roof_surfaces

def extract_building_data(building):
    try:
        bid = building.get('{%s}id' % ns_gml, 'unknown')
        geom = get_building_geometry(building)
        roofs = extract_roof_surfaces(building)
        if not roofs:
            return None
        return {
            'id': bid, 'position': calculate_position(geom),
            'dimensions': calculate_dimensions(geom), 'roofSurfaces': roofs, 'geometry': geom
        }
    except Exception:
        return None
