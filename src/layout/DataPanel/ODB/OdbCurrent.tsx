import { GeoJSON } from 'react-leaflet'
import { useEffect, useState, useRef } from 'react'
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import { coor, SliderMarks, StringObject } from 'types';
import 'leaflet'
import 'leaflet-canvas-markers'
import { DepthMeter } from 'components/DepthlMeter';
import { LegendControl } from "components/LeafletLegend"
import { GeoJsonTooltip } from 'components/GeoJsonTooltip';
// import ArrowRight from 'assets/images/straight-right-arrow.svg';
import Arrow from 'assets/images/ArrowUp.svg'
declare const L: any;

// const legendColors: StringObject = {
//   '&#x27A1; 1 m/s': "#e69138",
// }

const adcpDepths = Array.from(Array(31), (e, i) => i * -10).slice(2).reverse()
const marks: SliderMarks[] = []
adcpDepths.forEach((depth, i) => {
  if (depth % 50 === 0 || depth === -20) {
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
const periodTransform: StringObject = {
  'avg': '0',
  'NE': '13',
  'SW': '4',
  'spring': '15',
  'summer': '16',
  'fall': '17',
  'winter': '18'
}
const calSpd = (u: number, v: number) => Math.sqrt(u ** 2 + v ** 2)
const calDir = (u: number, v: number) => {
  const dir = 90 - Math.atan2(v, u) * 180 / Math.PI;
  if (dir < 0) {
    return dir + 360
  } else {
    return dir
  }
}

export const OdbCurrent = () => {
  const ref = useRef<any>()
  const [data, setData] = useState<any>()
  const [position, setPosition] = useState<coor>({ lat: 0, lng: 0 })
  const [content, setContent] = useState('')
  const depthMeterValue = useSelector((state: RootState) => state.coordInput.depthMeterValue)
  const period = useSelector((state: RootState) => state.coordInput.OdbCurSelection)
  const legendContent = `<img src=${Arrow} height=20 width=10><span style="margin-left:8px;">0.5 m/s</span>`

  const mouseOver = (e: any) => {
    const property = e.layer.feature.properties
    const u = Number(property.u)
    const v = Number(property.v)
    const spd = calSpd(u, v)
    const dir = calDir(u, v)
    setPosition(e.latlng)
    setContent(`speed: ${spd.toFixed(3)} m/s\nu: ${u.toFixed(3)} m/s\nv: ${v.toFixed(3)} m/s\ndirection: ${dir.toFixed(1)}\ncount: ${property.count}`)
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
        // <a href="https://www.flaticon.com/free-icons/arrow" title="arrow icons">Arrow icons created by Freepik - Flaticon</a>
        url: Arrow,    //image link
        size: [size / 2, size],     //image size ( default [40, 40] )
        rotate: angle,         //image base rotate ( default 0 )
        offset: { x: 0, y: 0 }, //image offset ( default { x: 0, y: 0 } )
      },
    })
    return marker
  }
  useEffect(() => {
    const depth = adcpDepths[depthMeterValue] ? -adcpDepths[depthMeterValue] : 20
    const url = `https://ecodata.odb.ntu.edu.tw/api/sadcp?dep0=${depth}&dep_mode=exact&format=geojson&mode=${periodTransform[period]}&append=u,v,count&mean_threshold=10`
    // const url = `https://odbpo.oc.ntu.edu.tw/static/figs/odb/adcp/adcp_grid15moa_${period}${depth}.json`
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setData(json)
        ref.current.clearLayers()
        ref.current.addData(json)
      })
  }, [depthMeterValue, period])

  return (
    <>
      <GeoJSON ref={ref} data={data} pointToLayer={pointToLayer} eventHandlers={{ mouseover: mouseOver }} >
        <GeoJsonTooltip position={position} content={content} />
      </GeoJSON>
      <DepthMeter values={adcpDepths} marks={marks} />
      <LegendControl position='bottomleft' legendContent={legendContent} />
    </>
  )
}