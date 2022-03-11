import { useEffect, useRef } from "react";
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import wmtsList from './WMTSList.json'
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

const ProcWMTS = (props: Urls) => {
  const map: L.Map = useMap()
  let url: string;
  let time: string;
  let id: string | null;

  if (props.Identifier) {
    const api = wmtsList[props.Identifier as keyof typeof wmtsList]
    time = timeDuration(props.Time, api.duration)
    id = props.Identifier + time
    url = `${api.url}/${api.identifier}/${api.style}/${time}/${api.tileMatrixSet}/{z}/{y}/{x}.${api.formatExt}`
  } else {
    id = null
  }
  const layer = props.cache.getItem(id)
  const group = useRef<L.LayerGroup>(L.layerGroup().addTo(map))
  useEffect(() => {
    // 3. 觸發side effect，TileLayer執行setUrl method，重繪
    // setUrl: Updates the layer's URL template and redraws it
    if (layer) {
      group.current.eachLayer((layers: any) => {
        if (layers === layer) {
          layers.setOpacity(1)
        } else {
          layers.setOpacity(0)
        }
      })
    } else {
      if (group.current.getLayers().length > 0) {
        group.current.eachLayer((layers: any) => {
          layers.setOpacity(0)
        })
      }

      if (props.Identifier) {
        const newLayer = L.tileLayer(url)
        newLayer.addTo(group.current)
        props.cache.setItem(id, newLayer)
      }
    }
  });

  // 1.更改url
  return (
    <>
    </>
  )
}

export default ProcWMTS
