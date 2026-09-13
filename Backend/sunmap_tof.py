import os
import math
import pickle
import numpy as np

TOF_DATA = {"tof": None, "res": 1.0, "loaded": False}

def load_tof_factors(factors_path):
    if not factors_path or not os.path.exists(factors_path):
        TOF_DATA["loaded"] = False
        return None, 1.0
    with open(factors_path, "rb") as f:
        try:
            strings = pickle.load(f, encoding='latin1')
        except Exception:
            f.seek(0)
            strings = pickle.load(f)
    tof = {round(float(az), 2): {round(float(ti), 2): float(v) for ti, v in sub.items()} for az, sub in strings.items()}
    ts = sorted(tof)
    res = ts[1] - ts[0] if len(ts) > 1 else 1.0
    TOF_DATA["tof"], TOF_DATA["res"], TOF_DATA["loaded"] = tof, res, True
    return tof, res

def squareVerts(a, t, res):
    invRes = 1 / res
    aB, aT = math.trunc(a * invRes) / invRes, math.ceil(a * invRes) / invRes
    if aT == aB: aT += res
    tB, tT = math.trunc(t * invRes) / invRes, math.ceil(t * invRes) / invRes
    if tT == tB: tT += res
    return [[aB, aT], [tB, tT]]

def bilinear_interpolation(x, y, points):
    pts = sorted(points)
    (x1, y1, q11), (_x1, y2, q12), (x2, _y1, q21), (_x2, _y2, q22) = pts
    if x1 != _x1 or x2 != _x2 or y1 != _y1 or y2 != _y2:
        raise ValueError('points do not form a rectangle')
    return (q11 * (x2 - x) * (y2 - y) + q21 * (x - x1) * (y2 - y) +
            q12 * (x2 - x) * (y - y1) + q22 * (x - x1) * (y - y1)) / ((x2 - x1) * (y2 - y1) + 0.0)

def irr_from_tof(tilt, azimuth, tof=None, res=None):
    current_tof = tof or TOF_DATA["tof"]
    current_res = res or TOF_DATA["res"]
    if not current_tof:
        return 1000.0
    gs = squareVerts(azimuth, tilt, current_res)
    azG, tiG = np.array(gs[0]), np.array(gs[1])
    vals = [
        (azG[0], tiG[1], current_tof[azG[0]][tiG[1]]),
        (azG[0], tiG[0], current_tof[azG[0]][tiG[0]]),
        (azG[1], tiG[1], current_tof[azG[1]][tiG[1]]),
        (azG[1], tiG[0], current_tof[azG[1]][tiG[0]])
    ]
    return bilinear_interpolation(azimuth, tilt, vals)
