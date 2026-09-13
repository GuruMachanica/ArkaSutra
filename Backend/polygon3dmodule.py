import math
import copy
import markup3dmodule

try:
    from geom_math import (
        det, dot, cross, unit_normal, plane, get_height, get_y,
        compare_normals, reverse_vertices, smallestPoint, highestPoint, centroid
    )
    from polygon_validation import isPolyValid, isPolyPlanar, isPolySimple, intersection
    from polygon_triangulation import triangulation
except ImportError:
    from .geom_math import (
        det, dot, cross, unit_normal, plane, get_height, get_y,
        compare_normals, reverse_vertices, smallestPoint, highestPoint, centroid
    )
    from .polygon_validation import isPolyValid, isPolyPlanar, isPolySimple, intersection
    from .polygon_triangulation import triangulation

def getAreaOfGML(poly, height=True):
    e, i = markup3dmodule.polydecomposer(poly)
    epoints = markup3dmodule.GMLpoints(e[0])
    exteriorarea = (get3DArea(epoints) if height else get2DArea(epoints)) if isPolyValid(epoints) else 0.0
    interiorarea = 0.0
    for iring in i:
        ipoints = markup3dmodule.GMLpoints(iring)
        if isPolyValid(ipoints):
            interiorarea += get3DArea(ipoints) if height else get2DArea(ipoints)
    return exteriorarea - interiorarea

def get3DArea(polypoints):
    total = [0, 0, 0]
    for i in range(len(polypoints)):
        vi1 = polypoints[i]
        vi2 = polypoints[0] if i == len(polypoints)-1 else polypoints[i+1]
        prod = cross(vi1, vi2)
        total[0] += prod[0]
        total[1] += prod[1]
        total[2] += prod[2]
    result = dot(total, unit_normal(polypoints[0], polypoints[1], polypoints[2]))
    return math.fabs(result * 0.5)

def get2DArea(polypoints):
    flat = copy.deepcopy(polypoints)
    for p in flat:
        p[2] = 0.0
    return get3DArea(flat)

def getNormal(polypoints):
    return unit_normal(polypoints[0], polypoints[1], polypoints[2])

def getAngles(normal):
    azimuth = 90 - math.degrees(math.atan2(normal[1], normal[0]))
    if azimuth >= 360.0:
        azimuth -= 360.0
    elif azimuth < 0.0:
        azimuth += 360.0
    t = math.sqrt(normal[0]**2 + normal[1]**2)
    tilt = 0.0 if t == 0 else 90 - math.degrees(math.atan(normal[2] / t))
    return azimuth, round(tilt, 3)

def GMLstring2points(pointstring):
    coords = pointstring.split()
    assert len(coords) % 3 == 0
    return [[float(coords[i]), float(coords[i+1]), float(coords[i+2])] for i in range(0, len(coords), 3)]