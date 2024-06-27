import { useEffect, useState, useRef } from 'react'
import { GeoJSON } from 'react-leaflet'
import { coor, Legend } from 'types';
import L, { LatLng } from 'leaflet';
import { LegendControl } from "components/LeafletLegend"
import { GeoJsonTooltip } from 'components/GeoJsonTooltip';

const sedColors: Legend = {
  // 'boulder,sand': "#AFAF9D",
  // 'clay': "#B56654",
  // 'cobbles,shells': "#CEEAFC",
  // 'coral': "#BDD37C",
  // 'coral,sand': "#BBE5BF",
  // 'coral,sand,shells': "#91D9CD",
  // 'coral,shells': "#86CFD3",
  // 'gravel': "#C9C7D4",
  // 'gravel,coral': "#ABCDCE",
  // 'gravel,mud': "#DDBA77",
  // 'gravel,sand': "#E7E6C2",
  // 'gravel,sand,mud': "#D6CE96",
  // 'gravel,sand,stone': "#CBCABC",
  // 'gravel,shells': "#A2C6E4",
  // 'mud': "#F5A905",
  // 'mud,gravel': "#DDBA77",
  // 'mud,rock': "#DAB270",
  // 'mud,sand': "#F5DD05",
  // 'mud,sand,shells': "#BFBA8F",
  // 'mud,shells': "#BAB572",
  // 'mud,stone': "#C1AA6C",
  // 'rock': "#BEBADA",
  // 'rock,mud': "#DAB270",
  // 'rock,mud,sand': "#BEBAB8",
  // 'rock,sand': "#DBD9C8",
  // 'rock,shells': "#ABBCE1",
  // 'sand': "#FFFFB3",
  // 'sand,cobbles': "#FFFFE8",
  // 'sand,coral': "#BBE5BF",
  // 'sand,gravel': "#E7E6C2",
  // 'sand,mud': "#F5DD05",
  // 'sand,mud,shells': "#BFBA8F",
  // 'sand,rock': "#DBD9C8",
  // 'sand,shells': "#E3F3C1",
  // 'sand,shells,coral': "#9ED9CD",
  // 'sand,shells,gravel': "#B2D7DA",
  // 'sand,shells,stone': "#A0B6B6",
  // 'sand,stone': "#CDCDA5",
  // 'shells': "#72C4F4",
  // 'shells,stone': "#8EB1C9",
  // 'stone': "#82818F",
  // 'stone,shells': "#7AA2C3",
  'boulder,sand': {
    'color': '#AFAF9D',
    'description': 'boulder,sand',
  },
  'clay': {
    'color': '#B56654',
    'description': 'clay',
  },
  'cobbles,shells': {
    'color': '#CEEAFC',
    'description': 'cobbles,shells',
  },
  'coral': {
    'color': '#5cdb60',
    'description': 'coral',
  },
  'coral,sand': {
    'color': '#51bf54',
    'description': 'coral,sand',
  },
  'coral,sand,shells': {
    'color': '#46a449',
    'description': 'coral,sand,shells',
  },
  'coral,shells': {
    'color': '#3b8a3e',
    'description': 'coral,shells',
  },
  'gravel': {
    'color': '#4069ff',
    'description': 'gravel',
  },
  'gravel,coral': {
    'color': '#395ff6',
    'description': 'gravel,coral',
  },
  'gravel,mud': {
    'color': '#3256ec',
    'description': 'gravel,mud',
  },
  'gravel,sand': {
    'color': '#2b4ce3',
    'description': 'gravel,sand',
  },
  'gravel,sand,mud': {
    'color': '#2242d9',
    'description': 'gravel,sand,mud',
  },
  'gravel,sand,stone': {
    'color': '#1739d0',
    'description': 'gravel,sand,stone',
  },
  'gravel,shells': {
    'color': '#062fc7',
    'description': 'gravel,shells',
  },
  'mud': {
    'color': '#ff9cfc',
    'description': 'mud',
  },
  'mud,gravel': {
    'color': '#f791e2',
    'description': 'mud,gravel',
  },
  'mud,rock': {
    'color': '#ee87c8',
    'description': 'mud,rock',
  },
  'mud,sand': {
    'color': '#e47caf',
    'description': 'mud,sand',
  },
  'mud,sand,shells': {
    'color': '#da7297',
    'description': 'mud,sand,shells',
  },
  'mud,shells': {
    'color': '#cf687f',
    'description': 'mud,shells',
  },
  'mud,stone': {
    'color': '#c45e67',
    'description': 'mud,stone',
  },
  'rock': {
    'color': '#dcdae0',
    'description': 'rock',
  },
  'rock,mud': {
    'color': '#cdcad2',
    'description': 'rock,mud',
  },
  'rock,mud,sand': {
    'color': '#bebbc4',
    'description': 'rock,mud,sand',
  },
  'rock,sand': {
    'color': '#afabb7',
    'description': 'rock,sand',
  },
  'rock,shells': {
    'color': '#a09ca9',
    'description': 'rock,shells',
  },
  'sand': {
    'color': '#fcd228',
    'description': 'sand',
  },
  'sand,cobbles': {
    'color': '#fdca26',
    'description': 'sand,cobbles',
  },
  'sand,coral': {
    'color': '#fdc124',
    'description': 'sand,coral',
  },
  'sand,gravel': {
    'color': '#fdb922',
    'description': 'sand,gravel',
  },
  'sand,mud': {
    'color': '#fdb121',
    'description': 'sand,mud',
  },
  'sand,mud,shells': {
    'color': '#fda81f',
    'description': 'sand,mud,shells',
  },
  'sand,rock': {
    'color': '#fd9f1d',
    'description': 'sand,rock',
  },
  'sand,shells': {
    'color': '#fd971c',
    'description': 'sand,shells',
  },
  'sand,shells,coral': {
    'color': '#fc8e1a',
    'description': 'sand,shells,coral',
  },
  'sand,shells,gravel': {
    'color': '#fc8419',
    'description': 'sand,shells,gravel',
  },
  'sand,shells,stone': {
    'color': '#fb7b17',
    'description': 'sand,shells,stone',
  },
  'sand,stone': {
    'color': '#fa7116',
    'description': 'sand,stone',
  },
  'shells': {
    'color': '#72C4F4',
    'description': 'shells',
  },
  'shells,stone': {
    'color': '#8EB1C9',
    'description': 'shells,stone',
  },
  'stone': {
    'color': '#928e9c',
    'description': 'stone',
  },
  'stone,shells': {
    'color': '#847f8f',
    'description': 'stone,shells',
  },
}
const contents: string[] = []
Object.keys(sedColors).forEach((key) => {
  contents.push(`<i style="background:${sedColors[key].color}; color:${sedColors[key].color}"></i>${sedColors[key].description}`)
})

export const MoiSubstrate = () => {
  const ref = useRef<any>()
  const [data, setData] = useState<any>()
  const [position, setPosition] = useState<coor>({ lat: 0, lng: 0 })
  const [content, setContent] = useState('')

  const mouseOver = (e: any) => {
    const feature = e.layer.feature
    const coordinate = feature.geometry.coordinates
    const substrateType = feature.properties.NATSUR
    setPosition({ lat: coordinate[1], lng: coordinate[0] })
    setContent(substrateType)
  }

  const pointToLayer = (f: any, latlang: LatLng) => {
    return new L.CircleMarker(latlang)
  }

  const styleFunc = (feature: any) => {
    const substrateType = feature.properties.NATSUR
    if (substrateType) {
      return {
        color: sedColors[substrateType].color,
        fillColor: sedColors[substrateType].color,
        fillOpacity: 0.8,
        radius: 2,
        opacity: 0.8
      }
    } else {
      return {
        color: '#000000',
        fillOpacity: 0.8,
        radius: 2,
        opacity: 0.8
      }
    }
  }
  useEffect(() => {
    fetch(`${process.env.REACT_APP_PROXY_BASE}/data/figs/odb/substrate.json`)
      .then((response) => response.json())
      .then((json) => {
        setData(json)
        ref.current.clearLayers()
        ref.current.addData(json)
      });
  }, [])

  return (
    <>
      <GeoJSON ref={ref} data={data} style={styleFunc} pointToLayer={pointToLayer} eventHandlers={{ mouseover: mouseOver }}>
        <GeoJsonTooltip position={position} content={content} />
      </GeoJSON>
      <LegendControl position='bottomleft' legendContent={contents.join('<br>')} legendClassNames={'sedLegend'} />
    </>
  )
}


// import { WMSTileLayer, useMap, useMapEvents } from 'react-leaflet'
// import React from 'react'

// const getWMSData = async (map: L.Map, baseUrl: string, latlng: L.LatLng) => {
//   const size = map.getSize()
//   const point = map.latLngToContainerPoint(latlng)
//   const url = new URL(baseUrl)
//   url.search = new URLSearchParams({
//     request: 'GetFeatureInfo',
//     service: 'WMS',
//     version: '1.1.1',
//     query_layers: 'substrate:twcoastalsubstrate',
//     layers: 'substrate:twcoastalsubstrate',
//     info_format: 'application/json',
//     srs: 'EPSG:4326',
//     bbox: map.getBounds().toBBoxString(),
//     width: size.x.toString(),
//     height: size.y.toString(),
//     x: point.x.toString(),
//     y: point.y.toString(),
//   }).toString();
//   fetch(url.toString())
//     .then((response) => response.json())
//     .then((json) => {
//       const feature = json.features[0]
//       if (feature) {
//       } else {
//       }
//     })
// }

// export const MoiSubstrate = React.memo(() => {
//   const map = useMap()
//   const baseurl = 'https://ecodata.odb.ntu.edu.tw/geoserver/substrate/wms'
//   const params = {
//     crossOrigin: "anonymous",
//     layers: 'substrate:twcoastalsubstrate',
//     format: 'image/png',
//     transparent: true,
//   }
//   useMapEvents({
//     mousedown: (e) => {
//       getWMSData(map, baseurl, e.latlng)
//     }
//   })
//   return (
//     <WMSTileLayer url={baseurl} params={params} crossOrigin='anonymous' />
//   )
// })