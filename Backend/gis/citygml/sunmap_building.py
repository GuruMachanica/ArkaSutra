try:
    from Backend.gis.geometry import polygon3dmodule, markup3dmodule
except ImportError:
    try:
        from ..geometry import polygon3dmodule, markup3dmodule
    except ImportError:
        from gis.geometry import polygon3dmodule, markup3dmodule

try:
    from .irr import yearly_total_irr
except ImportError:
    try:
        from irr import yearly_total_irr
    except ImportError:
        yearly_total_irr = None

try:
    from .sunmap_tof import TOF_DATA, irr_from_tof
except ImportError:
    from sunmap_tof import TOF_DATA, irr_from_tof

ns_citygml = "http://www.opengis.net/citygml/2.0"
ns_bldg = "http://www.opengis.net/citygml/building/2.0"
ns_gml = "http://www.opengis.net/gml"

def get_iter(elem, tag=None):
    return elem.iter(tag) if hasattr(elem, 'iter') else elem.getiterator(tag)

def oparea(el):
    area = 0.0
    for child in get_iter(el):
        if child.tag == '{%s}opening' % ns_bldg:
            for match in child.findall('.//{%s}surfaceMember' % ns_gml):
                area += polygon3dmodule.getAreaOfGML(match, True)
    return area

class Building(object):
    def __init__(self, xml, id, list_roofs=None, roof_data_dict=None):
        self.id, self.xml = id, xml
        self.roofdata, self.listOfOpenings = {}, []
        self.list_roofs = list_roofs if list_roofs is not None else []
        self.roof_data_dict = roof_data_dict if roof_data_dict is not None else {}
        self.RoofSurfaceArea = self.roofarea()
        self.WallSurfaceArea = self.wallarea()
        self.GroundSurfaceArea = self.groundarea()
        self.OpeningArea = self.openingarea()
        self.solarinfo()

    def solarinfo(self):
        place = (52.01, 4.36)
        for rs in self.roofsurfaces:
            pid = rs.attrib.get('{%s}id' % ns_gml, 'unknown')
            if pid in self.listOfOpenings: continue
            self.list_roofs.append(rs)
            area = polygon3dmodule.getAreaOfGML(rs, True)
            norm = polygon3dmodule.getNormal(markup3dmodule.GMLpoints(markup3dmodule.polydecomposer(rs)[0][0]))
            az, tilt = polygon3dmodule.getAngles(norm)
            az = 0.0 if (az == 360.0 or tilt == 0.0) else round(az, 3)
            tilt = 0.0 if tilt == 180 else (tilt - 180.01 if tilt >= 180 else (tilt - 90.01 if tilt > 90 else (89.9 if tilt == 90 else round(tilt, 3))))

            if TOF_DATA["loaded"]:
                irradiation = irr_from_tof(tilt, az)
            elif yearly_total_irr:
                irradiation = yearly_total_irr(place, az, tilt)
            else:
                irradiation = 1000.0

            item = {'area': area, 'azimuth': az, 'tilt': tilt, 'irradiation': irradiation, 'total_irradiation': irradiation * area}
            self.roofdata[pid] = item
            self.roof_data_dict[pid] = item
        self.sumIrr = sum(v['total_irradiation'] for v in self.roofdata.values())

    def roofarea(self):
        self.roofs = [c for c in get_iter(self.xml) if c.tag == '{%s}RoofSurface' % ns_bldg]
        self.roofsurfaces = [w for s in self.roofs for w in s.findall('.//{%s}Polygon' % ns_gml)]
        return sum(polygon3dmodule.getAreaOfGML(r, True) for r in self.roofsurfaces) - sum(oparea(r) for r in self.roofs)

    def wallarea(self):
        walls = [c for c in get_iter(self.xml) if c.tag == '{%s}WallSurface' % ns_bldg]
        surfs = [w for s in walls for w in s.findall('.//{%s}Polygon' % ns_gml)]
        return sum(polygon3dmodule.getAreaOfGML(w, True) for w in surfs) - sum(oparea(w) for w in walls)

    def groundarea(self):
        grounds = [c for c in get_iter(self.xml) if c.tag == '{%s}GroundSurface' % ns_bldg]
        return sum(polygon3dmodule.getAreaOfGML(g, True) for g in grounds)

    def openingarea(self):
        ops = [c for c in get_iter(self.xml) if c.tag == '{%s}opening' % ns_bldg]
        for op in ops:
            for poly in op.findall('.//{%s}Polygon' % ns_gml):
                self.listOfOpenings.append(poly.attrib.get('{%s}id' % ns_gml, ''))
        return sum(oparea(op) for op in ops)
