import { WMSTileLayer } from 'react-leaflet'
import React from 'react'

export const OdbTopo = React.memo((props: { opacity: number }) => {
  const url = 'https://seaimage.oc.ntu.edu.tw/geoserver/odb/wms?'
  const params = {
    layers: 'odb:topo_hidy',
    transparent: true,
    format: 'image/png',
    crossOrigin: "anonymous",
  }

  return (
    <WMSTileLayer url={url} params={params} opacity={props.opacity} />
  )
})