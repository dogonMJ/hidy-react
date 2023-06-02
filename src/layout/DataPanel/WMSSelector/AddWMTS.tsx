import { useEffect, useRef } from "react"
import { LeafletEventHandlerFnMap } from 'leaflet'
import { TileLayer } from "react-leaflet"

export const AddWMTS = (props: { params: any, opacity?: number, eventHandlers?: LeafletEventHandlerFnMap }) => {

  const { params, opacity = 100, eventHandlers } = { ...props }
  const ref = useRef<any>()
  let template = params.template ? params.template : ''
  template = template.replace(/{tilematrixSet}/i, params.TileMatrixSet)
  template = template.replace(/{tilematrix}/i, '{z}')
  template = template.replace(/{tilecol}/i, '{x}')
  template = template.replace(/{tilerow}/i, '{y}')
  template = template.replace(/{time}/i, params.time)
  template = template.replace(/{style}/i, params.style)

  useEffect(() => {
    ref.current.setOpacity(opacity / 100)
  })
  return (
    <TileLayer
      ref={ref}
      key={params.layer + params.time}
      url={template}
      crossOrigin='anonymous'
      eventHandlers={eventHandlers}
    />
  )
}