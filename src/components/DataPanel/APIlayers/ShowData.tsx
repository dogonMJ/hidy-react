import { useState } from "react";
import { useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { coor } from 'types';
import DataToolTip from "components/DataToolTip"
import seaSurfTempColor from './GHRSST_Sea_Surface_Temperature.json'
import seaSurfTempAnoColor from './GHRSST_Sea_Surface_Temperature_Anomalies.json'


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

const ShowData = (props: { layergroup: L.LayerGroup | null, layerId: number | null, identifier: string }) => {
  const map: any = useMap()
  const [bartip, setBartip] = useState<string | undefined>()
  const [position, setPosition] = useState<coor>({ lat: 0, lng: 0 })
  let colorBar: any;
  let unit: string = '';
  switch (props.identifier) {
    case "GHRSST_L4_MUR_Sea_Surface_Temperature":
      colorBar = seaSurfTempColor
      unit = '\u00B0C'
      break;
    case "GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies":
      colorBar = seaSurfTempAnoColor
      unit = '\u00B0C'
      break;
    default: colorBar = null
      break;
  }

  useMapEvents({
    mousedown: (e) => {
      if (colorBar) {
        const pixelRGB = getPixelColor(map, e.latlng, props.layergroup, props.layerId)
        const pixelColor = rgbaToHex(pixelRGB[0], pixelRGB[1], pixelRGB[2])
        const barColor = colorBar.maps[0].entries.colors
        const bartips = colorBar.maps[0].legend.tooltips
        const index = barColor.indexOf(pixelColor)
        setBartip(bartips[index])
      }
      setPosition(e.latlng)
    }
  })

  return (
    <>
      {bartip && <DataToolTip position={position} content={`${bartip} ${unit}`} />}
    </>
  )
}

export default ShowData