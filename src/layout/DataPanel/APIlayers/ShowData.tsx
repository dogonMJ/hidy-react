import React, { useState } from "react"
import { useMap, useMapEvents } from 'react-leaflet'
import { useSelector } from "react-redux"
import { RootState } from "store/store"
import L from 'leaflet'
import { coor } from 'types';
import DataToolTip from "components/DataToolTip"
import seaSurfTempColor from 'assets/jsons/GHRSST_Sea_Surface_Temperature.json'
import seaSurfTempAnoColor from 'assets/jsons/GHRSST_Sea_Surface_Temperature_Anomalies.json'
import { RenderIf } from "components/RenderIf/RenderIf"

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
const getNASAData = (map: any, latlng: L.LatLng, layergroup: L.LayerGroup | null, layerId: number | null, colorBar: any, setBartip: React.Dispatch<React.SetStateAction<string | null | undefined>>) => {
  const pixelRGB = getPixelColor(map, latlng, layergroup, layerId)
  const pixelColor = rgbaToHex(pixelRGB[0], pixelRGB[1], pixelRGB[2])
  const barColor = colorBar.maps[0].entries.colors
  const bartips = colorBar.maps[0].legend.tooltips
  const index = barColor.indexOf(pixelColor)
  setBartip(bartips[index])
}

const getWMSData = async (baseUrl: string, latlng: L.LatLng, datetime: string, identifier: string, setBartip: React.Dispatch<React.SetStateAction<string | null | undefined>>) => {
  const bbox = `${latlng.lat - 0.02},${latlng.lng - 0.02},${latlng.lat + 0.02},${latlng.lng + 0.02}`
  const imgTime = datetime.split('T')[0] + 'T00:00:00.000Z'
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
    time: imgTime
  })
  await fetch(baseUrl + param.toString())
    .then((response) => response.text())
    .then((text) => (new window.DOMParser()).parseFromString(text, "text/xml").documentElement)
    .then((doc) => {
      return doc.getElementsByTagName('value')[0].childNodes[0].nodeValue
    })
    .then((value) => {
      setBartip(value)
    })
}
const ShowData = (props: { layergroup: L.LayerGroup | null, layerId: number | null, identifier: string }) => {
  const map: any = useMap()
  const [bartip, setBartip] = useState<string | undefined | null>()
  const [position, setPosition] = useState<coor>({ lat: 0, lng: 0 })
  const [unit, setUnit] = useState<string>('')
  const datetime = useSelector((state: RootState) => state.coordInput.datetime);
  let colorBar: any;
  let baseUrl: string;
  useMapEvents({
    mousedown: (e) => {
      setPosition(e.latlng)
      switch (props.identifier) {
        case "GHRSST_L4_MUR_Sea_Surface_Temperature":
          colorBar = seaSurfTempColor
          setUnit('\u00B0C')
          getNASAData(map, e.latlng, props.layergroup, props.layerId, colorBar, setBartip)
          break;
        case "GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies":
          colorBar = seaSurfTempAnoColor
          setUnit('\u00B0C')
          getNASAData(map, e.latlng, props.layergroup, props.layerId, colorBar, setBartip)
          break;
        case 'sla':
        case 'adt':
          setUnit('m')
          baseUrl = "https://nrt.cmems-du.eu/thredds/wms/dataset-duacs-nrt-global-merged-allsat-phy-l4?"
          getWMSData(baseUrl, e.latlng, datetime, props.identifier, setBartip)
          break
        case 'CHL':
          setUnit('mg/m\u00B2')
          baseUrl = "https://nrt.cmems-du.eu/thredds/wms/dataset-oc-glo-bio-multi-l4-chl_interpolated_4km_daily-rt?"
          getWMSData(baseUrl, e.latlng, datetime, props.identifier, setBartip)
          break
        default: colorBar = null
          break;
      }
    }
  })

  return (
    <>
      <RenderIf isTrue={bartip}>
        <DataToolTip position={position} content={`${bartip} ${unit}`} />
      </RenderIf>
      {/* {bartip && <DataToolTip position={position} content={`${bartip} ${unit}`} />} */}
    </>
  )
}

export default ShowData