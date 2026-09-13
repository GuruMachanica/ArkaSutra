import pickle
import argparse
import numpy as np

try:
    import irr
except ImportError:
    try:
        from . import irr
    except Exception:
        irr = None

try:
    from tof_plotter import plot_tof
except ImportError:
    from .tof_plotter import plot_tof

def argRead(ar, default=None):
    """Corrects the argument input in case it is not in the format True/False."""
    if ar in ("0", "False"):
        return False
    if ar in ("1", "True"):
        return True
    if ar is None:
        return default if default is not None else False
    raise ValueError("Argument value not recognised.")

def compute_tof(place=(52.01, 4.36), factors=None, step=15.0, plot=False):
    """Calculate tilt and orientation factors."""
    step = float(step) if step else 15.0
    azimuths = np.linspace(0.0, 360.0, int(360.0 / step) + 1)
    tilts = np.linspace(0.0, 90.0, int(90.0 / step) + 1)

    if factors:
        with open(factors, "rb") as myFile:
            TOF = pickle.load(myFile)
    else:
        TOF = {}
        for az in azimuths:
            TOF[str(az)] = {}
            for tr in tilts:
                total = irr.yearly_total_irr(place, az, tr)
                TOF[str(az)][str(tr)] = total
                print(f"Azimuth: {az}\tTilt: {tr}\tIrradiation: {total} kWh/m^2")

        if TOF:
            with open('TOF.dict', 'wb') as dict_items_save:
                pickle.dump(TOF, dict_items_save)

    if plot:
        plot_tof(TOF)

    return TOF

def main():
    parser = argparse.ArgumentParser(description='Estimate the tilt and orientation factor (TOF) for annual insolation.')
    parser.add_argument('-lat', '--latitude', help='latitude of the place', required=False)
    parser.add_argument('-lon', '--longitude', help='longitude of the place', required=False)
    parser.add_argument('-f', '--factors', help='Load the TOF if previously precomputed', required=False)
    parser.add_argument('-s', '--step', help='Resolution of the computations.', required=False)
    parser.add_argument('-p', '--plot', help='Plot the TOFs.', required=False)

    args = vars(parser.parse_args())
    lat, lon = args['latitude'], args['longitude']
    place = (float(lat), float(lon)) if lat and lon else (52.01, 4.36)
    plot = argRead(args['plot'], False)
    compute_tof(place=place, factors=args['factors'], step=args['step'], plot=plot)

if __name__ == '__main__':
    main()