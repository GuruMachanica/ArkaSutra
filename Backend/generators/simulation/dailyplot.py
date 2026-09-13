import os
import datetime
import matplotlib as mpl
import matplotlib.pyplot as plt
import matplotlib.dates as md
import seaborn as sns

try:
    from daily_simulation import run_daily_simulation
except ImportError:
    from .daily_simulation import run_daily_simulation

mpl.use('TkAgg')
plt.rc('text', usetex=False)
plt.rc('font', family='serif')
sns.set(style="white", font='serif', rc={'axes.facecolor': '#FFFFFF', 'grid.linestyle': '', 'axes.grid': False, 'font.family': ['serif'], 'legend.frameon': True})

def plot_daily_curves():
    res = run_daily_simulation()
    tzoffset = datetime.timedelta(hours=2)
    colors = sns.color_palette()
    fig, ax1 = plt.subplots(figsize=(8, 4))

    series = [
        ('Surface A', '0327', colors[0], '--', 'o', slice(60, 170, 15)),
        ('Surface B', '0327', colors[1], '--', 'v', slice(60, 170, 15)),
        ('Surface A', '0621', colors[0], '-', 'o', slice(30, 185, 15)),
        ('Surface B', '0621', colors[1], '-', 'v', slice(30, 185, 15)),
    ]

    for surf, date_key, color, ls, marker, mslice in series:
        times = [v[0] + tzoffset for v in res[surf][date_key]]
        irrs = [v[1] for v in res[surf][date_key]]
        plt.plot(times, irrs, color=color, linestyle=ls, marker=marker, markevery=mslice)

    ax1.xaxis.set_major_formatter(md.DateFormatter('%H:%M'))
    sns.despine(left=False, bottom=False)
    ax1.set_ylim([0, 1050])
    plt.xlabel('Local time', size=14)
    plt.ylabel(r'Global solar irradiance (W/m$^{2}$)', size=14)
    plt.legend(['A on 27 Mar', 'B on 27 Mar', 'A on 21 Jun', 'B on 21 Jun'], loc='upper center', bbox_to_anchor=(0.5, 1.15), fancybox=1, shadow=0, ncol=4, numpoints=1, prop={'size': 12})
    plt.savefig('dailyplot.png', bbox_inches='tight', dpi=300)
    plt.savefig('dailyplot.pdf', bbox_inches='tight')

if __name__ == '__main__':
    plot_daily_curves()
