import { LineChart } from "components/LineChart"
import { RenderIf } from "components/RenderIf/RenderIf"
import { useAppSelector } from "hooks/reduxHooks"
import { useFetchData } from "hooks/useFetchData"
import { LatLng } from "leaflet"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useMapEvents } from "react-leaflet"
import { PlotParams } from "react-plotly.js"
import { useLeafletContext } from '@react-leaflet/core';
import L from 'leaflet'
const handleTime = (datetime: string) => {
  const dateObj = new Date(datetime)
  dateObj.setSeconds(0)
  dateObj.setMilliseconds(0)
  const endTime = dateObj.toISOString()
  dateObj.setDate(dateObj.getDate() - 3);
  const startTime = dateObj.toISOString()
  return [startTime, endTime]
}

export const OdbTide = () => {
  const ref = useRef(null)
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [latlng, setLatlng] = useState<LatLng | null>(null)
  const [dragging, setDragging] = useState(false)
  const datetime = useAppSelector(state => state.map.datetime)
  const [startTime, endTime] = handleTime(datetime)
  const [plotProps, setPlotProps] = useState<PlotParams>({
    data: [],
    layout: {
      width: 800,
      height: 300,
      dragmode: 'zoom',
      hovermode: "x unified",
      hoverlabel: {
        // bgcolor: '#4d4d4d'
      },
      modebar: {
        remove: ['lasso2d']
      },
      legend: {
        orientation: "h",
        x: 0.5,
        xanchor: 'center'
      },
      margin: {
        b: 50,
        t: 50,
        r: 20,
        l: 70
      },
      xaxis: {
        linewidth: 1,
        color: '#1f77b4',
        hoverformat: '.3f',
        side: 'top',
      },
      yaxis: {
        showline: true,
        mirror: true,
        title: {
          text: `${t('OdbData.depth')} (m)`,
          standoff: 5,
        },
      },
    },
    config: {
      scrollZoom: true,
      displayModeBar: true,
    }
  })
  const map = useMapEvents({
    mousedown: (e) => {
      e.originalEvent.stopPropagation()
      e.originalEvent.preventDefault()
      if (!dragging) {
        setLatlng(e.latlng)
        setOpen(true)
      }
    },
    dragstart: () => setDragging(true),
    dragend: () => setDragging(false)
  })

  useEffect(() => {
    latlng && fetch(`https://eco.odb.ntu.edu.tw/api/tide?lon0=${latlng?.lng}&lat0=${latlng?.lat}&start=${startTime}&end=${endTime}&sample=1`)
      // fetch(`https://eco.odb.ntu.edu.tw/api/tide?lon0=125&lat0=15&start=${startTime}&end=${endTime}&sample=5`)
      .then(res => res.json())
      .then(json => {
        plotProps.data = [{
          type: 'scatter',
          mode: 'lines+markers',
          line: {
            shape: 'spline'
          },
          x: json.time?.map((time: string) => new Date(time)),
          y: json.z,
        }]
        const newProps = Object.assign({}, plotProps)
        setPlotProps(newProps)
      })
  }, [latlng, startTime, endTime])
  return (
    <>
      <RenderIf isTrue={open}>
        <LineChart ref={ref} paneName={'TideProfile'} plotProps={plotProps} setOpen={setOpen} positionOffset={{ x: -200, y: -125 }} />
      </RenderIf>
    </>
  )
}
