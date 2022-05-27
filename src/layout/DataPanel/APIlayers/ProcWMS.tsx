import { useEffect, useRef, useState } from "react";
import { LayerGroup } from 'react-leaflet'
import L from 'leaflet'
import wmsList from 'assets/jsons/WMSList.json'
import { TileLayerCanvas } from './TileLayerCanvas'
import ShowData from './ShowData'

/*
PROCESS NASA GIBS URL
WMS Capabilities:
https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0
*/
interface Urls {
  Identifier: string
  Time: string
  cache: any
  elevation: number
}
interface Api {
  type: string
  url: string
  identifier: string
  duration: string
  style?: string
  format?: string
  transparent?: boolean
  crossOrigin?: string
  tileMatrixSet?: string
  formatExt?: string
  elevation?: number
}
interface Params {
  key: string
  crossOrigin?: Api['crossOrigin']
  opacity?: number
  layers?: Api['identifier']
  styles?: Api['style']
  format?: Api['format']
  transparent?: Api['transparent']
  time?: string
  elevation?: number
}
interface TileProp {
  url: Api['url']
  params: Params,
  type: Api['type']
}

const roundHour = (hour: string) => {
  const remainder = Number(hour) % 6
  return remainder === 0 ? hour : (Number(hour) - remainder).toString().padStart(2, '0')
}

const timeDuration = (time: string, duration: string) => {
  switch (duration) {
    case 'P1D':
      return time.split('T')[0]
    case 'PT10M':
      return time.substring(0, 15) + "0:00Z"
    case 'P6H':
      const date = new Date(time)
      const hour = date.getHours().toString().padStart(2, '0')
      const HH = roundHour(hour)
      return `${time.split('T')[0]}T${HH}`
    default:
      return time
  }
}

const propsWMTS = (api: Api, time: string, key: string) => {
  return {
    type: api.type,
    url: `${api.url}/${api.identifier}/${api.style}/${time}/${api.tileMatrixSet}/{z}/{y}/{x}.${api.formatExt}`,
    params: {
      key: key,
      crossOrigin: api.crossOrigin,
      opacity: 0,
    },
  }
}
const propsWMS = (api: Api, time: string, key: string, elevation: number) => {
  return {
    type: api.type,
    url: api.url,
    params: {
      time: time,
      key: key,
      elevation: elevation,
      crossOrigin: api.crossOrigin,
      layers: api.identifier,
      styles: api.style,
      format: api.format,
      transparent: api.transparent,
    },
  }
}

const notTileCached = (tileProps: TileProp[], key: string) => !tileProps.some((tile: TileProp) => tile.params.key === key)

const tileProps: TileProp[] = []
const ProcWMS = (props: Urls) => {
  const ref = useRef<L.LayerGroup>(null)
  const [layerId, setLayerId] = useState<number | null>(null)

  const api: Api = wmsList[props.Identifier as keyof typeof wmsList]
  const time = timeDuration(props.Time, api.duration)
  const key = api.identifier + time + props.elevation
  if (notTileCached(tileProps, key)) {
    switch (api.type) {
      case 'wms':
        tileProps.push(propsWMS(api, time, key, props.elevation))
        break;
      case 'wmts':
        tileProps.push(propsWMTS(api, time, key))
        break;
    }
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.eachLayer((layer: any) => {
        if (layer.options.key === key && ref.current) {
          setLayerId(ref.current.getLayerId(layer))
          layer.setOpacity(1)
        } else {
          layer.setOpacity(0)
        }
      })
    }

  });

  return (
    <>
      <LayerGroup ref={ref}>
        {tileProps.map((tileProp: TileProp) => {
          return <TileLayerCanvas key={tileProp.params.key} type={tileProp.type} url={tileProp.url} params={tileProp.params} />
        })}
      </LayerGroup>
      <ShowData layergroup={ref.current} layerId={layerId} identifier={api.identifier} datetime={time} elevation={props.elevation} />
    </>
  )
}
export default ProcWMS