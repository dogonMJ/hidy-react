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
  Identifier: string;
  Time: string;
  cache: any;
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
}
interface TileProp {
  url: Api['url']
  params: Params,
  type: Api['type']
}

const timeDuration = (time: string, duration: string) => {
  if (duration === 'P1D') {
    return time.split('T')[0]
  } else if (duration === 'PT10M') {
    return time.substring(0, 15) + "0:00Z"
  } else {
    return time
  }
}

const procProps = (api: Api, time: string, key: string): [string, Params] => {
  let url;
  let params;
  if (api.type === 'wmts') {
    url = `${api.url}/${api.identifier}/${api.style}/${time}/${api.tileMatrixSet}/{z}/{y}/{x}.${api.formatExt}`
    params = {
      key: key,
      crossOrigin: api.crossOrigin,
      opacity: 0,
    }
  } else {
    url = api.url
    params = {
      key: key,
      crossOrigin: api.crossOrigin,
      layers: api.identifier,
      styles: api.style,
      format: api.format,
      time: time + 'T00:00:00.000Z',
      transparent: api.transparent,
    }
  }
  return [url, params]
}

const tileProps: TileProp[] = []
const ProcWMS = (props: Urls) => {
  const ref = useRef<L.LayerGroup>(null)
  const [layerId, setLayerId] = useState<number | null>(null)
  const api: Api = wmsList[props.Identifier as keyof typeof wmsList]
  const time = timeDuration(props.Time, api.duration)
  const key = api.identifier + time
  const [currentUrl, params] = procProps(api, time, key)
  const currentProps: TileProp = {
    url: currentUrl,
    params: params,
    type: api.type
  }

  if (!tileProps.some((e: TileProp) => e.params.key === key)) {
    tileProps.push(currentProps)
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
      <ShowData layergroup={ref.current} layerId={layerId} identifier={props.Identifier} />
    </>
  )
}
export default ProcWMS