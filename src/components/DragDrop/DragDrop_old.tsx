import { useState } from "react"
import L, { LatLng } from 'leaflet';
import { GeoJSON, useMap } from "react-leaflet"
import { coor } from "types";
import { GeoJsonTooltip } from "components/GeoJsonTooltip";
import { IconButton } from "@mui/material";
import Close from "@mui/icons-material/Close";
import * as geojson from 'geojson';
//@ts-ignore
import omnivore from '@mapbox/leaflet-omnivore'
//@ts-ignore
import 'leaflet-kmz'
import ReactLeafletKml from 'react-leaflet-kml'
import FormatCoordinate from "components/FormatCoordinate";

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
  const [position, setPosition] = useState<coor | null>(null)
  const [content, setContent] = useState('')
  const [kml, setKML] = useState<Document>()
  const mapContainer = document.getElementById('mapContainer')

  const pointToLayer = (feature: geojson.Feature<geojson.Point, any>, latlang: LatLng) => {
    return new L.CircleMarker(latlang)
  }
  const onEachFeature = (feature: geojson.Feature<geojson.GeometryObject, any>, layer: L.Layer) => {
    if (feature.properties.description) {
      layer.bindPopup(`${feature.properties.name}<br>${feature.properties.description}`).bindTooltip(feature.properties.name)
    } else {
      layer.bindPopup(feature.properties.name).bindTooltip(feature.properties.name)
    }
  }

  const styleFunc = (featureType: string | undefined, index: number) => {
    const colorList = ['#ff7070', '#ffc16f', '#fff69e', '#b6d8b0', '#8da2bc']
    switch (featureType) {
      case 'LineString':
      case 'MultiLineString':
        return {
          radius: 5,
          opacity: 1,
          color: colorList[index % colorList.length],
          stroke: true,
          weight: 2,
        }
      default:
        return {
          radius: 5,
          opacity: 1,
          color: '#000000',
          stroke: true,
          weight: 0.2,
          fillColor: colorList[index % colorList.length],
          fillOpacity: 1,
        }
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

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const fileType = file.type
      console.log(fileType)
      switch (fileType) {
        case 'application/json':
          readFile(file, (res) => {
            const data = res?.target?.result
            if (typeof (data) === 'string') {
              const temp = JSON.parse(data)
              temp.filename = file.name
              dataList.push(temp)
              setDataList([...dataList])
            }
          })
          break
        case 'application/vnd.google-earth.kml+xml':
          readFile(file, (res) => {
            const data = res?.target?.result
            if (typeof (data) === 'string') {
              const customLayer = L.geoJSON(undefined, {
                style: function (feature) {
                  if (feature?.geometry.type === 'Point') {
                    return {
                      radius: 5,
                      opacity: 1,
                      color: '#000000',
                      stroke: true,
                      weight: 0.2,
                      fillColor: '#ffc16f',
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
                },
                pointToLayer: pointToLayer,
                onEachFeature: onEachFeature
              });
              omnivore.kml.parse(data, null, customLayer).addTo(map)
              // setKML(kml)
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
    setDataList(dataList.filter((data: any, i: number) => i !== index))
  }

  const mouseOver = (e: any) => {
    const feature = e.layer.feature
    let content = ""
    if (feature) {
      if (feature.geometry.type === 'Point') {
        setPosition({ lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] })
      } else {
        setPosition(null)
      }
      if (feature.properties) {
        const flattened = flattenObj(feature.properties, null)
        Object.keys(flattened).forEach((key) => {
          content = content.concat(`${key}: ${flattened[key]}\n`)
        })
        setContent(content)
      } else {
        setContent('')
      }
    } else {
      //multipoint
      setPosition(null)
      setContent('')
    }
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
          <GeoJSON
            key={`${data.filename}${index}`}
            data={data}
            style={(feature) => styleFunc(feature?.geometry.type, index)}
            pointToLayer={pointToLayer}
            eventHandlers={{ mouseover: mouseOver }}
          >
            <GeoJsonTooltip position={position} content={content} />
          </GeoJSON>
        </div>
      )}
    </div>
  )
}