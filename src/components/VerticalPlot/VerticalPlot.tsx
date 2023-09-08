import { useEffect, useRef, useState } from 'react'
import { LineChart } from 'components/LineChart';
import { PlotParams } from "react-plotly.js";
import { useSelector } from "react-redux";
import { RootState } from "store/store"

interface VerticalPlotProps {
  lat: number
  lng: number
  mode: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface CustomAxis extends Plotly.LayoutAxis, Plotly.Axis {
  ticklabelposition: "outside" | "inside" | "outside top" | "inside top" | "outside left" | "inside left" | "outside right" | "inside right" | "outside bottom" | "inside bottom"
}
interface CustomLayout extends Plotly.Layout {
  xaxis: Partial<CustomAxis>;
}
interface CustomPlotParams extends PlotParams {
  layout: Partial<CustomLayout>
}
export const VerticalPlot: React.FC<VerticalPlotProps> = ({ lat, lng, mode, setOpen }) => {
  const ref = useRef(null)
  const scaleUnit = useSelector((state: RootState) => state.coordInput.scaleUnit);
  const [plotProps, setPlotProps] = useState<CustomPlotParams>({
    data: [],
    layout: {
      width: 400,
      height: 500,
      dragmode: 'pan',
      hovermode: 'x',
      hoverlabel: {
        bgcolor: '#4d4d4d'
      },
      margin: {
        b: 20,
        t: 50,
        r: 20
      },
      xaxis: {
        title: {
          text: scaleUnit === 'imperial' ? 'Distance (mi)' : scaleUnit === 'nautical' ? 'Distance (nm)' : 'Distance (km)',
          standoff: 0,
        },
        // fixedrange: true,
        showspikes: true,
        spikemode: 'across',
        spikedash: 'solid',
        spikethickness: 2,
        spikecolor: '#9c9c9c',
        hoverformat: '.2f',
        side: 'top'
      },
      yaxis: {
        title: {
          text: 'Depth (m)',
          standoff: 5
        },
      }
    },
    config: {
      scrollZoom: true,
      displayModeBar: true,
    }
  })

  const url = `https://ecodata.odb.ntu.edu.tw/api/ctd?lon0=${lng}&lat0=${lat}&mode=${mode}&format=geojson&append=temperature,salinity,density,fluorescence,transmission,oxygen`
  useEffect(() => {
    fetch(url)
      .then(resp => resp.json())
      .then(json => {
        const pairs: any = []

        json.features.forEach((feature: any) => {
          pairs.push({ x: feature.properties.temperature, y: feature.properties.depth })
        })
        pairs.sort((a: any, b: any) => a.y - b.y);
        const x = pairs.map((pair: any) => pair.x)
        const y = pairs.map((pair: any) => -pair.y)
        plotProps.data = [{
          x: x,
          y: y,
          type: 'scatter'
        }]
        const newProps = Object.assign({}, plotProps)
        setPlotProps(newProps)
      })
  }, [url])
  return (
    <LineChart ref={ref} plotProps={plotProps} setOpen={setOpen} />
  )
}