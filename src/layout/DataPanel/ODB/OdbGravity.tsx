import { TileLayer } from 'react-leaflet'
import { WMSTileLayer } from 'react-leaflet'
import React from 'react'
import { LegendControl } from 'components/LeafletLegend';
import GracityLegend from 'assets/images/colorbar_gravity.png'

// export const OdbGravity = React.memo((props: { opacity: number }) => {
//   const url = 'https://odbwms.oc.ntu.edu.tw/odbintl/rasters/tiles/odb_gravitytrack/{z}/{x}/{y}.tif'
//   const legendContent = `<img src=${GracityLegend} alt="legend" style="width:320px;margin:-5px"/>`
//   return (
//     <>
//       <TileLayer url={url} opacity={props.opacity} crossOrigin='anonymous' />
//       <LegendControl position='bottomleft' legendContent={legendContent} />
//     </>
//   )
// })
export const OdbGravity = React.memo((props: { opacity: number }) => {
  //https://seaimage.oc.ntu.edu.tw/geoserver/odb/wms?service=WMS&version=1.1.0&request=GetMap&layers=odb%3Aodb_gravitytrack_high_3857&bbox=1.257967777546626E7%2C1006562.7640868081%2C1.4136558568829644E7%2C3827502.1565648927&width=423&height=768&srs=EPSG%3A3857&styles=&format=image%2Fpng
  const url = 'https://seaimage.oc.ntu.edu.tw/geoserver/odb/wms?'
  const params = {
    layers: 'odb:gravitytrack_high_3857',
    transparent: true,
    format: 'image/png',
    crossOrigin: "anonymous",
  }

  return (
    <>
      <WMSTileLayer url={url} params={params} opacity={props.opacity} />
      {/* <LegendControl position='bottomleft' legendContent={contents.join('<br>')} legendClassNames={'topoLegend'} /> */}
    </>
  )
})