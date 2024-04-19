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
    const lenX = 1 + ((upLon - resolution / 2) - (lowLon + resolution / 2)) / resolution
    const x = Math.ceil((position.lng - lowLon) * (1 / resolution))
    const y = Math.ceil((position.lat - lowLat) * (1 / resolution))
    return x - 1 + (y - 1) * lenX
  } else {
    return null
  }
}
const isNumber = (data: any, digit: number) => isNaN(data) ? data : data.toFixed(digit)

export const ShowCwaForecast = (props: { data: any, bounds: number[][] }) => {
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
          `${t('CwaSeaForecast.lat')}: ${rawData[0]}
          ${t('CwaSeaForecast.lon')}: ${rawData[1]}
          ${t('CwaSeaForecast.sst')}: ${isNumber(rawData[2], 3)}
          ${t('CwaSeaForecast.sal')}: ${isNumber(rawData[8], 2)}
          ${t('CwaSeaForecast.ssh')}: ${isNumber(rawData[7], 3)}
          ${t('CwaSeaForecast.dir')}: ${isNumber(rawData[6], 2)}
          ${t('CwaSeaForecast.spd')}: ${isNumber(rawData[5], 4)}
          ${t('CwaSeaForecast.east')}: ${isNumber(rawData[3], 4)}
          ${t('CwaSeaForecast.north')}: ${isNumber(rawData[4], 4)}
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