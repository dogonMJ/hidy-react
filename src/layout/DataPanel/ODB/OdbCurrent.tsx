import { GeoJSON } from 'react-leaflet'
import { useEffect, useState, useRef, } from 'react'
import { renderToString } from 'react-dom/server';
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import { Box } from '@mui/material';
import * as geojson from 'geojson'
import 'leaflet'
import 'leaflet-canvas-markers'
import { DepthMeter } from 'components/DepthlMeter';
import { LegendControl } from "components/LeafletLegend"
import { AlertSlide } from 'components/AlertSlide/AlertSlide';
import Arrow from 'assets/images/ArrowUp.svg'
import { periodTransform, calSpd, calDir, adcpDepthMeterProps } from 'Utils/UtilsODB';
import { RenderIf } from 'components/RenderIf/RenderIf';
import { AdcpProfile } from 'components/VerticalPlot/AdcpProfile';
import { LineProfile } from 'components/VerticalPlot/LineProfile';

declare const L: any;
const adcpDepths = adcpDepthMeterProps().adcpDepths
const marks = adcpDepthMeterProps().marks
// const legendColors: StringObject = {
//   '&#x27A1; 1 m/s': "#e69138",
// }

export const OdbCurrent = () => {
  const ref = useRef<any>()
  const { t } = useTranslation()
  const [data, setData] = useState<any>()
  const [warning, setWarning] = useState(false)
  const [openVertical, setOpenVertical] = useState(false)
  const [ptData, setPtData] = useState({ lat: 121, lng: 20 })
  const depthMeterValue = useSelector((state: RootState) => state.map.depthMeterValue['odbCurrent'])
  const period = useSelector((state: RootState) => state.map.OdbSeasonSelection)
  const depth = adcpDepths[depthMeterValue]
  const mode = periodTransform[period]

  const onEachFeature = (feature: geojson.Feature<geojson.Point, any>, layer: any) => {
    const property = feature.properties
    const coord = feature.geometry.coordinates
    const u = Number(property.u)
    const v = Number(property.v)
    const spd = calSpd(u, v)
    const dir = calDir(u, v)
    const content = (
      <Box>
        {coord[1]}, {coord[0]}<br />
        {t('OdbData.current.spd')}: {spd.toFixed(3)}<br />
        {t('OdbData.current.dir')}: {dir.toFixed(3)}<br />
        {t('OdbData.current.u')}: {u.toFixed(3)}<br />
        {t('OdbData.current.v')}: {v.toFixed(3)}<br />
        {t('OdbData.count')}: {property.count}
      </Box>
    )
    layer.bindTooltip(renderToString(content))
    layer.on('click', () => {
      setPtData({
        lat: coord[1],
        lng: coord[0],
      })
      setOpenVertical(true)
    })
  }
  const pointToLayer = (feature: any, layer: L.LatLng) => {
    const property = feature.properties
    const u = Number(property.u)
    const v = Number(property.v)
    const angle = calDir(u, v)
    const size = calSpd(u, v) * 40
    const marker = L.canvasMarker(layer, {
      radius: 20,
      img: {
        url: Arrow,    //image link
        size: [size / 2, size],     //image size ( default [40, 40] )
        rotate: angle,         //image base rotate ( default 0 )
        offset: { x: 0, y: 0 }, //image offset ( default { x: 0, y: 0 } )
      },
    })
    return marker
  }
  useEffect(() => {
    const url = `https://ecodata.odb.ntu.edu.tw/api/sadcp?lon0=100&lon1=140&lat0=2&lat1=35&dep0=${depth}&dep_mode=exact&format=geojson&mode=${mode}&append=u,v,count&mean_threshold=10`
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setData(json)
        ref.current.clearLayers()
        ref.current.addData(json)
      })
      .catch(() => setWarning(true))
  }, [depth, mode, t])

  return (
    <>
      {/* <GeoJSON ref={ref} data={data} pointToLayer={pointToLayer} eventHandlers={{ mouseover: mouseOver }} > */}
      <GeoJSON ref={ref} data={data} pointToLayer={pointToLayer} onEachFeature={onEachFeature} />
      <RenderIf isTrue={openVertical}>
        <AdcpProfile lat={ptData.lat} lng={ptData.lng} mode={mode} parameter={'spd'} setOpen={setOpenVertical} />
      </RenderIf>
      <DepthMeter values={adcpDepths} marks={marks} user={'odbCurrent'} />
      <LegendControl position='bottomleft' legendContent={`<img src=${Arrow} height=20 width=10><span style="margin-left:8px;">0.5 m/s</span>`} />
      <AlertSlide open={warning} setOpen={setWarning} severity='error'>
        {t('alert.fetchFail')}
      </AlertSlide>
    </>
  )
}