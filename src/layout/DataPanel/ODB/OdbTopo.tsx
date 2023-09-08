import { WMSTileLayer } from 'react-leaflet'
import React from 'react'
import { Legend } from 'types';
import { LegendControl } from "components/LeafletLegend"

const sedColors: Legend = {
  '0': {
    'description': '0 - 28',
    'color': "rgb(241,252,255)"
  },
  '28': {
    'description': '28 - 100',
    'color': "rgb(215,241,255)",
  },
  '100': {
    'description': '100 - 400',
    'color': "rgb(188,230,255)",
  },
  '400': {
    'description': '400 - 1000',
    'color': "rgb(161,219,255)",
  },
  '1000': {
    'description': '1000 - 1400',
    'color': "rgb(134,208,255)",
  },
  '1400': {
    'description': '1400 - 2000',
    'color': "rgb(108,197,255)",
  },
  '2000': {
    'description': '2000 - 2400',
    'color': "rgb(81,186,255)",
  },
  '2400': {
    'description': '2400 - 3000',
    'color': "rgb(54,175,255)",
  },
  '3000': {
    'description': '3000 - 3400',
    'color': "rgb(27,164,255)",
  },
  '3400': {
    'description': '3400 - 4000',
    'color': "rgb(0,153,255)",
  },
  '4000': {
    'description': '4000 - 4400',
    'color': "rgb(17,136,255)",
  },
  '4400': {
    'description': '4400 - 5000',
    'color': "rgb(34,119,255)",
  },
  '5000': {
    'description': '5000 - 5400',
    'color': "rgb(51,102,255)",
  },
  '5400': {
    'description': '5400 - 6000',
    'color': "rgb(85,68,255)",
  },
  '6000': {
    'description': '6000 - 6400',
    'color': "rgb(85,68,255)",
  },
  '6400': {
    'description': '6400 - 7000',
    'color': "rgb(102,51,255)",
  },
  '7000': {
    'description': '7000 - 7400',
    'color': "rgb(119,34,255)",
  },
  '7400': {
    'description': '> 7400',
    'color': "rgb(136,17,255)",
  },
}
const contents: string[] = []
Object.keys(sedColors).forEach((key) => {
  contents.push(`<i style="background:${sedColors[key].color}; color:${sedColors[key].color}"></i>${sedColors[key].description}`)
})
contents.unshift('<string>Depth (m)</string>')
export const OdbTopo = React.memo((props: { opacity: number }) => {
  const url = `${process.env.REACT_APP_PROXY_BASE}/data/odbgeo/wms?`
  const params = {
    layers: 'odb:topo_hidy',
    transparent: true,
    format: 'image/png',
    crossOrigin: "anonymous",
  }

  return (
    <>
      <WMSTileLayer url={url} params={params} opacity={props.opacity} />
      <LegendControl position='bottomleft' legendContent={contents.join('<br>')} legendClassNames={'topoLegend'} />
    </>
  )
})