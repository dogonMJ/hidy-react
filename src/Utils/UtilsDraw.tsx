import { Circle, LatLng, LayerGroup, Polygon, Polyline } from "leaflet";
import { ScaleUnit } from "types";
import geodesic from "geographiclib-geodesic"

declare const L: any

export const calGeodesic = (latlng1: LatLng, latlng2: LatLng) => {
  const geod = geodesic.Geodesic.WGS84
  return geod.Inverse(latlng1.lat, latlng1.lng, latlng2.lat, latlng2.lng).s12!
}

export const readableDistance = (distanceInMeters: number, scaleUnit: ScaleUnit) => L.GeometryUtil.readableDistance(
  distanceInMeters,
  scaleUnit === 'metric' ? true : false,
  false,
  scaleUnit === 'nautical' ? true : false,
)
export const readableArea = (areaInSqMeters: number, scaleUnit: ScaleUnit) => L.GeometryUtil.readableArea(
  areaInSqMeters,
  scaleUnit === 'imperial' ? false : ['km', 'ha', 'm'], //metric and nautical
  scaleUnit === 'imperial' ? true : false,
)

export const calPolygon = (pgLatlngs: LatLng[], scaleUnit: ScaleUnit = 'metric') => {
  const accDist: number[] = []
  pgLatlngs.forEach((latlng: LatLng, i: number) => {
    if (i > 0) {
      const distance = calGeodesic(pgLatlngs[i - 1], latlng)
      accDist.push(distance)
    }
  })
  accDist.push(calGeodesic(pgLatlngs[0], pgLatlngs.slice(-1)[0]))
  const acc = accDist.reduce((a, b) => a + b, 0)
  const accString = readableDistance(acc, scaleUnit)
  const pgArea = L.GeometryUtil.geodesicArea(pgLatlngs);
  const areaString = readableArea(pgArea, scaleUnit)
  return { area: areaString, perimeter: accString }
}

export const downloadData = (filename: string, content: string, contentType: string) => {
  const file = new Blob([content], { type: contentType })
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = filename;
  link.click();
  link.remove()
}

export const handleButton = async (content: Polygon | Polyline | Circle | LayerGroup, text: string) => {
  switch (text) {
    case 'GeoJSON':
      const geojsonContent = JSON.stringify(content.toGeoJSON(), null, 2)
      downloadData('hidy_path.json', geojsonContent, 'application/geo+json')
      break
    case 'KML':
      const kmlContent = await buildKMLData(content.toGeoJSON())
      downloadData('hidy_path.kml', kmlContent, 'application/vnd.google-earth.kml+xml')
      break
    case 'GPX':
      const gpxContent = await buildGPXData(content.toGeoJSON())
      downloadData('hidy_path.gpx', gpxContent, 'application/gpx+xml')
      break
  }
}

const getGebcoDepth = async (coordinates: number[][] | number[]) => {
  let lngs, lats;
  if (Array.isArray(coordinates[0])) {
    lngs = (coordinates as number[][]).map((coors: number[]) => coors[0]);
    lats = (coordinates as number[][]).map((coors: number[]) => coors[1]);
  } else {
    lngs = coordinates[0];
    lats = coordinates[1];
  }
  const res = await fetch(`${process.env.REACT_APP_PROXY_BASE}/data/gebco?lon=${lngs}&lat=${lats}&mode=point`)
  const json = await res.json()
  return json.z
}
export const buildKMLData = async (dataAll: any) => {
  let result = KMLTemplate.head
  if (dataAll.type === 'FeatureCollection') {
    const features = dataAll.features
    let ipt = 0;
    let ipath = 0;
    let ipoly = 0;
    await Promise.all(features.map(async (feature: any, ifeature: number) => {
      const geoType = feature.geometry.type
      switch (geoType) {
        case 'Point':
          const zpt = await getGebcoDepth(feature.geometry.coordinates)
          const ptCoor = feature.geometry.coordinates
          result += KMLTemplate.point(`Marker ${ipt}`, ptCoor[0], ptCoor[1], zpt)
          ipt += 1
          break
        case 'LineString':
          const zpath = await getGebcoDepth(feature.geometry.coordinates)
          const lineCoors = feature.geometry.coordinates.map((coordinate: number[], i: number) => `${coordinate.join(',')},${zpath[i]}`).join(' ')
          const linePts = feature.geometry.coordinates.map((coor: number[], ipt: number) => KMLTemplate.point(`Path ${ifeature} Point ${ipt}`, coor[0], coor[1], zpath[ipt], '#track-none'))
          result += KMLTemplate.lineString(`Line ${ipath}`, linePts, lineCoors)
          ipath += 1
          break
        case 'Polygon':
          const zPoly = await getGebcoDepth(feature.geometry.coordinates[0])
          const polyCoors = feature.geometry.coordinates[0].map((coordinate: number[], i: number) => `${coordinate.join(',')},${zPoly[i]}`).join(' ')
          const pgLatlngs = feature.geometry.coordinates[0].map((coords: number[]) => L.latLng(coords[1], coords[0]))
          const { area, perimeter } = calPolygon(pgLatlngs)
          result += KMLTemplate.polygon(`Polygon ${ipoly}`, polyCoors, '#polygon_style', area, perimeter)
          ipoly += 1
          break
      }
    }))
  }
  result += KMLTemplate.end
  return result
}

const buildGPXData = async (dataAll: any) => {
  let result = GPXTemplate.head
  if (dataAll.type === 'FeatureCollection') {
    const features = dataAll.features
    let iwpt = 0;
    let ipath = 0;
    await Promise.all(features.map(async (feature: any) => {
      const geoType = feature.geometry.type
      switch (geoType) {
        case 'Point':
          const zpt = await getGebcoDepth(feature.geometry.coordinates)
          const wptCoor = feature.geometry.coordinates
          const wpt = `<wpt lat="${wptCoor[1]}" lon="${wptCoor[0]}">
    <name>WPT ${iwpt}</name>
    <desc>${zpt} m</desc>
    <ele>${zpt}</ele>
  </wpt>`
          result += `
  ${wpt}`
          iwpt += 1
          break
        case 'LineString':
          const zpath = await getGebcoDepth(feature.geometry.coordinates)
          const trkpts = feature.geometry.coordinates.map((coor: number[], i: number) =>
            `<trkpt lat="${coor[1]}" lon="${coor[0]}">
          <ele>${zpath[i]}</ele>
        </trkpt>`
          ).join('\n\t\t')
          result += `
  <trk>
    <name>Hidy Path ${ipath}</name>
    <trkseg>
      ${trkpts}
    </trkseg>
  </trk>`
          ipath += 1
          break
      }
    }))
  }
  result += GPXTemplate.end
  return result
}

const GPXTemplate = {
  head: `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" creator="Hidy2" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">`,
  end: `
</gpx>`
}
const KMLTemplate = {
  point: (name: string, lng: number, lat: number, depth: number, style: string = '') => `
    <Placemark>
      <name>${name}</name>
      <styleUrl>${style}</styleUrl>
      <Point>
        <coordinates>${lng},${lat},${depth}</coordinates>
      </Point>
      <description><![CDATA[<table>
          <tr><td>Longitude: ${lng} </td></tr>
          <tr><td>Latitude: ${lat} </td></tr>
          <tr><td>GEBCO Depth: ${depth} m</td></tr>
          </table>]]>
      </description>
    </Placemark>`,
  lineString: (name: string, points: any, lineCoor: any) => `
    <Folder>
      <name>${name}</name>
      <Folder>
        <name>Points</name>${points}
      </Folder>
      <Placemark>
        <name>${name}</name>
        <styleUrl>#lineStyle</styleUrl>
        <LineString>
          <tessellate>1</tessellate>
          <coordinates>${lineCoor}</coordinates>
        </LineString>
      </Placemark>
    </Folder>`,
  polygon: (name: string, polyCoors: any, style: string = '', area: string, perimeter: string) => `
    <Placemark>
      <name>${name}</name>
      <styleUrl>${style}</styleUrl>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
              ${polyCoors}
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
      <description><![CDATA[<table>
        <tr><td>Area: ${area} </td></tr>
        <tr><td>Perimeter: ${perimeter} </td></tr>
        </table>]]>
      </description>
    </Placemark>`,
  head: `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Hidy Viewer 2</name>
    <Style id="lineStyle">
      <LineStyle>
        <color>99ffac59</color>
        <width>6</width>
      </LineStyle>
    </Style>
    <Style id="polygon_style">
      <LineStyle>
        <color>ccffac59</color>
        <width>6</width>
      </LineStyle>
      <PolyStyle>
        <color>99ffac59</color>
      </PolyStyle>
    </Style>
    <StyleMap id="track-none">
      <Pair>
        <key>normal</key>
        <styleUrl>#track-none_n</styleUrl>
      </Pair>
      <Pair>
        <key>highlight</key>
        <styleUrl>#track-none_h</styleUrl>
      </Pair>
    </StyleMap>
    <Style id="track-none_h">
      <IconStyle>
        <scale>1.2</scale>
        <heading>0</heading>
        <Icon>
          <href>https://earth.google.com/images/kml-icons/track-directional/track-none.png</href>
        </Icon>
      </IconStyle>
    </Style>
    <Style id="track-none_n">
      <IconStyle>
        <scale>0.5</scale>
        <heading>0</heading>
        <Icon>
          <href>https://earth.google.com/images/kml-icons/track-directional/track-none.png</href>
        </Icon>
      </IconStyle>
      <LabelStyle>
        <scale>0</scale>
      </LabelStyle>
    </Style>`,
  end: `
  </Document>
</kml>`,
}



// const downloadButton = async (content: Polygon | Polyline | Circle | LayerGroup, text: string) => {
//   const button = document.createElement("button");
//   button.innerHTML = text;
//   button.style.marginRight = '2px'
//   switch (text) {
//     case 'GeoJSON':
//       button.onclick = function () {
//         const geojsonContent = JSON.stringify(content.toGeoJSON(), null, 2)
//         downloadData('hidy_path.json', geojsonContent, 'application/geo+json')
//       }
//       break
//     case 'KML':
//       button.onclick = async function () {
//         const kmlContent = await buildKMLData(content.toGeoJSON())
//         downloadData('hidy_path.kml', kmlContent, 'application/vnd.google-earth.kml+xml')
//       }
//       break
//     case 'GPX':
//       button.onclick = async function () {
//         const gpxContent = await buildGPXData(content.toGeoJSON())
//         downloadData('hidy_path.gpx', gpxContent, 'application/gpx+xml')
//       }
//       break
//   }
//   return button
// }

// export const downloadPopup = async (content: Polygon | Polyline | Circle | LayerGroup) => {
//   const container = document.createElement("div");
//   container.innerHTML = `下載路徑 Download Path<br>*無圓形 Circle not supported. <br> *GPX無多邊形 GPX does not support polygons.<br>`
//   container.appendChild(await downloadButton(content, 'GeoJSON'))
//   container.appendChild(await downloadButton(content, 'KML'))
//   container.appendChild(await downloadButton(content, 'GPX'))
//   return container
// }