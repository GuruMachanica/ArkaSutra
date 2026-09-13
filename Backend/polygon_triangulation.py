import math
import copy
import numpy as np
try:
    import triangle
except ImportError:
    triangle = None

try:
    from geom_math import unit_normal, plane, get_y, get_height, compare_normals, reverse_vertices, centroid
except ImportError:
    from .geom_math import unit_normal, plane, get_y, get_height, compare_normals, reverse_vertices, centroid

def triangulation(e, i):
    if not triangle:
        return []
    vertices, holes, segments, idx = [], [], [], 0
    for ip in range(len(e)-1):
        vertices.append(e[ip])
        segments.append([idx, 0 if ip == len(e)-2 else idx+1])
        idx += 1
    for hole in i:
        f_idx = idx
        for p in range(len(hole)-1):
            segments.append([idx, f_idx if p == len(hole)-2 else idx+1])
            idx += 1
            vertices.append(hole[p])
        holes.append(centroid(hole[:-1]))

    normal = unit_normal(vertices[0], vertices[1], vertices[2])
    vertical = math.fabs(normal[2]) < 1e-5
    yz = all(vertices[k][0] == vertices[0][0] for k in range(1, len(vertices)))
    new_pts, new_holes = copy.deepcopy(vertices), copy.deepcopy(holes)

    if yz:
        for p in new_pts: p[0], p[1] = p[1], p[2]
        for h in new_holes: h[0], h[1] = h[1], h[2]
    elif vertical:
        for p in new_pts: p[1] = p[2]
        for h in new_holes: h[1] = h[2]

    for p in new_pts: p.pop(-1)
    for h in new_holes: h.pop(-1)

    pl = plane(e[0], e[1], e[2])
    poly = {'vertices': np.array(new_pts), 'segments': np.array(segments)}
    if new_holes: poly['holes'] = np.array(new_holes)

    t = triangle.triangulate(poly, "pQjz")
    tri_points = []
    vert = t['vertices'].tolist()
    for tri in t['triangles'].tolist():
        tmp = []
        for v in tri:
            if yz:
                adj = [vertices[0][0], vert[v][0], vert[v][1]]
            elif vertical:
                adj = [vert[v][0], get_y(pl, vert[v][0], vert[v][1]), vert[v][1]]
            else:
                adj = [vert[v][0], vert[v][1], get_height(pl, vert[v][0], vert[v][1])]
            tmp.append(adj)
        tri_normal = unit_normal(tmp[0], tmp[1], tmp[2])
        tri_points.append(tmp if compare_normals(normal, tri_normal) else reverse_vertices(tmp))
    return tri_points
