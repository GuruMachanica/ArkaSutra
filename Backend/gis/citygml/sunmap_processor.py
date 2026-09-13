import os
import glob
try:
    from lxml import etree
except ImportError:
    import xml.etree.ElementTree as etree

try:
    from sunmap_tof import load_tof_factors
    from sunmap_building import Building, get_iter, ns_bldg, ns_gml, ns_citygml
except ImportError:
    from .sunmap_tof import load_tof_factors
    from .sunmap_building import Building, get_iter, ns_bldg, ns_gml, ns_citygml

def enrich_xml_surfaces(roof_xmls, roof_data, buildings, building_classes, solardata):
    for rsxml in roof_xmls:
        rsid = rsxml.attrib.get('{%s}id' % ns_gml, '')
        data = roof_data.get(rsid, {})
        for tag, key, unit in [("area", "area", "m^2"), ("totalIrradiation", "total_irradiation", "kWh"),
                               ("azimuth", "azimuth", "degree"), ("tilt", "tilt", "degree"), ("irradiation", "irradiation", "kWh/m^2")]:
            el = etree.SubElement(rsxml, tag)
            el.text = str(data.get(key, 0))
            el.attrib['unit'] = unit

    for b in buildings:
        bid = b.attrib.get('{%s}id' % ns_gml, '')
        bdata = solardata.get(bid, {})
        s = etree.SubElement(b, "roofArea")
        s.text, s.attrib['unit'] = str(bdata.get('roofarea', 0)), 'm^2'
        i = etree.SubElement(b, "yearlyIrradiation")
        i.text, i.attrib['unit'] = str(bdata.get('totalIrradiation', 0)), 'kWh'

def process_citygml_directory(directory, result_dir, factors_path=None):
    if factors_path:
        load_tof_factors(factors_path)

    for f in glob.glob(os.path.join(directory, "*.gml")):
        fname = os.path.basename(f)[:os.path.basename(f).rfind('.')]
        citygml = etree.parse(f)
        root = citygml.getroot()
        roof_xmls, roof_data = [], {}

        buildings = [child for obj in get_iter(root, '{%s}cityObjectMember' % ns_citygml)
                     for child in list(obj) if child.tag == '{%s}Building' % ns_bldg]
        b_classes = [Building(b, b.attrib.get('{%s}id' % ns_gml, ''), roof_xmls, roof_data) for b in buildings]

        solardata = {bu.id: {'roofarea': bu.roofarea(), 'totalIrradiation': bu.sumIrr} for bu in b_classes}
        rsc = sum(bu.RoofSurfaceArea for bu in b_classes)

        if rsc > 0:
            enrich_xml_surfaces(roof_xmls, roof_data, buildings, b_classes, solardata)
            os.makedirs(result_dir, exist_ok=True)
            with open(os.path.join(result_dir, f"{fname}-solar.gml"), 'wb') as out_f:
                out_f.write(etree.tostring(root))
            print(f"Processed and enriched: {fname}-solar.gml")
        else:
            print(f"No RoofSurfaces found in {fname}")
