import { GeoJSON, Tooltip } from 'react-leaflet'
import { useEffect, useState, useRef } from 'react'
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import { coor } from 'types';
import FormatCoordinate from 'components/FormatCoordinate';
import { DepthMeter } from 'components/DepthlMeter';
import { LatLng } from 'leaflet';
import L from "leaflet";
import { SliderMarks } from 'types'

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

export const OdbCurrent = () => {
  const ref = useRef<any>()
  const [data, setData] = useState<any>()
  const [position, setPosition] = useState<coor>({ lat: 0, lng: 0 })
  const [content, setContent] = useState('')
  const latlonFormat = useSelector((state: RootState) => state.coordInput.latlonformat)
  const depthMeterValue = useSelector((state: RootState) => state.coordInput.depthMeterValue)
  const period = useSelector((state: RootState) => state.coordInput.OdbCurSelection)

  const mouseOver = (e: any) => {
    const property = e.layer.feature.properties
    const u = Number(property.u)
    const v = Number(property.v)
    const spd = Number(property.spd)
    const dir = Number(property.dir)
    setPosition(e.latlng)
    setContent(`u: ${u.toFixed(3)} m/s\nv: ${v.toFixed(3)} m/s\nspeed: ${spd.toFixed(3)} m/s\ndirection: ${dir.toFixed(1)}`)
  }

  const pointToLayer = (feature: any, layer: LatLng) => {
    const property = feature.properties
    const angle = property.dir - 90
    const size = property.spd * 50
    const icon = L.divIcon({
      className: 'arrow-icon',
      iconAnchor: [6, size / 2],
      html: `<div style="transform: rotate(${angle}deg);font-size: ${size}px;transform-origin: 50% 50%;line-height:${size}px;padding:0">&#x27A1;</div>`
    });
    const marker = new L.Marker(layer, { icon: icon })
    return marker
  }

  useEffect(() => {
    const depth = adcpDepths[depthMeterValue] ? -adcpDepths[depthMeterValue] : 20
    const url = `https://odbpo.oc.ntu.edu.tw/static/figs/odb/adcp/adcp_grid15moa_${period}${depth}.json`
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
        <Tooltip>
          <FormatCoordinate coords={position} format={latlonFormat} /><br />
          <span style={{ whiteSpace: 'pre-line' }}>{content}</span>
        </Tooltip>
      </GeoJSON>
      <DepthMeter values={adcpDepths} marks={marks} />
    </>
  )
}