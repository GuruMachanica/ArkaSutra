import math
import copy
from .geom_math import unit_normal, dot

def intersection(p, q, r, s, eps=1e-5):
    V = [q[0] - p[0], q[1] - p[1]]
    W = [r[0] - s[0], r[1] - s[1]]
    d = V[0]*W[1] - W[0]*V[1]
    return math.fabs(d) >= eps

def isPolyPlanar(polypoints, eps=0.01):
    normal = unit_normal(polypoints[0], polypoints[1], polypoints[2])
    p0 = polypoints[0]
    for i in range(3, len(polypoints)):
        vec = [polypoints[i][0] - p0[0], polypoints[i][1] - p0[1], polypoints[i][2] - p0[2]]
        if math.fabs(dot(vec, normal)) > eps:
            return False
    return True

def isPolySimple(polypoints):
    n = len(polypoints)
    temp = copy.deepcopy(polypoints)
    new_pts = copy.deepcopy(temp)
    normal = unit_normal(temp[0], temp[1], temp[2])
    vertical = math.fabs(normal[2]) < 1e-5
    yz = all(temp[i][0] == temp[0][0] for i in range(1, n))

    if yz:
        for i in range(n):
            new_pts[i][0], new_pts[i][1] = temp[i][1], temp[i][2]
    elif vertical:
        for i in range(n):
            new_pts[i][1] = temp[i][2]

    for i in range(n - 3):
        m = n - 3 if i == 0 else n - 2
        for j in range(i + 2, m):
            if intersection(new_pts[i], new_pts[i+1], new_pts[j % n], new_pts[(j+1) % n]):
                return False
    return True

def isPolyValid(polypoints, output=True):
    if polypoints[0] != polypoints[-1]:
        if output: print("A degenerate polygon. First and last points do not match.")
        return False
    if len(polypoints) < 4:
        if output: print("A degenerate polygon. The number of points is smaller than 3.")
        return False
    if not isPolyPlanar(polypoints):
        if output: print("A degenerate polygon. The points are not planar.")
        return False
    return True
