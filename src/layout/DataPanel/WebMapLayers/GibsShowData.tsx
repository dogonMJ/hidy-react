import { useState } from "react"
import { useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { coor } from 'types';
import DataToolTip from "components/DataToolTip"
import seaSurfTempColor from 'assets/jsons/GHRSST_Sea_Surface_Temperature.json'
import seaSurfTempAnoColor from 'assets/jsons/GHRSST_Sea_Surface_Temperature_Anomalies.json'
import { NasaColors } from 'types/typeColorBars'
import { RenderIf } from "components/RenderIf/RenderIf";

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

const getPixelColor = (map: L.Map, latlng: L.LatLng, layer: any) => {
  const zoom = map.getZoom()
  const xyz = getTileXYZ(latlng.lat, latlng.lng, zoom)
  const levelOrigin = layer._levels[zoom].origin
  const mapOrigin = map.getPixelOrigin()
  const leafletPos = layer._tiles[xyz].el._leaflet_pos
  const tilePos = map.layerPointToContainerPoint(leafletPos)
  const pointerPos = map.latLngToContainerPoint(latlng)
  const pointerX = pointerPos.x - tilePos.x - (levelOrigin.x - mapOrigin.x)
  const pointerY = pointerPos.y - tilePos.y - (levelOrigin.y - mapOrigin.y)
  const ctx = layer._tiles[xyz].el.getContext('2d', { willReadFrequently: true })
  const imgData = ctx.getImageData(pointerX, pointerY, 1, 1).data;
  return imgData
}

/* NASA GIBS doesn't support GetFeatureInfo */
const getNASAData = (map: any, latlng: L.LatLng, layer: any, colorBar: any) => {
  const pixelRGB = getPixelColor(map, latlng, layer)
  const pixelColor = rgbaToHex(pixelRGB[0], pixelRGB[1], pixelRGB[2])
  const barColor = colorBar.maps[0].entries.colors
  const bartips = colorBar.maps[0].legend.tooltips
  const index = barColor.indexOf(pixelColor)
  return bartips[index]
}

export const GibsShowData = (props: {
  layer: any,
  colorbar: string | undefined
  unit: string | undefined
}) => {
  const map: any = useMap()
  const [bartip, setBartip] = useState<string | undefined | null>()
  const [position, setPosition] = useState<coor>({ lat: 0, lng: 0 })
  const [unit, setUnit] = useState<string>('')
  useMapEvents({
    mousedown: (e) => {
      setPosition(e.latlng)
      const target = e.originalEvent.target as Element
      if (target.innerHTML === "Close" || target.innerHTML === "關閉") {
        return
      }
      if (props.layer && props.colorbar) {
        const colorBar = colorBars[props.colorbar]
        const value = getNASAData(map, e.latlng, props.layer, colorBar)
        setBartip(value)
        setUnit(props.unit ? props.unit : '')
      } else {
        setBartip('')
        setUnit('')
      }
    }
  })

  return (
    <>
      <RenderIf isTrue={props.layer && props.colorbar}>
        <DataToolTip position={position} content={`${bartip} ${unit}`} />
      </RenderIf>
    </>
  )
}