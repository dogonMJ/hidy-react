import { useEffect, useRef } from "react"
import { LeafletEventHandlerFnMap } from 'leaflet'
import { TileLayer } from "react-leaflet"
import { useAppSelector } from "hooks/reduxHooks"

export const AddWMTS = (props: { params: any, opacity?: number, eventHandlers?: LeafletEventHandlerFnMap }) => {
  const { params, opacity = 100, eventHandlers } = { ...props }
  const datetime = useAppSelector(state => state.map.datetime).split('.')[0] + 'Z';
  const ref = useRef<any>()
  let template = params.template ? params.template : ''
  template = template.replace(/{tilematrixSet}/i, params.TileMatrixSet[0])
  template = template.replace(/{tilematrix}/i, '{z}')
  template = template.replace(/{tilecol}/i, '{x}')
  template = template.replace(/{tilerow}/i, '{y}')
  template = template.replace(/{time}/i, datetime)
  template = template.replace(/{style}/i, params.style)
  template = template.replace(/http:/i, 'https:')
  template = template.includes('?') ? `${template}&TIME=${datetime}` : template
  useEffect(() => {
    ref.current.setOpacity(opacity / 100)
  })
  return (
    <TileLayer
      ref={ref}
      key={params.layer + datetime}
      url={template}
      crossOrigin='anonymous'
      eventHandlers={eventHandlers}
    />
  )
}