import { useEffect, useState, useRef } from 'react'
import { GeoJSON } from 'react-leaflet'
import { coor, Legend } from 'types';
import L, { LatLng } from 'leaflet';
import { Box } from '@mui/material';
import { LegendControl } from "components/LeafletLegend"
import { useTranslation } from 'react-i18next';
import { GeoJsonTooltip } from 'components/GeoJsonTooltip';

export const OdbSedCore = () => {
  const ref = useRef<any>()
  const { t } = useTranslation()
  const [data, setData] = useState<any>()
  const [position, setPosition] = useState<coor>({ lat: 0, lng: 0 })
  const [content, setContent] = useState<string | JSX.Element>('')

  const sedColors: Legend = {
    'SG': {
      "color": "#ff7800",
      "description": t('OdbData.sedCore.SG')
    },
    'GC': {
      "color": "#5bc2e7",
      "description": t('OdbData.sedCore.GC')
    },
    'BC': {
      "color": "#8fce00",
      "description": t('OdbData.sedCore.BC')
    },
    // 'GHP': {
    //   "color": "#8e7cc3",
    //   "description": t('OdbData.sedCore.GHP')
    // },
    'PC': {
      "color": "#ffed00",
      "description": t('OdbData.sedCore.PC')
    },
    'MC': {
      "color": "#8e7cc3",
      "description": t('OdbData.sedCore.MC')
    },
  }
  const contents: string[] = []
  Object.keys(sedColors).forEach((key) => {
    contents.push(`<i style="background:${sedColors[key].color}; color:${sedColors[key].color}"></i>${sedColors[key].description}`)
  })

  const mouseOver = (e: any) => {
    const geometry = e.layer.feature.geometry
    const property = e.layer.feature.properties
    const content = (
      // <Box>
      //   {t('OdbData.sedCore.type')}:{t(`OdbData.sedCore.${property.instruid_ab}`)}<br />
      //   {t('OdbData.sedCore.dataTime')}:{property.tim0}<br />
      //   {t('OdbData.sedCore.cr')}: {property.ship}-{property.cruise}<br />
      //   {t('OdbData.sedCore.site')}: {property.sn}<br />
      //   {t('OdbData.sedCore.PI')}: {property.PI}
      // </Box>
      <Box>
        {t('OdbData.sedCore.type')}:{t(`OdbData.sedCore.${property.device}`)}<br />
        {t('OdbData.sedCore.dataTime')}:{property.date}<br />
        {t('OdbData.sedCore.cr')}: {property.name}<br />
        {t('OdbData.sedCore.site')}: {property.station}<br />
        {t('OdbData.sedCore.cast')}: {property.cast}<br />
        {t('OdbData.sedCore.bottom_d')}: {property.bottom_dep}<br />
        {t('OdbData.sedCore.lower_d')}: {property.lower_dept}
      </Box>
    )
    setPosition({ lat: geometry.coordinates[1], lng: geometry.coordinates[0] })
    setContent(content)
  }
  const pointToLayer = (f: any, latlang: LatLng) => {
    return new L.CircleMarker(latlang)
  }

  const styleFunc = (feature: any) => {
    const instrument = feature.properties.device
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
    fetch(`${process.env.REACT_APP_PROXY_BASE}/data/figs/odb/sedcore_OR1.json`)
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