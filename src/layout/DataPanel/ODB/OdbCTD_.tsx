import { useEffect, useRef, useState } from 'react'
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import L, { LatLng } from 'leaflet';
import { ImageOverlay, GeoJSON } from 'react-leaflet'
import { DepthMeter } from 'components/DepthlMeter';
import { LegendControl } from 'components/LeafletLegend';
import { GeoJsonTooltip } from 'components/GeoJsonTooltip';
import { coor, SliderMarks } from 'types';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';


const ctdDepths = Array.from(Array(20), (e, i) => i * -5 - 5).concat(Array.from(Array(16), (e, i) => i * -25 - 125)).concat(Array.from(Array(10), (e, i) => i * -50 - 550)).reverse()
const marks: SliderMarks[] = []
ctdDepths.forEach((depth, i) => {
  if ((depth >= -100 && depth % 25 === 0) || (depth < -100 && depth % 200 === 0) || depth === -5) {
    marks.push({
      value: i,
      label: `${depth.toString()} m`
    })
  } else {
    marks.push({
      value: i,
      label: ``
    })
  }
})
export const OdbCTD = () => {
  const ref = useRef<any>(null)
  const refJson = useRef<any>(null)
  const { t } = useTranslation()
  const [position, setPosition] = useState<coor>({ lat: 0, lng: 0 })
  const [content, setContent] = useState<string | JSX.Element>('')
  const [data, setData] = useState<any>()
  const type = useSelector((state: RootState) => state.odbCtdStates.selection)
  const period = useSelector((state: RootState) => state.coordInput.OdbCurSelection)
  const depthMeterValue = useSelector((state: RootState) => state.coordInput.depthMeterValue)
  const depth = depthMeterValue || depthMeterValue === 0 ? ctdDepths[depthMeterValue] ? -ctdDepths[depthMeterValue] : 5 : 5
  const url = `${process.env.REACT_APP_PROXY_BASE}/data/figs/odb/ctd/ctd_grid15moa_${type}_${period}${depth}.png`
  const urlJson = `${process.env.REACT_APP_PROXY_BASE}/data/figs/odb/ctd/ctd_grid15moa_${period}${depth}.json`
  const legendContent = `<img src=${`${process.env.REACT_APP_PROXY_BASE}/data/figs/odb/ctd/colorbar_${type}.png`} alt="legend" style="width:320px;margin:-5px"/>`


  const mouseOver = (e: any) => {
    const property = e.layer.feature.properties
    const content = (
      <Box>
        {t('OdbData.depth')}: {property.p} m<br />
        {t('OdbData.t')}: {property.t} {'\u00B0C'}<br />
        {t('OdbData.sal')}: {property.sal} psu<br />
        {t('OdbData.density')}: {property.density} {`kg/m\u00B3`}
      </Box>
    )
    setPosition(e.latlng)
    setContent(content)
  }

  const pointToLayer = (feature: any, latlng: LatLng) => {
    const markerOptions = {
      radius: 8,
      opacity: 0,
      fillOpacity: 0
    };
    const marker = L.circleMarker(latlng, markerOptions);
    return marker
  }

  useEffect(() => {
    if (ref) {
      ref.current.setUrl(url)
      fetch(urlJson)
        .then((response) => response.json())
        .then((json) => {
          setData(json)
          refJson.current.clearLayers()
          refJson.current.addData(json)
        })
    }
  }, [url, urlJson, t])
  return (
    <>
      <GeoJSON ref={refJson} data={data} pointToLayer={pointToLayer} eventHandlers={{ mouseover: mouseOver }} >
        <GeoJsonTooltip position={position} content={content} />
      </GeoJSON>
      <ImageOverlay ref={ref} url={url} bounds={[[17.875, 116.875], [27.125, 125.125]]} crossOrigin='anonymous' />
      <DepthMeter values={ctdDepths} marks={marks} />
      <LegendControl position='bottomleft' legendContent={legendContent} />
    </>
  )
}