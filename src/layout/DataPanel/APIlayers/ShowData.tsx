import React, { useState } from "react"
import { useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { coor } from 'types';
import DataToolTip from "components/DataToolTip"
import seaSurfTempColor from 'assets/jsons/GHRSST_Sea_Surface_Temperature.json'
import seaSurfTempAnoColor from 'assets/jsons/GHRSST_Sea_Surface_Temperature_Anomalies.json'
import { Api } from 'types'
import { NasaColors } from 'types/typeColorBars'

interface extendMouseEvent extends MouseEvent {
  toElement: HTMLElement;
}

interface ColorBars {
  [key: string]: NasaColors
}
const colorBars: ColorBars = {
  "seaSurfTempAnoColor": seaSurfTempAnoColor,
  "seaSurfTempColor": seaSurfTempColor
}
const getTileXYZ = (lat: number, lon: number, zoom: number) => {
  const xtile = Math.floor((lon + 180) / 360 * (1 << zoom));
  const ytile = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * (1 << zoom));
  return `${xtile}:${ytile}:${zoom}`;
}

const rgbaToHex = (r: number, g: number, b: number) => {
  const hex = (c: number) => {
    const strHex = c.toString(16);
    return strHex.length === 1 ? `0${strHex}` : strHex;
  }
  return `${hex(r) + hex(g) + hex(b)}ff`;
};

const getPixelColor = (map: L.Map, latlng: L.LatLng, layerGroup: any, layerId: number | null) => {
  const zoom = map.getZoom()
  const xyz = getTileXYZ(latlng.lat, latlng.lng, zoom)
  const layer = layerGroup.getLayer(layerId)
  const levelOrigin = layer._levels[zoom].origin
  const mapOrigin = map.getPixelOrigin()
  const leafletPos = layer._tiles[xyz].el._leaflet_pos
  const tilePos = map.layerPointToContainerPoint(leafletPos)
  const pointerPos = map.latLngToContainerPoint(latlng)
  const pointerX = pointerPos.x - tilePos.x - (levelOrigin.x - mapOrigin.x)
  const pointerY = pointerPos.y - tilePos.y - (levelOrigin.y - mapOrigin.y)
  const ctx = layer._tiles[xyz].el.getContext('2d')
  const imgData = ctx.getImageData(pointerX, pointerY, 1, 1).data;
  // ctx.fillStyle = "red";
  // ctx.fillRect(pointerX, pointerY, 1, 1);
  return imgData
}

/* NASA GIBS doesn't support GetFeatureInfo */
const getNASAData = (map: any, latlng: L.LatLng, layergroup: L.LayerGroup | null, layerId: number | null, colorBar: any) => {
  const pixelRGB = getPixelColor(map, latlng, layergroup, layerId)
  const pixelColor = rgbaToHex(pixelRGB[0], pixelRGB[1], pixelRGB[2])
  const barColor = colorBar.maps[0].entries.colors
  const bartips = colorBar.maps[0].legend.tooltips
  const index = barColor.indexOf(pixelColor)
  return bartips[index]
}

const getWMSData = async (
  baseUrl: string,
  latlng: L.LatLng,
  datetime: string,
  identifier: string,
  elevation: number, setBartip: React.Dispatch<React.SetStateAction<string | null | undefined>>,
) => {
  const bbox = `${latlng.lat - 0.02},${latlng.lng - 0.02},${latlng.lat + 0.02},${latlng.lng + 0.02}`
  const param = new URLSearchParams({
    request: 'GetFeatureInfo',
    service: 'WMS',
    version: '1.3.0',
    layers: identifier,
    crs: 'EPSG:4326',
    styles: "boxfill/rainbow",
    bbox: bbox, //'13462700.917811524,2504688.542848655,13775786.985667607,2817774.6107047372',
    width: '101',
    height: '101',
    query_layers: identifier,
    i: '50',
    j: '50',
    info_format: 'text/xml',
    time: datetime,
    elevation: elevation.toString()
  })
  fetch(`${baseUrl}?${param.toString()}`)
    .then((response) => response.text())
    .then((text) => (new window.DOMParser()).parseFromString(text, "text/xml").documentElement)
    .then((doc) => {
      return doc.getElementsByTagName('value')[0].childNodes[0].nodeValue
    })
    .then((value) => {
      setBartip(value)
    })
    .catch((err) => {
      console.log(err)
    })
}
const ShowData = (props: {
  layergroup: L.LayerGroup | null,
  layerId: number | null,
  identifier: string,
  datetime: string,
  elevation: number,
  param: Api
}) => {
  const map: any = useMap()
  const [bartip, setBartip] = useState<string | undefined | null>()
  const [position, setPosition] = useState<coor>({ lat: 0, lng: 0 })
  const [unit, setUnit] = useState<string>('')
  useMapEvents({
    mousedown: (e) => {
      setPosition(e.latlng)
      const originalEvent = e.originalEvent as extendMouseEvent
      if (originalEvent.toElement.innerHTML === "Close" || originalEvent.toElement.innerHTML === "關閉") {
        props.param.type = ''
        // prevent memory leak
      }
      switch (props.param.type) {
        case 'wms':
          setUnit(props.param.unit)
          getWMSData(props.param.url, e.latlng, props.datetime, props.param.layer, props.elevation, setBartip)
          break;
        case 'wmts':
          if (props.param.colorBar) {
            const colorBar = colorBars[props.param.colorBar]
            const value = getNASAData(map, e.latlng, props.layergroup, props.layerId, colorBar)
            setBartip(value)
          } else {
            setBartip('')
          }
          setUnit(props.param.unit)
          break;
        default:
          setUnit('')
          setBartip('')
          break;
      }
    }
  })

  return (
    <>
      <DataToolTip position={position} content={`${bartip} ${unit}`} />
    </>
  )
}

export default ShowData