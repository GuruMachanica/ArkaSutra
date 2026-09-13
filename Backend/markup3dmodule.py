try:
    from lxml import etree
except ImportError:
    import xml.etree.ElementTree as etree

#-- Name spaces
ns_citygml="http://www.opengis.net/citygml/2.0"

ns_gml = "http://www.opengis.net/gml"
ns_bldg = "http://www.opengis.net/citygml/building/2.0"
ns_xsi="http://www.w3.org/2001/XMLSchema-instance"
ns_xAL="urn:oasis:names:tc:ciq:xsdschema:xAL:2.0"
ns_xlink="http://www.w3.org/1999/xlink"
ns_dem="http://www.opengis.net/citygml/relief/2.0"

nsmap = {
    None : ns_citygml,
    'gml': ns_gml,
    'bldg': ns_bldg,
    'xsi' : ns_xsi,
    'xAL' : ns_xAL,
    'xlink' : ns_xlink,
    'dem' : ns_dem
}

def polydecomposer(polygon):
    """Extracts the <gml:exterior> and <gml:interior> of a <gml:Polygon>."""
    exter = polygon.findall('.//{%s}exterior' %ns_gml)
    inter = polygon.findall('.//{%s}interior' %ns_gml)
    return exter, inter


def polygonFinder(GMLelement):
    """Find the <gml:polygon> element."""
    polygonsLocal = GMLelement.findall('.//{%s}Polygon' %ns_gml)
    return polygonsLocal


def GMLpoints(ring):
    "Extract points from a <gml:LinearRing>."
    #-- List containing points
    listPoints = []
    #-- Read the <gml:posList> value and convert to string
    if len(ring.findall('.//{%s}posList' %ns_gml)) > 0:
        points = ring.findall('.//{%s}posList' %ns_gml)[0].text
        #-- List of coordinates
        coords = points.split()
        assert(len(coords) % 3 == 0)
        #-- Store the coordinate tuple
        for i in range(0, len(coords), 3):
            listPoints.append([float(coords[i]), float(coords[i+1]), float(coords[i+2])])
    elif len(ring.findall('.//{%s}pos' %ns_gml)) > 0:
        points = ring.findall('.//{%s}pos' %ns_gml)
        #-- Extract each point separately
        for p in points:
            coords = p.text.split()
            assert(len(coords) % 3 == 0)
            #-- Store the coordinate tuple
            for i in range(0, len(coords), 3):
                listPoints.append([float(coords[i]), float(coords[i+1]), float(coords[i+2])])
    else:
        return None

    return listPoints