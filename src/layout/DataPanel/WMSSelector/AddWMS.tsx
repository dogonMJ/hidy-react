import { useEffect, useRef } from "react"
import { LeafletEventHandlerFnMap } from 'leaflet'
import { TileLayerCanvas } from "../../../components/TileLayerCanvas"
export const AddWMS = (props: { params: any, opacity?: number, eventHandlers?: LeafletEventHandlerFnMap }) => {
  const { params, opacity = 100, eventHandlers } = { ...props }
  const ref = useRef<any>()
  const time = params.time ? params.time : ''
  useEffect(() => {
    ref.current.setOpacity(opacity / 100)
  })
  return (
    <TileLayerCanvas
      ref={ref}
      key={params.layer + time}
      type={params.service}
      url={params.url}
      eventHandlers={eventHandlers}
      params={{
        layers: params.layer,
        crossOrigin: 'anonymous',
        transparent: true,
        format: 'image/png',
        time: time,
        uppercase: true
      }} />
  )
}