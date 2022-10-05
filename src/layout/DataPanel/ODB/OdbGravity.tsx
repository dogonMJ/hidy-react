import { TileLayer } from 'react-leaflet'
import React from 'react'
import { LegendControl } from 'components/LeafletLegend';
import GracityLegend from 'assets/images/colorbar_gravity.png'

export const OdbGravity = React.memo((props: { opacity: number }) => {
  const url = 'https://odbwms.oc.ntu.edu.tw/odbintl/rasters/tiles/odb_gravitytrack/{z}/{x}/{y}.tif'
  const legendContent = `<img src=${GracityLegend} alt="legend" style="width:320px;margin:-5px"/>`
  return (
    <>
      <TileLayer url={url} opacity={props.opacity} crossOrigin='anonymous' />
      <LegendControl position='bottomleft' legendContent={legendContent} />
    </>
  )
})