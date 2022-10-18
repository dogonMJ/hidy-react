import { useState, useEffect, useRef } from "react"
import { useMap } from "react-leaflet";
import { LineChart } from "components/LineChart"
import { coor } from "types";
import { PlotParams } from "react-plotly.js";

// source: ETOPO5 edited by Kuo, details need to be checked. E:\Depth and E:\drifter
declare const L: any
interface Zseg {
  x: number[]
  y: number[]
  z: number[]
  d: number[]
}
const dotIcon = {
  height: 24,
  width: 24,
  path: 'M6 20q-1.25 0-2.125-.875T3 17q0-1.25.875-2.125T6 14q1.25 0 2.125.875T9 17q0 1.25-.875 2.125T6 20Zm12 0q-1.25 0-2.125-.875T15 17q0-1.25.875-2.125T18 14q1.25 0 2.125.875T21 17q0 1.25-.875 2.125T18 20Zm-6-10q-1.25 0-2.125-.875T9 7q0-1.25.875-2.125T12 4q1.25 0 2.125.875T15 7q0 1.25-.875 2.125T12 10Z'
}
export const SeafloorElevation = (props: { coords: coor[], setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const plotRef = useRef<any>()
  const { coords, setOpen } = props
  const map = useMap()
  const [plotProps, setPlotProps] = useState<PlotParams>({
    data: [],
    layout: {
      width: 800,
      height: 300,
      dragmode: 'pan',
      hovermode: 'x',
      hoverlabel: {
        bgcolor: '#4d4d4d'
      },
      margin: {
        b: 50,
        t: 25
      },
      xaxis: {
        title: {
          text: 'Distance (km)',
          standoff: 10
        },
        fixedrange: true,
        showspikes: true,
        spikemode: 'across',
        spikedash: 'solid',
        spikethickness: 2,
        spikecolor: '#9c9c9c',
      },
      yaxis: {
        title: {
          text: 'Elevation (m)',
          standoff: 5
        },
      }
    },
    config: {
      scrollZoom: true,
      displayModeBar: true,
    }
  })
  let hoverPoint: L.CircleMarker;
  const hover = (data: Plotly.PlotHoverEvent) => {
    const points = data.points[0]
    const id = points.pointIndex
    const latlng = {
      lat: points.data.lat[id],
      lon: points.data.lon[id]
    }
    hoverPoint = L.circleMarker(latlng, { radius: 4 })
    hoverPoint.addTo(map)
  }
  const unHover = (data: Plotly.PlotMouseEvent) => {
    map.removeLayer(hoverPoint)
  }
  useEffect(() => {
    const getData = async () => {
      let dist: number[] = []
      let depth: number[] = []
      let lat: number[] = []
      let lon: number[] = []
      const annotations: Array<Partial<Plotly.Annotations>> = []
      const endPoints: number[][] = []
      // fetch Data
      for (let i = 0; i < coords.length - 1; i++) {
        const url = `https://odbgo.oc.ntu.edu.tw/grd/seaclim/zseg/${coords[i].lng},${coords[i].lat},${coords[i + 1].lng},${coords[i + 1].lat}/json`
        const json: Zseg[] = await fetch(url)
          .then((res) => res.json())
          .catch((e) => {
            setOpen(false)
            alert('Out of range (2~35\xB0N, 105~135\xB0E)')
          })
        const max = Math.max(...dist) > 0 ? Math.max(...dist) : 0
        dist = [...dist, ...json[0].d.map(n => n + max)]
        depth = [...depth, ...json[0].z]
        lon = [...lon, ...json[0].x]
        lat = [...lat, ...json[0].y]
        const index1 = dist.length - 1
        const index2 = json[0].d.length - 1
        if (i === 0) {
          endPoints.push([dist[0], depth[0], json[0].y[0], json[0].x[0]])
        }
        endPoints.push([dist[index1], depth[index1], json[0].y[index2], json[0].x[index2]])
      }
      const text = lat.map((lat, i) => `${lat}, ${lon[i]}`)
      // handle annotations
      endPoints.forEach((endPoint) => {
        annotations.push({
          visible: true,
          x: endPoint[0],
          y: endPoint[1],
          xref: 'x',
          yref: 'y',
          text: `(${endPoint[2]}, ${endPoint[3]})`,
          showarrow: true,
          arrowhead: 6,
          ay: -40,
          startstandoff: 30,
        })
      })
      plotProps.layout.annotations = annotations
      // handle data
      plotProps.data = [{
        x: dist,
        y: depth,
        lat: lat,
        lon: lon,
        type: 'scatter',
        mode: 'lines',
        fill: 'tonexty',
        text: text,
        marker: { color: 'red' },
        line: {
          shape: 'spline'
        },
        // hovertemplate: `%{text}<br>Distance:%{x} km<br>Elevation: %{y} m<extra></extra>`
        hovertemplate: `%{text}<br><b>%{x} km</b><br><b>%{y} m</b><extra></extra>`,
      }]
      // handle config & custom button for toogle annotations
      plotProps.config!.modeBarButtonsToAdd = [{
        title: 'Toggle Annotation',
        name: 'toggle_annotation',
        icon: dotIcon,
        click: () => {
          plotProps.layout.annotations?.forEach((annotation) => {
            annotation.visible = !annotation.visible
          })
          plotRef.current.updatePlotly()
        }
      }]
      // update plot
      const newProps = Object.assign({}, plotProps)
      setPlotProps(newProps)
    }
    getData()
  }, [coords])
  return (
    <LineChart ref={plotRef} plotProps={plotProps} setOpen={setOpen} hover={hover} unhover={unHover} />
  )

}