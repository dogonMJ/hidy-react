import { Circle, LayerGroup, Polygon, Polyline } from "leaflet";

export const downloadPopup = async (content: Polygon | Polyline | Circle | LayerGroup) => {
  const container = document.createElement("div");
  container.innerHTML = `Download Path<br>`
  container.appendChild(await downloadButton(content, 'GeoJSON'))
  container.appendChild(await downloadButton(content, 'KML'))
  container.appendChild(await downloadButton(content, 'GPX'))
  // container.appendChild(downloadButton('hidy_path.json', content, 'text/plain;chartset=utf-8', 'CSV'))
  return container
}

const downloadData = (filename: string, content: string, contentType: string) => {
  const file = new Blob([content], { type: contentType })
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = filename;
  link.click();
  link.remove()
}

const downloadButton = async (content: Polygon | Polyline | Circle | LayerGroup, text: string) => {
  const button = document.createElement("button");
  button.innerHTML = text;
  switch (text) {
    case 'GeoJSON':
      button.onclick = function () {
        const geojsonContent = JSON.stringify(content.toGeoJSON(), null, 2)
        downloadData('hidy_path.json', geojsonContent, 'application/geo+json')
      }
      break
    case 'KML':
      button.onclick = async function () {
        const kmlContent = await buildKMLData(content.toGeoJSON())
        downloadData('hidy_path.kml', kmlContent, 'application/vnd.google-earth.kml+xml')
      }
      break
    case 'GPX':
      button.onclick = async function () {
        const gpxContent = await buildGPXData(content.toGeoJSON())
        downloadData('hidy_path.gpx', gpxContent, 'application/gpx+xml')
      }
      break
    case 'CSV':
  }
  return button
}

const getGebcoDepth = async (coordinates: number[][]) => {
  const lngs = coordinates.map((coors) => coors[0])
  const lats = coordinates.map((coors) => coors[1])
  const res = await fetch(`${process.env.REACT_APP_PROXY_BASE}/data/gebco?lon=${lngs}&lat=${lats}&mode=point`)
  const json = await res.json()
  return json.z
}
const buildKMLData = async (dataAll: any) => {
  let result = KMLTemplate.head
  console.log(dataAll)
  if (dataAll.type === 'FeatureCollection') {
    const features = dataAll.features
    await Promise.all(features.map(async (feature: any, ifeature: number) => {
      const geoType = feature.geometry.type
      switch (geoType) {
        case 'Point':
          const ptCoor = feature.geometry.coordinates
          const pts = KMLTemplate.point(`Marker ${ifeature}`, ptCoor[0], ptCoor[1], 0)
          result += `
    ${pts}`
          break
        case 'LineString':
          const z = await getGebcoDepth(feature.geometry.coordinates)
          const lineCoors = feature.geometry.coordinates.map((coordinate: number[]) => coordinate.join(',')).join(' ')
          const linePts = feature.geometry.coordinates.map((coor: number[], ipt: number) => KMLTemplate.point(`Path ${ifeature} Point ${ipt}`, coor[0], coor[1], z[ipt], '#track-none')).join('\n\t\t')
          result += `
    <Folder>
      <name>Feature ${ifeature}</name>
      <Folder>
        <name>Points</name>
        ${linePts}
      </Folder>
      <Placemark>
        <name>Feature ${ifeature}</name>
        <styleUrl>#lineStyle</styleUrl>
        <LineString>
          <tessellate>1</tessellate>
          <coordinates>${lineCoors}</coordinates>
        </LineString>
      </Placemark>
    </Folder>
    `
          break
        // case 'Polygon':
      }
    }))
  }
  result += KMLTemplate.end
  return result
}

const buildGPXData = async (dataAll: any) => {
  const z = await getGebcoDepth(dataAll.geometry.coordinates)
  let result = GPXTemplate.head
  if (dataAll.type === 'Feature' && dataAll.geometry.type === 'LineString') {
    const trkpts = dataAll.geometry.coordinates.map((coor: number[], i: number) =>
      `<trkpt lat="${coor[1]}" lon="${coor[0]}">
          <ele>${z[i]}</ele>
        </trkpt>`
    ).join('\n\t\t')
    result += `
    <trk>
      <name>Hidy Path</name>
      <trkseg>
        ${trkpts}
      </trkseg>
    </trk>`
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
  point: (name: string, lng: number, lat: number, depth: number, style: string = '') =>
    `<Placemark>
      <name>${name}</name>
      <styleUrl>${style}</styleUrl>
      <Point>
        <coordinates>${lng},${lat}</coordinates>
      </Point>
      <description><![CDATA[<table>
          <tr><td>Longitude: ${lng} </td></tr>
          <tr><td>Latitude: ${lat} </td></tr>
          <tr><td>GEBCO Depth: ${depth} m</td></tr>
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
  end: `</Document>
</kml>`,
}