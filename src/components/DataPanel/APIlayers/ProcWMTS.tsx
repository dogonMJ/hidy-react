import { useEffect, useRef, useState } from "react";
import { LayerGroup } from 'react-leaflet'
import L from 'leaflet'
import wmtsList from './WMTSList.json'
import TileLayerCanvas from './TileLayerCanvas'
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

const timeDuration = (time: string, duration: string) => {
  if (duration === 'P1D') {
    return time.split('T')[0]
  } else if (duration === 'PT10M') {
    return time.substring(0, 15) + "0:00Z"
  } else {
    return time
  }
}

const urls: string[] = []

const ProcWMTS = (props: Urls) => {
  const ref = useRef<L.LayerGroup>(null)
  const [layerId, setLayerId] = useState<number | null>(null)
  const api = wmtsList[props.Identifier as keyof typeof wmtsList]
  const time = timeDuration(props.Time, api.duration)
  const currentUrl = `${api.url}/${api.identifier}/${api.style}/${time}/${api.tileMatrixSet}/{z}/{y}/{x}.${api.formatExt}`

  if (!urls.includes(currentUrl)) {
    urls.push(currentUrl)
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.eachLayer((layer: any) => {
        if (layer._url === currentUrl && ref.current) {
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
        {urls.map((url) => {
          return < TileLayerCanvas key={url} url={url} opacity={0} />
        })}
      </LayerGroup>
      <ShowData layergroup={ref.current} layerId={layerId} identifier={props.Identifier} />
    </>
  )
}
export default ProcWMTS
