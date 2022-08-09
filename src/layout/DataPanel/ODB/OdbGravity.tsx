import { TileLayer } from 'react-leaflet'
import React from 'react'

export const OdbGravity = React.memo((props: { opacity: number }) => {
  const url = 'https://odbwms.oc.ntu.edu.tw/odbintl/rasters/tiles/odb_gravitytrack/{z}/{x}/{y}.tif'

  return (
    <TileLayer url={url} opacity={props.opacity} crossOrigin='anonymous' />
  )
})