import { useState, useEffect, useRef } from "react"
import { useMap } from "react-leaflet";
import { LineChart } from "components/LineChart"
import { coor } from "types";
import { PlotParams } from "react-plotly.js";
import { useSelector } from "react-redux";
import { RootState } from "store/store"
// old source: ETOPO5 edited by Kuo, details need to be checked. E:\Depth and E:\drifter
declare const L: any

const dotIcon = {
  height: 24,
  width: 24,
  path: 'M6 20q-1.25 0-2.125-.875T3 17q0-1.25.875-2.125T6 14q1.25 0 2.125.875T9 17q0 1.25-.875 2.125T6 20Zm12 0q-1.25 0-2.125-.875T15 17q0-1.25.875-2.125T18 14q1.25 0 2.125.875T21 17q0 1.25-.875 2.125T18 20Zm-6-10q-1.25 0-2.125-.875T9 7q0-1.25.875-2.125T12 4q1.25 0 2.125.875T15 7q0 1.25-.875 2.125T12 10Z'
}
export const SeafloorElevation = (props: { coords: coor[], setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { coords, setOpen } = props
  const plotRef = useRef<any>()
  const map = useMap()
  const scaleUnit = useSelector((state: RootState) => state.coordInput.scaleUnit);
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
          text: scaleUnit === 'imperial' ? 'Distance (mi)' : scaleUnit === 'nautical' ? 'Distance (nm)' : 'Distance (km)',
          standoff: 10
        },
        // fixedrange: true,
        showspikes: true,
        spikemode: 'across',
        spikedash: 'solid',
        spikethickness: 2,
        spikecolor: '#9c9c9c',
        hoverformat: '.2f'
      },
      yaxis: {
        title: {
          text: scaleUnit === 'imperial' ? 'Elevation (ft)' : 'Elevation (m)',
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
  let lastLon: number | null = null
  const hover = (data: Plotly.PlotHoverEvent) => {
    const points = data.points[0]
    const id = points.pointIndex
    const lng = coords.slice(-1)[0].lng
    let lon = Number(points.data.lon[id])
    if ((lastLon && Math.abs(lon - lastLon) > 180) || lastLon === null) {
      lon = Number(points.data.lon[id]) + 360 * (Math.sign(lng))
    }
    lastLon = lon
    ///// if map span > 720 /////
    // const cross = Math.trunc(lng / 180)
    // if (Math.abs(cross) > 0) {
    //   if (lastLon && Math.abs(lon - lastLon) > 180) {
    //     lon = Number(points.data.lon[id]) + 360 * (cross)
    //   }
    // } else {
    //   if (lastLon && Math.abs(lon - lastLon) > 180) {
    //     lon = Number(points.data.lon[id]) + 360 * (Math.sign(lng))
    //   }
    // }
    //////////////////////////////
    const latlng = {
      lat: points.data.lat[id],
      lon: lon
    }
    hoverPoint = L.circleMarker(latlng, { radius: 4 })
    hoverPoint.addTo(map)
  }
  const unHover = () => {
    map.removeLayer(hoverPoint)
  }
  useEffect(() => {
    const getData = async () => {
      let dist: number[] = []
      let depth: number[] = []
      let lat: number[] = []
      let lon: number[] = []
      const annotations: Array<Partial<Plotly.Annotations>> = []
      const lats = coords.map((coord) => coord.lat)
      const lngs = coords.map((coord) => {
        const lng = coord.lng
        const round = Math.trunc(lng / 180)
        if (lng >= 180) {
          return lng - 180 * round - 180
        } else if (lng < -180) {
          return lng - 180 * round + 180
        } else {
          return coord.lng
        }
      })
      await fetch(`https://ecodata.odb.ntu.edu.tw/gebco?lon=${lngs}&lat=${lats}`)
        .then(res => res.json())
        .then(json => {
          lon = json.longitude.map((value: number) => Math.round(value * 10000) / 10000)
          lat = json.latitude.map((value: number) => Math.round(value * 10000) / 10000)
          depth = json.z
          json.distance.reduce(
            (accumulator: number, currentValue: number) => {
              dist.push(accumulator + currentValue)
              return accumulator + currentValue
            }
          );
          if (scaleUnit === 'nautical') {
            dist = dist.map((x: number) => x / 1.852)
          } else if (scaleUnit === 'imperial') {
            dist = dist.map((x: number) => x / 1.609344)
            depth = depth.map((x: number) => x * 3.28)
          }
        })
      const endPoints = await fetch(`https://ecodata.odb.ntu.edu.tw/gebco?lon=${lngs}&lat=${lats}&mode=point`)
        .then(res => res.json())
        .then(json => {
          const d = [0]
          json.distance.reduce((accumulator: number, currentValue: number) => {
            d.push(accumulator + currentValue)
            return accumulator + currentValue
          })
          json.distance = d
          if (scaleUnit === 'nautical') {
            json.distance = json.distance.map((x: number) => x / 1.852)
          } else if (scaleUnit === 'imperial') {
            json.distance = json.distance.map((x: number) => x / 1.609344)
            json.z = json.z.map((x: number) => x * 3.28)
          }
          return { ...json }
        })
      const text = lat.map((lat, i) => `${lat}, ${lon[i]}`)
      // handle annotations
      for (let i = 0; i < endPoints.z.length; i++) {
        annotations.push({
          visible: true,
          x: endPoints.distance[i],//endPoint[0],
          y: endPoints.z[i],//endPoint[1],
          xref: 'x',
          yref: 'y',
          text: `(${endPoints.latitude[i].toFixed(4)}, ${endPoints.longitude[i].toFixed(4)})`,
          showarrow: true,
          arrowhead: 6,
          ay: -40,
          startstandoff: 30,
        })
      }
      plotProps.layout.annotations = annotations
      // handle data
      plotProps.data = [{
        x: [0, ...dist],
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
        hovertemplate: scaleUnit === 'imperial' ? `%{text}<br><b>%{x:.2f} mi</b><br><b>%{y} ft</b><extra></extra>` :
          scaleUnit === 'nautical' ? `%{text}<br><b>%{x:.2f} nm</b><br><b>%{y} m</b><extra></extra>` :
            `%{text}<br><b>%{x:.2f} km</b><br><b>%{y} m</b><extra></extra>`,
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
    <LineChart ref={plotRef} paneName="seafloorProfile" plotProps={plotProps} setOpen={setOpen} hover={hover} unhover={unHover} />
  )

}