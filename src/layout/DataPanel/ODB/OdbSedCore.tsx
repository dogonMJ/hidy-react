import { useEffect, useState, useRef } from 'react'
import { GeoJSON } from 'react-leaflet'
import { coor, Legend } from 'types';
import L, { LatLng } from 'leaflet';
import { LegendControl } from "components/LeafletLegend"
import { useTranslation } from 'react-i18next';
import { GeoJsonTooltip } from 'components/GeoJsonTooltip';

export const OdbSedCore = () => {
  const ref = useRef<any>()
  const { t } = useTranslation()
  const [data, setData] = useState<any>()
  const [position, setPosition] = useState<coor>({ lat: 0, lng: 0 })
  const [content, setContent] = useState('')

  const sedColors: Legend = {
    'SG': {
      "color": "#ff7800",
      "description": t('OdbData.sedCoreLegend.SG')
    },
    'GC': {
      "color": "#5bc2e7",
      "description": t('OdbData.sedCoreLegend.GC')
    },
    'B': {
      "color": "#8fce00",
      "description": t('OdbData.sedCoreLegend.B')
    },
    'GHP': {
      "color": "#8e7cc3",
      "description": t('OdbData.sedCoreLegend.GHP')
    },
    'PC': {
      "color": "#ffed00",
      "description": t('OdbData.sedCoreLegend.PC')
    },
  }
  const contents: string[] = []
  Object.keys(sedColors).forEach((key) => {
    contents.push(`<i style="background:${sedColors[key].color}; color:${sedColors[key].color}"></i>${sedColors[key].description}`)
  })

  const mouseOver = (e: any) => {
    const property = e.layer.feature.properties
    const content = `Type:\n${property.instruid_tw}\n\t${property.instruid_en} (${property.instruid_ab})\nData Time:\n${property.tim0}\nCruise: ${property.ship}-${property.cruise}\nSite: ${property.sn}\nPI: ${property.PI}`
    setPosition({ lat: property.latitude, lng: property.longitude })
    setContent(content)
  }

  const pointToLayer = (f: any, latlang: LatLng) => {
    return new L.CircleMarker(latlang)
  }

  const styleFunc = (feature: any) => {
    const instrument = feature.properties.instruid_ab
    if (instrument) {
      return {
        color: sedColors[instrument].color,
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
    fetch('https://odbpo.oc.ntu.edu.tw/static/figs/odb/sedcore.json')
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
        <GeoJsonTooltip position={position} content={content} tooltipProps={{ className: 'sedCoreTooltip' }} />
      </GeoJSON>
      <LegendControl position='bottomleft' legendContent={contents.join('<br>')} legendClassNames={'sedLegend'} />
    </>
  )
}