import { useState } from "react"
import { useMapEvents } from 'react-leaflet'
import { useTranslation } from "react-i18next";
import DataToolTip from "components/DataToolTip"
import { coor } from 'types';

const calIndex = (position: coor, bounds: number[][], resolution: number) => {
  const lowLat = bounds[0][0]
  const lowLon = bounds[0][1]
  const upLat = bounds[1][0]
  const upLon = bounds[1][1]
  if (position.lng >= lowLon && position.lng <= upLon && position.lat >= lowLat && position.lat <= upLat) {
    const lenY = 1 + ((upLat - resolution / 2) - (lowLat + resolution / 2)) / resolution
    const x = Math.ceil((position.lng - lowLon) * (1 / resolution))
    const y = Math.ceil((position.lat - lowLat) * (1 / resolution))
    return (x - 1) * lenY + y - 1
  } else {
    return null
  }
}
const isNumber = (data: any, digit: number) => isNaN(data) ? data : data.toFixed(digit)

export const ShowCwbForecast = (props: { data: any, bounds: number[][] }) => {
  const { t } = useTranslation()
  const [position, setPosition] = useState<coor>({ lat: 0, lng: 0 })
  const [content, setContent] = useState<string>()
  useMapEvents({
    mousedown: (e) => {
      setPosition(e.latlng)
      const index = calIndex(e.latlng, props.bounds, 0.1)
      if (index) {
        const rawData = props.data.data[index]
        setContent(
          `${t('CwbSeaForecast.lat')}: ${rawData[0]}
          ${t('CwbSeaForecast.lon')}: ${rawData[1]}
          ${t('CwbSeaForecast.sst')}: ${isNumber(rawData[2], 3)}
          ${t('CwbSeaForecast.sal')}: ${isNumber(rawData[8], 2)}
          ${t('CwbSeaForecast.ssh')}: ${isNumber(rawData[7], 3)}
          ${t('CwbSeaForecast.dir')}: ${isNumber(rawData[6], 2)}
          ${t('CwbSeaForecast.spd')}: ${isNumber(rawData[5], 4)}
          ${t('CwbSeaForecast.east')}: ${isNumber(rawData[3], 4)}
          ${t('CwbSeaForecast.north')}: ${isNumber(rawData[4], 4)}
        `
        )
      } else {
        setContent('')
      }
    }
  })
  return (
    <DataToolTip position={position} content={content} />
  )
}
