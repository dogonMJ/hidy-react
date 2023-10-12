import { WMSTileLayer } from 'react-leaflet'
import React from 'react'
import { LegendControl } from 'components/LeafletLegend';
import GravityLegend from 'assets/images/colorbar_gravity.png'

export const OdbGravity = React.memo((props: { opacity: number }) => {
  const url = `${process.env.REACT_APP_PROXY_BASE}/data/odbgeo/wms?`
  const params = {
    layers: 'odb:gravitytrack_high_3857',
    transparent: true,
    format: 'image/png',
    crossOrigin: "anonymous",
  }

  return (
    <>
      <WMSTileLayer url={url} params={params} opacity={props.opacity} />
      <LegendControl position='bottomleft' legendContent={`<img src=${GravityLegend} alt="legend" style="width:320px;margin:-5px"/>`} legendClassNames={'topoLegend'} />
    </>
  )
})