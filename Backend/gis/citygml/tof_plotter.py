import numpy as np

def plot_tof(TOF):
    import matplotlib.pyplot as plt
    from scipy.interpolate import griddata

    plt.rc('text', usetex=False)
    plt.rc('font', family='serif')

    irrTOFa, irrTOFt, irrTOFi = [], [], []
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

    origin = 'lower'
    cmap = plt.cm.get_cmap("afmhot")
    CSF = plt.contourf(xi, yi, zi, 25, cmap=cmap, origin=origin, vmin=600.0, vmax=1250.0)
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
