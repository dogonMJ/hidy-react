import { useEffect, useRef } from "react"
import { LeafletEventHandlerFnMap } from 'leaflet'
import { TileLayer } from "react-leaflet"

export const AddWMTS = (props: { time: string, params: any, opacity: number, eventHandlers?: LeafletEventHandlerFnMap }) => {

  const { time, params, opacity, eventHandlers } = { ...props }
  const ref = useRef<any>()

  let template = params.template ? params.template : ''
  template = template.replace(/{tilematrixSet}/i, params.TileMatrixSet)
  template = template.replace(/{tilematrix}/i, '{z}')
  template = template.replace(/{tilecol}/i, '{x}')
  template = template.replace(/{tilerow}/i, '{y}')
  template = template.replace(/{time}/i, time)
  template = template.replace(/{style}/i, 'default')

  useEffect(() => {
    ref.current.setOpacity(opacity / 100)
  })

  return (
    <TileLayer
      ref={ref}
      key={params.layer + time}
      url={template}
      crossOrigin='anonymous'
      eventHandlers={eventHandlers}
    />
  )
}