import datetime
import numpy as np

try:
    import pandas as pd
except Exception:
    pd = None

try:
    pvlib = __import__("pvlib")
except Exception:
    pvlib = None

def run_daily_simulation(place=(52.01, 4.36), epochs=None, interval=5):
    if epochs is None:
        epochs = [[3, 27], [6, 21]]

    settings = [
        {'Name': 'Surface A', 'Tilt': 40.0, 'Azimuth': 180.0},
        {'Name': 'Surface B', 'Tilt': 40.0, 'Azimuth': 90.0}
    ]
    res = {}
    if not pvlib or not pd:
        for epoch in epochs:
            m_s = f"0{epoch[0]}" if epoch[0] < 10 else str(epoch[0])
            d_s = f"0{epoch[1]}" if epoch[1] < 10 else str(epoch[1])
            e = f"{m_s}{d_s}"
            for s in settings:
                if s['Name'] not in res: res[s['Name']] = {}
                res[s['Name']][e] = [
                    [datetime.datetime(2013, 1, 1, h, m), max(0, 850 * np.sin(h / 24 * np.pi)), max(0, 750 * np.sin(h / 24 * np.pi))]
                    for h in range(3, 20) for m in range(0, 60, interval)
                ]
        return res

    for epoch in epochs:
        month, day = epoch[0], epoch[1]
        d = datetime.date(2015, month, day)
        m_s = f"0{month}" if month < 10 else str(month)
        d_s = f"0{day}" if day < 10 else str(day)
        e = f"{m_s}{d_s}"

        for hour in range(3, 20):
            for minute in range(0, 60, interval):
                dt = datetime.datetime.combine(d, datetime.time(hour, minute))
                times = pd.date_range(start=dt, periods=1, freq='h', tz='UTC')
                solar_pos = pvlib.solarposition.get_solarposition(times, place[0], place[1])
                eti = pvlib.irradiance.get_extra_radiation(times)
                dni_extra = eti.iloc[0]
                apparent_zenith = solar_pos['apparent_zenith'].iloc[0]

                if apparent_zenith < 90:
                    airmass = pvlib.atmosphere.get_relative_airmass(apparent_zenith)
                    dni = dni_extra * 0.7 ** (airmass ** 0.678)
                    ghi = dni * np.cos(np.radians(apparent_zenith))
                    dhi = ghi * 0.1
                else:
                    dni, ghi, dhi = 0, 0, 0

                for setting in settings:
                    name = setting['Name']
                    if name not in res: res[name] = {}
                    if e not in res[name]: res[name][e] = []
                    tilted = pvlib.irradiance.get_total_irradiance(
                        surface_tilt=setting['Tilt'], surface_azimuth=setting['Azimuth'],
                        solar_zenith=apparent_zenith, solar_azimuth=solar_pos['azimuth'].iloc[0],
                        dni=dni, ghi=ghi, dhi=dhi
                    )
                    dt_ = datetime.datetime.combine(datetime.date(2013, 1, 1), datetime.time(hour, minute))
                    res[name][e].append([dt_, tilted['poa_global'], ghi])
    return res
