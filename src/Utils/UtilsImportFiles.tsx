import L, { LatLng } from 'leaflet';
import * as geojson from 'geojson';
import Spectral_10 from "assets/jsons/Spectral_10.json"
import { renderToString } from "react-dom/server";
import FormatCoordinate from 'components/FormatCoordinate';
//@ts-ignore
import shp, { combine, parseShp, parseDbf } from 'shpjs'
//@ts-ignore
import omnivore from '@mapbox/leaflet-omnivore'

interface DropGeoJSON extends L.GeoJSON {
  name?: string
}

const { colors } = Spectral_10

const flattenObj = (obj: any, parent: string | null, res: any = {}) => {
  //https://stackoverflow.com/questions/44134212/best-way-to-flatten-js-object-keys-and-values-to-a-single-depth-array
  for (let key in obj) {
    let propName = parent ? `${parent}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      flattenObj(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
}

export const readFile = (file: Blob, readAs: 'arrayBuffer' | 'text', callback: (this: FileReader, ev: ProgressEvent<FileReader>) => any) => {
  const reader = new FileReader();
  reader.onload = callback
  if (readAs === 'text') {
    reader.readAsText(file)
  } else {
    reader.readAsArrayBuffer(file)
  }
}

export const importStyleFunc = (feature: geojson.Feature<geojson.Geometry, any> | undefined, colorIndex: number) => {
  const type = feature?.geometry.type
  const number = colorIndex
  const color = colors[number % 10].value
  if (type === 'Point' || type === 'MultiPoint') {
    return {
      radius: 5,
      opacity: 1,
      color: '#000000',
      stroke: true,
      weight: 0.2,
      fillColor: color,//'#ffc16f',
      fillOpacity: 1,
    };
  } else {
    return {
      radius: 5,
      opacity: 1,
      color: color,//'#ff7070',
      stroke: true,
      weight: 2,
    }
  }
}

export const importPointToLayer = (feature: geojson.Feature<geojson.Point, any>, latlng: LatLng) => {
  return new L.CircleMarker(latlng)
}

export const readFile2 = (file: Blob, readAs: 'arrayBuffer' | 'text' | 'url'): Promise<string | ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result);
      }
    };
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    switch (readAs) {
      case 'text':
        reader.readAsText(file);
        break
      case 'arrayBuffer':
        reader.readAsArrayBuffer(file);
        break
      case 'url':
        reader.readAsDataURL(file)
    }
  });
};

const onEachFeatureKML = (feature: geojson.Feature<geojson.GeometryObject, any>, layer: L.Layer, latlonFormat: string) => {
  const name = feature.properties.name
  if (feature.properties.description) {
    if (feature.geometry.type === 'Point') {
      const position = { lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] }
      layer.bindPopup(`${name}<br>${feature.properties.description}`)
        .bindTooltip(`${name}<br>${renderToString(<FormatCoordinate coords={position} format={latlonFormat} />)}`)
    } else {
      layer.bindPopup(`${name}<br>${feature.properties.description}`).bindTooltip(`${name}`)
    }
  } else {
    if (feature.geometry.type === 'Point') {
      const position = { lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] }
      layer.bindPopup(name)
        .bindTooltip(`${name}<br>${renderToString(<FormatCoordinate coords={position} format={latlonFormat} />)}`)
    } else {
      layer.bindPopup(name).bindTooltip(name)
    }
  }
}

const onEachFeatureJSON = (feature: geojson.Feature<geojson.GeometryObject, any>, layer: L.Layer, latlonFormat: string) => {
  if (feature.properties) {
    let content = ''
    if (Object.getOwnPropertyNames(feature.properties).length > 0) {
      const flattened = flattenObj(feature.properties, null)
      Object.keys(flattened).forEach((key) => {
        content = content.concat(`${key}: ${flattened[key]}<br>`)
      })
    } else {
      content = '<i>empty properties or .dbf not provided with .shp</i>'
    }
    if (feature.geometry.type === 'Point') {
      const position = { lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] }
      layer.bindPopup(content).bindTooltip(renderToString(<FormatCoordinate coords={position} format={latlonFormat} />))
    } else {
      layer.bindPopup(content)
    }
  }
}

const onEachFeatureGPX = (feature: geojson.Feature<geojson.GeometryObject, any>, layer: L.Layer, latlonFormat: string) => {
  if (feature.geometry.type === 'Point') {
    const position = { lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] }
    const coords = renderToString(<FormatCoordinate coords={position} format={latlonFormat} />)
    layer.bindPopup(`${feature.properties.time}<br>${coords}<br>Elevation: ${feature.properties.elevation} m`).bindTooltip(feature.properties.time)
    // layer.bindPopup(`${feature.properties.time}<br>Elevation: ${feature.properties.elevation} m`).bindTooltip(feature.properties.time)
  }
}

export const getLeafletLayer = (files: any, initColorIndex: number, latlonformat: string) => {
  let colorIndex = initColorIndex
  const promises = files.map(async (file: any) => {
    const extension = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length).toLowerCase()
    const fileType = file.type ? file.type : extension
    const currentColorIndex = colorIndex;
    colorIndex += 1
    switch (fileType) {
      case 'dbf':
        const filename = file.name.slice(0, file.name.lastIndexOf('.'))
        const shpFile = files.find((obj: any) => obj.name === `${filename}.shp`)
        return shpFile ? 'CustomLayer.alert.dbfAdd' : 'CustomLayer.alert.dbfNoMatch'
      case 'shp':
        try {
          const filename = file.name.slice(0, file.name.lastIndexOf('.'))
          const dbfFile = files.find((obj: any) => obj.name === `${filename}.dbf`)
          let shpData;
          if (dbfFile) {
            const shpBuffer = await file.arrayBuffer()
            const dbfBuffer = await dbfFile.arrayBuffer()
            shpData = combine([parseShp(shpBuffer), parseDbf(dbfBuffer)])
          } else {
            const url = await readFile2(file, 'url')
            shpData = await shp(url)
          }
          const shpLayer: DropGeoJSON = L.geoJSON(shpData, {
            style: (feature) => importStyleFunc(feature, currentColorIndex),
            pointToLayer: importPointToLayer,
            onEachFeature: (feature, layer) => onEachFeatureJSON(feature, layer, latlonformat),
          })
          shpLayer.name = file.name
          return shpLayer
        } catch (e) {
          return 'CustomLayer.alert.noLayer'
        }
      case 'application/x-zip-compressed':
        const arrayBuffer = await readFile2(file, 'arrayBuffer')
        try {
          const shpData = await shp(arrayBuffer)
          const shpLayer: DropGeoJSON = L.geoJSON(shpData, {
            style: (feature) => importStyleFunc(feature, currentColorIndex),
            pointToLayer: importPointToLayer,
            onEachFeature: (feature, layer) => onEachFeatureJSON(feature, layer, latlonformat),
          })
          shpLayer.name = file.name
          return shpLayer
        } catch (e) {
          return 'CustomLayer.alert.noLayer'
        }
      case 'application/vnd.google-earth.kml+xml':
        const kml = await readFile2(file, 'text')
        try {
          const customLayer = L.geoJSON(undefined, {
            style: (feature) => importStyleFunc(feature, currentColorIndex),
            pointToLayer: importPointToLayer,
            onEachFeature: (feature, layer) => onEachFeatureKML(feature, layer, latlonformat),
          });
          const kmlLayer = omnivore.kml.parse(kml, null, customLayer)
          kmlLayer.name = file.name
          return kmlLayer
        } catch (e) {
          return 'CustomLayer.alert.noLayer'
        }
      case 'application/json':
        const json = await readFile2(file, 'text')
        try {
          if (typeof (json) === 'string') {
            const jsonLayer: DropGeoJSON = L.geoJSON(JSON.parse(json), {
              style: (feature) => importStyleFunc(feature, currentColorIndex),
              pointToLayer: importPointToLayer,
              onEachFeature: (feature, layer) => onEachFeatureJSON(feature, layer, latlonformat),
            })
            jsonLayer.name = file.name
            return jsonLayer
          } else {
            return 'CustomLayer.alert.noLayer'
          }
        } catch (e) {
          return 'CustomLayer.alert.noLayer'
        }
      case 'gpx':
        const gpx = await readFile2(file, 'text')
        try {
          if (typeof (gpx) === 'string') {
            const pointFeatures: any = []
            const customLayer = L.geoJSON(undefined, {
              onEachFeature: (feature: geojson.Feature<geojson.GeometryObject, any>, layer: L.Layer) => {
                if (feature.geometry.type === "LineString") {
                  feature.geometry.coordinates.forEach((coordinate, i) => {
                    pointFeatures.push({
                      "type": "Feature",
                      "geometry": {
                        "type": "Point",
                        "coordinates": [coordinate[0], coordinate[1], coordinate[2]]
                      },
                      "properties": {
                        "elevation": coordinate[2],
                        "time": feature.properties.coordTimes ? feature.properties.coordTimes[i] : ''
                      }
                    })
                  });
                } else if (feature.geometry.type === "MultiLineString") {
                  feature.geometry.coordinates.forEach((coordinates1, i) => {
                    coordinates1.forEach((coordinate, j) => {
                      pointFeatures.push({
                        "type": "Feature",
                        "geometry": {
                          "type": "Point",
                          "coordinates": [coordinate[0], coordinate[1], coordinate[2]]
                        },
                        "properties": {
                          "elevation": coordinate[2],
                          "time": feature.properties.coordTimes ? feature.properties.coordTimes[i][j] : ''
                        }
                      })
                    })
                  })
                }
              }
            });
            omnivore.gpx.parse(gpx, null, customLayer)
            const geojson: GeoJSON.FeatureCollection = {
              "type": "FeatureCollection",
              "features": pointFeatures,
            };
            const gpxLayer: DropGeoJSON = L.geoJSON(geojson, {
              style: (feature) => importStyleFunc(feature, currentColorIndex),
              pointToLayer: importPointToLayer,
              onEachFeature: (feature, layer) => onEachFeatureGPX(feature, layer, latlonformat),
            })
            gpxLayer.name = file.name
          } else {
            return null
          }
        } catch (e) {
          return null
        }
    }
  })
  return Promise.all(promises)
}