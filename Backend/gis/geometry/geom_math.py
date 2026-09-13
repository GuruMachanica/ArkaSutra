import math

def det(a):
    return (a[0][0]*a[1][1]*a[2][2] + a[0][1]*a[1][2]*a[2][0] + a[0][2]*a[1][0]*a[2][1]
            - a[0][2]*a[1][1]*a[2][0] - a[0][1]*a[1][0]*a[2][2] - a[0][0]*a[1][2]*a[2][1])

def dot(a, b):
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]

def cross(a, b):
    return (a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0])

def unit_normal(a, b, c):
    x = det([[1, a[1], a[2]], [1, b[1], b[2]], [1, c[1], c[2]]])
    y = det([[a[0], 1, a[2]], [b[0], 1, b[2]], [c[0], 1, c[2]]])
    z = det([[a[0], a[1], 1], [b[0], b[1], 1], [c[0], c[1], 1]])
    mag = (x**2 + y**2 + z**2)**0.5
    if mag == 0.0:
        raise SyntaxWarning("Polygon normal has zero magnitude.")
    return (x/mag, y/mag, z/mag)

def plane(a, b, c):
    pa = (b[1]-a[1])*(c[2]-a[2]) - (c[1]-a[1])*(b[2]-a[2])
    pb = (b[2]-a[2])*(c[0]-a[0]) - (c[2]-a[2])*(b[0]-a[0])
    pc = (b[0]-a[0])*(c[1]-a[1]) - (c[0]-a[0])*(b[1]-a[1])
    pd = -1 * (pa * a[0] + pb * a[1] + pc * a[2])
    return pa, pb, pc, pd

def get_height(pl, x, y):
    return (-pl[0]*x - pl[1]*y - pl[3]) / pl[2]

def get_y(pl, x, z):
    return (-pl[0]*x - pl[2]*z - pl[3]) / pl[1]

def compare_normals(n1, n2, tol=0.0001):
    return all(math.fabs(n1[k] - n2[k]) <= tol for k in range(3))

def reverse_vertices(verts):
    return list(reversed(verts))

def smallestPoint(pts):
    return sorted(pts, key=lambda x: (x[0], x[1], x[2]))[0]

def highestPoint(pts, a=None):
    sorted_pts = sorted(pts, key=lambda x: (x[0], x[1], x[2]))
    if a is not None:
        for i in range(-1, -len(pts), -1):
            if sorted_pts[i][2] != a[2]:
                return sorted_pts[i]
    return sorted_pts[-1]

def centroid(pts):
    n = float(len(pts))
    return [sum(float(p[0]) for p in pts)/n, sum(float(p[1]) for p in pts)/n, sum(float(p[2]) for p in pts)/n]
