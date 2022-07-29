import { useEffect, useRef, useState } from "react";
import { LayerGroup } from 'react-leaflet'
import L from 'leaflet'
import wmsList from 'assets/jsons/WMSList.json'
import { TileLayerCanvas } from './TileLayerCanvas'
import ShowData from './ShowData'
import { Api } from 'types'
import { RenderIf } from "components/RenderIf/RenderIf";
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

interface Params {
  key: string
  crossOrigin?: Api['crossOrigin']
  opacity?: number
  layers?: Api['layer']
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

const round6Hour = (hour: string) => {
  const remainder = Number(hour) % 6
  return remainder === 0 ? hour : (Number(hour) - remainder).toString().padStart(2, '0')
}

const timeDuration = (time: string, duration: string) => {

  switch (duration) {
    case 'P1D':
      return time.split('T')[0]
    case 'P1D12':
      return `${time.split('T')[0]}T12:00:00Z`
    case 'PT10M':
      return time.substring(0, 15) + "0:00Z"
    case 'P6H': {
      const hour = time.substring(11, 13).padStart(2, '0')
      const HH = round6Hour(hour)
      return `${time.split('T')[0]}T${HH}:00:00Z`
    }
    case 'P1H30': {
      const HH = time.substring(11, 13).padStart(2, '0')
      return `${time.split('T')[0]}T${HH}:30:00Z`
    }
    default:
      return time
  }
}

const propsWMTS = (api: Api, time: string, key: string) => {
  return {
    type: api.type,
    url: `${api.url}/${api.layer}/${api.style}/${time}/${api.tileMatrixSet}/{z}/{y}/{x}.${api.formatExt}`,
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
      layers: api.layer,
      styles: api.style,
      format: api.format,
      transparent: api.transparent,
    },
  }
}

const noTileCached = (tileProps: TileProp[], key: string) => !tileProps.some((tile: TileProp) => tile.params.key === key)
const checkTime = (url: string, time: string) => fetch(url)
  .then((response) => response.text())
  .then((text) => new window.DOMParser().parseFromString(text, "text/xml"))
  .then((xml) => xml.getElementsByName("time")[0].childNodes[0].nodeValue)
  .then((str) => {
    if (str) {
      const tileTime = str.replace(/\s/g, '').split('/')
      const startTime = Date.parse(tileTime[0])
      const lastTime = Date.parse(tileTime[1])
      const currentTime = Date.parse(time)
      if (currentTime < lastTime && currentTime > startTime) {
        return true
      }
    }
    return false
  })
  .catch(() => false)

const tileProps: TileProp[] = []
const ProcWMS = (props: Urls) => {
  const ref = useRef<L.LayerGroup>(null)
  const [layerId, setLayerId] = useState<number | null>(null)
  const [tileExist, setTileExist] = useState(false)
  const api: Api = wmsList[props.Identifier as keyof typeof wmsList]
  const time = timeDuration(props.Time, api.duration)
  const key = api.layer + time + props.elevation

  const checkTile = async (url: string, layer: string) => {
    const getCapabilities = `${url}?service=WMS&request=GetCapabilities&layers=${layer}`
    const exist = await checkTime(getCapabilities, time)
    return exist
  }
  if (noTileCached(tileProps, key)) {
    switch (api.type) {
      case 'wms':
        checkTile(api.url, api.layer).then((exist) => setTileExist(exist))
        if (tileExist) {
          tileProps.push(propsWMS(api, time, key, props.elevation))
        }
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
    } else {
      setTileExist(false)
    }

  }, [key]);

  return (
    <>
      <LayerGroup ref={ref}>
        {tileProps.map((tileProp: TileProp) => {
          return <TileLayerCanvas key={tileProp.params.key} type={tileProp.type} url={tileProp.url} params={tileProp.params} />
        })}
      </LayerGroup>
      <ShowData layergroup={ref.current} layerId={layerId} identifier={props.Identifier} datetime={time} elevation={props.elevation} param={api} />
    </>
  )
}
export default ProcWMS