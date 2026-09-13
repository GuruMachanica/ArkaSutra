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


def argRead(ar, default=None):
    """Corrects the argument input in case it is not in the format True/False."""
    if ar == "0" or ar == "False":
        ar = False
    elif ar == "1" or ar == "True":
        ar = True
    elif ar is None:
        if default:
            ar = default
        else:
            ar = False
    else:
        raise ValueError("Argument value not recognised.")
    return ar

def compute_tof(place=(52.01, 4.36), factors=None, step=15.0, plot=False):
    """Calculate tilt and orientation factors."""
    loadDict = bool(factors)
    step = float(step) if step else 15.0

    asteps = int(360.0 / step)
    tsteps = int(90.0 / step)
    azimuths = np.linspace(0.0, 360.0, asteps + 1)
    tilts = np.linspace(0.0, 90.0, tsteps + 1)

    if loadDict:
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
        import matplotlib.pyplot as plt
        from scipy.interpolate import griddata

        plt.rc('text', usetex=False)
        plt.rc('font', family='serif')

        irrTOFa = []
        irrTOFt = []
        irrTOFi = []
        for azimuth in TOF:
            for tilt in TOF[azimuth]:
                radiationAmount = TOF[azimuth][tilt]
                irrTOFa.append(float(azimuth))
                irrTOFt.append(float(tilt))
                irrTOFi.append(float(radiationAmount))

        plt.figure(1)
        xi = np.linspace(90, 270, 180)
        yi = np.linspace(0, 90, 90)
        zi = griddata((irrTOFa, irrTOFt), irrTOFi, (xi[None, :], yi[:, None]), method='nearest')

        vmin = 600.0
        vmax = 1250.0

        origin = 'lower'
        cmap = plt.cm.get_cmap("afmhot")
        CSF = plt.contourf(xi, yi, zi, 25, cmap=cmap, origin=origin, vmin=vmin, vmax=vmax)
        CS = plt.contour(xi, yi, zi, 25, origin=origin, linewidths=.25, colors='k')
        plt.axes().set_aspect('equal')
        plt.xticks(np.arange(90.0, 270.01, 10.0))
        plt.tick_params(axis='both', which='major', labelsize=9)
        plt.clabel(CS, inline=1, fontsize=7, colors='k', fmt='%1.0f')
        plt.xlim(90, 270)
        plt.ylim(0, 90)

        ttl = "Global solar irradiation on a tilted and oriented surface\nin Delft, the Netherlands (N52.01, E4.36)"
        plt.title(ttl, fontsize=12)
        plt.xlabel("Azimuth [deg]", fontsize=11)
        plt.ylabel("Tilt [deg]", fontsize=11)
        cbar = plt.colorbar(CSF, shrink=0.55)
        cbar.ax.set_ylabel("Annual solar irradiation [kWh/m2/yr]", fontsize=11)
        plt.savefig('TOF-plot.pdf', bbox_inches='tight')
        plt.show()

    return TOF

def main():
    parser = argparse.ArgumentParser(description='Estimate the tilt and orientation factor (TOF) for the annual insolation.')
    parser.add_argument('-lat', '--latitude', help='latitude of the place', required=False)
    parser.add_argument('-lon', '--longitude', help='longitude of the place', required=False)
    parser.add_argument('-f', '--factors', help='Load the TOF if previously precomputed', required=False)
    parser.add_argument('-s', '--step', help='Resolution of the computations.', required=False)
    parser.add_argument('-p', '--plot', help='Plot the TOFs.', required=False)

    args = vars(parser.parse_args())
    lat = args['latitude']
    lon = args['longitude']
    place = (float(lat), float(lon)) if lat and lon else (52.01, 4.36)
    plot = argRead(args['plot'], False)

    compute_tof(place=place, factors=args['factors'], step=args['step'], plot=plot)

if __name__ == '__main__':
    main()