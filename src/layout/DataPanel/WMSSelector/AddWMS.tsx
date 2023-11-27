import { useEffect, useMemo, useRef, useState } from "react"
import { LeafletEventHandlerFnMap } from 'leaflet'
import { TileLayerCanvas } from "../../../components/TileLayerCanvas"
import { WMSTileLayer } from "react-leaflet"
import { useSelector } from "react-redux"
import { RootState } from "store/store"

export const AddWMS = (props: { params: any, opacity?: number, eventHandlers?: LeafletEventHandlerFnMap }) => {
  const { params, opacity = 100, eventHandlers } = { ...props }
  const ref = useRef<any>()
  const datetime = useSelector((state: RootState) => state.map.datetime).split('.')[0] + 'Z';
  const time = params.time ? params.time : undefined
  const defaultUrl = time ? `${params.url}?TIME=${time}` : params.url
  const [url, setUrl] = useState(defaultUrl) //NASA GIBS不接受%3A在時間內

  const parameters = {
    layers: params.layer,
    crossOrigin: 'anonymous',
    transparent: true,
    format: 'image/png',
    uppercase: true,
  }

  useEffect(() => {
    time && setUrl(`${params.url}?TIME=${datetime}`)
  }, [datetime, time])

  useEffect(() => {
    ref.current.setOpacity(opacity / 100)
  }, [opacity])

  return (
    <TileLayerCanvas
      ref={ref}
      key={params.layer + time}
      type={params.service}
      url={url}
      eventHandlers={eventHandlers}
      params={parameters}
    />
  )
}