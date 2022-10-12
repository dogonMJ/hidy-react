import { useState } from "react"
import L, { LatLng } from 'leaflet';
import { useMap } from "react-leaflet"
import { coor } from "types";
import { IconButton } from "@mui/material";
import Close from "@mui/icons-material/Close";
import * as geojson from 'geojson';
import { renderToString } from "react-dom/server";
import FormatCoordinate from "components/FormatCoordinate";
//@ts-ignore
import omnivore from '@mapbox/leaflet-omnivore'
//@ts-ignore
import { useSelector } from "react-redux";
import { RootState } from "store/store"


interface DropGeoJSON extends L.GeoJSON {
  filename?: string
}

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
  const latlonFormat = useSelector((state: RootState) => state.coordInput.latlonformat)
  const mapContainer = document.getElementById('mapContainer')

  const pointToLayer = (feature: geojson.Feature<geojson.Point, any>, latlang: LatLng) => {
    return new L.CircleMarker(latlang)
  }
  const onEachFeatureKML = (feature: geojson.Feature<geojson.GeometryObject, any>, layer: L.Layer) => {
    if (feature.properties.description) {
      layer.bindPopup(`${feature.properties.name}<br>${feature.properties.description}`).bindTooltip(feature.properties.name)
    } else {
      layer.bindPopup(feature.properties.name).bindTooltip(feature.properties.name)
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
    const colors = ['#ff41e4', '#ff9c1c', '#ffec6d', '#05ecf5', '#a766ff']
    if (type === 'Point' || type === 'MultiPoint') {
      return {
        radius: 5,
        opacity: 1,
        color: '#000000',
        stroke: true,
        weight: 0.2,
        fillColor: colors[number % 5],//'#ffc16f',
        fillOpacity: 1,
      };
    } else {
      return {
        radius: 5,
        opacity: 1,
        color: '#ff7070',
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
    <div>
      {dataList && dataList.map((data: any, index: number) =>
        <div key={`Drop-${index}`}>
          <div className='leaflet-control leaflet-bar' tabIndex={-1} style={{ backgroundColor: '#f3f6f4' }}>
            <IconButton
              size="small"
              onClick={() => close(index)}>
              <Close />
              <span>{data.filename}</span>
            </IconButton>
          </div>
        </div>
      )}
    </div>
  )
}