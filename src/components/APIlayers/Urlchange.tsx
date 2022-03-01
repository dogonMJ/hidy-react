import { useEffect, useRef } from "react";
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import wmsList from './WMSList.json'
/*
PROCESS NASA GIBS URL
WMS Capabilities:
https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0
*/
interface Urls {
  Identifier: string;
  Time: Date;
  cache: any;
}

const timeDuration = (time: Date, duration: string) => {
  if (duration === 'P1D') {
    return time.toISOString().split('T')[0] + "T00:00:00Z"
  } else if (duration === 'PT10M') {
    return time.toISOString().substring(0, 15) + "0:00Z"
  } else {
    return time.toISOString()
  }
}

const ProcGibsUrls = (props: Urls) => {
  const map: L.Map = useMap()
  let url: string;
  let params: object;
  let time: string;
  let id: string | null;

  if (props.Identifier) {
    const api = wmsList[props.Identifier as keyof typeof wmsList]
    time = timeDuration(props.Time, api.duration) //props.Time.toISOString().split('T')[0] + "T00:00:00Z"
    id = props.Identifier + time
    url = api.url
    params = {
      layers: api.layers,
      format: api.format,
      request: api.request,
      styles: api.styles,
      transparent: api.transparent,
      time: time
    }
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
        const newLayer = L.tileLayer.wms(url, params)
        newLayer.addTo(group.current)
        props.cache.setItem(id, newLayer)
      }
    }
    // ref.current.setUrl(url)
  });

  // 1.更改url
  return (
    <>
      {/* 2.渲染DOM */}
      {/* <TileLayer ref={ref} url={url} zIndex={650} /> */}
    </>
  )
}

export default ProcGibsUrls
