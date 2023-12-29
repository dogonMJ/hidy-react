import { useState } from "react"
import L, { LatLng } from 'leaflet';
import { useMap } from "react-leaflet"
import { IconButton } from "@mui/material";
import Close from "@mui/icons-material/Close";
import * as geojson from 'geojson';
import { renderToString } from "react-dom/server";
import FormatCoordinate from "components/FormatCoordinate";
//@ts-ignore
import omnivore from '@mapbox/leaflet-omnivore'
//@ts-ignore
import Spectral_10 from "assets/jsons/Spectral_10.json"
import { useAppSelector } from "hooks/reduxHooks";

interface DropGeoJSON extends L.GeoJSON {
  filename?: string
}

const { colors } = Spectral_10

function flattenObj(obj: any, parent: string | null, res: any = {}) {
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

export const DragDrop = () => {
  const map = useMap()
  const [dataList, setDataList] = useState<any>([])
  const [dropCount, setDropCount] = useState(0)
  const latlonFormat = useAppSelector(state => state.map.latlonformat)
  const mapContainer = document.getElementById('mapContainer')

  const pointToLayer = (feature: geojson.Feature<geojson.Point, any>, latlng: LatLng) => {
    return new L.CircleMarker(latlng)
  }
  const onEachFeatureKML = (feature: geojson.Feature<geojson.GeometryObject, any>, layer: L.Layer) => {
    if (feature.geometry.type === 'Point') {
      let content = ''
      const flattened = flattenObj(feature.properties, null)
      Object.keys(flattened).forEach((key) => {
        content = content.concat(`${key}: ${flattened[key]}<br>`)
      })
      layer.bindPopup(content).bindTooltip(content)
    } else {
      if (feature.properties.description) {
        layer.bindPopup(`${feature.properties.name}<br>${feature.properties.description}`).bindTooltip(feature.properties.name)
      } else {
        layer.bindPopup(feature.properties.name).bindTooltip(feature.properties.name)
      }
    }
  }
  const onEachFeatureJSON = (feature: geojson.Feature<geojson.GeometryObject, any>, layer: L.Layer) => {
    if (feature.properties) {
      let content = ''
      const flattened = flattenObj(feature.properties, null)
      Object.keys(flattened).forEach((key) => {
        content = content.concat(`${key}: ${flattened[key]}<br>`)
      })
      if (feature.geometry.type === 'Point') {
        const position = { lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] }
        layer.bindPopup(content).bindTooltip(renderToString(<FormatCoordinate coords={position} format={latlonFormat} />))
      } else {
        layer.bindPopup(content)
      }
    }
  }

  const onEachFeatureGPX = (feature: geojson.Feature<geojson.GeometryObject, any>, layer: L.Layer) => {
    if (feature.geometry.type === 'Point') {
      const position = { lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] }
      const coords = renderToString(<FormatCoordinate coords={position} format={latlonFormat} />)
      layer.bindPopup(`${feature.properties.time}<br>${coords}<br>Elevation: ${feature.properties.elevation} m`).bindTooltip(feature.properties.time)
    }
  }

  const handleDrag = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
  };
  const readFile = (file: Blob, callback: (this: FileReader, ev: ProgressEvent<FileReader>) => any) => {
    const reader = new FileReader();
    reader.onload = callback
    reader.readAsText(file)
  }
  const styleFunc = (feature: geojson.Feature<geojson.Geometry, any> | undefined) => {
    const type = feature?.geometry.type
    const number = dropCount
    if (type === 'Point' || type === 'MultiPoint') {
      return {
        radius: 5,
        opacity: 1,
        color: '#000000',
        stroke: true,
        weight: 0.2,
        fillColor: colors[number % 10].value,//'#ffc16f',
        fillOpacity: 1,
      };
    } else {
      return {
        radius: 5,
        opacity: 1,
        color: colors[number % 10].value,//'#ff7070',
        stroke: true,
        weight: 2,
      }
    }
  }

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDropCount(dropCount + 1)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length).toLowerCase()
      const fileType = file.type ? file.type : extension
      switch (fileType) {
        case 'application/json':
          readFile(file, (res) => {
            const data = res?.target?.result
            if (typeof (data) === 'string') {
              const jsonLayer: DropGeoJSON = L.geoJSON(JSON.parse(data), {
                style: styleFunc,
                pointToLayer: pointToLayer,
                onEachFeature: onEachFeatureJSON,
              })
              jsonLayer.filename = file.name
              jsonLayer.addTo(map)
              map.fitBounds(jsonLayer.getBounds())
              setDataList([...dataList, jsonLayer])
            }
          })
          break
        case 'application/vnd.google-earth.kml+xml':
          readFile(file, (res) => {
            const data = res?.target?.result
            if (typeof (data) === 'string') {
              const customLayer = L.geoJSON(undefined, {
                style: styleFunc,
                pointToLayer: pointToLayer,
                onEachFeature: onEachFeatureKML
              });
              const kmlLayer = omnivore.kml.parse(data, null, customLayer)
              kmlLayer.filename = file.name
              kmlLayer.addTo(map)
              map.fitBounds(kmlLayer.getBounds())
              setDataList([...dataList, kmlLayer])
            }
          })
          break
        case 'gpx':
          readFile(file, (res) => {
            const data = res?.target?.result
            if (typeof (data) === 'string') {
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
                          "time": feature.properties.coordTimes[i]
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
                            "time": feature.properties.coordTimes[i][j]
                          }
                        })
                      })
                    })
                  }
                }
              });
              omnivore.gpx.parse(data, null, customLayer)
              const geojson: GeoJSON.FeatureCollection = {
                "type": "FeatureCollection",
                "features": pointFeatures,
              };
              const gpxLayer: DropGeoJSON = L.geoJSON(geojson, {
                style: styleFunc,
                pointToLayer: pointToLayer,
                onEachFeature: onEachFeatureGPX
              })
              gpxLayer.filename = file.name
              gpxLayer.addTo(map);
              map.fitBounds(gpxLayer.getBounds())
              setDataList([...dataList, gpxLayer])

            }
          })
          break
      }
    }
  };
  if (mapContainer) {
    mapContainer.ondrop = handleDrop
    mapContainer.ondragover = handleDrag //must for drop
  }

  const close = (index: number) => {
    map.removeLayer(dataList[index])
    setDataList(dataList.filter((data: any, i: number) => i !== index))
  }
  return (
    <>
      {dataList && dataList.map((data: any, index: number) =>
        <div
          key={`Drop-${index}`}
          className='leaflet-control leaflet-bar'
          tabIndex={-1}
          style={{
            backgroundColor: '#f3f6f4',
            float: "right",
            marginRight: 60,
          }}>
          <IconButton
            size="small"
            onClick={() => close(index)}>
            <Close />
            <span>{data.filename}</span>
          </IconButton>
        </div>
      )}
    </>
  )
}