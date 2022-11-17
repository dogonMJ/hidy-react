import { useEffect, useRef, useState } from "react"
import { LineChart } from "components/LineChart"
import { PlotParams } from "react-plotly.js";
import { RenderIf } from "components/RenderIf/RenderIf";
import { useTranslation } from "react-i18next";

export const PlotProfile = (props: { url: string, coord: string | undefined, text: { [key: string]: string } }) => {
  const { url, coord, text } = props
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const plotRef = useRef<any>()
  const [plotProps, setPlotProps] = useState<PlotParams>({
    data: [],
    layout: {
      width: 800,
      height: 300,
      dragmode: false,
      hovermode: 'x',
      hoverlabel: {
        bgcolor: '#4d4d4d'
      },
      margin: {
        b: 60,
        t: 50
      },
      title: {
        text: '',
        y: 0.94
      },
      xaxis: {
        title: {
          text: text.xLabel,
          standoff: 10
        },
        fixedrange: true,
      },
      yaxis: {
        title: {
          text: `${t('StatMean.depth')} (m)`,
          standoff: 5
        },
      }
    },
    config: {
      scrollZoom: false,
      displayModeBar: true,
    }
  })
  useEffect(() => {
    if (url && coord && !url.includes('//json')) {
      fetch(url)
        .then((response) => response.json())
        .then((json) => {
          const jsonZ = json.z.map((value: number) => value < 0 ? NaN : value)
          const z = []
          const chunkSize = json.x.length > 0 ? json.x.length : 1
          for (let i = 0; i < jsonZ.length; i += chunkSize) {
            z.push(jsonZ.slice(i, i + chunkSize))
          }
          plotProps.data = [{
            z: z,
            x: json.x,
            y: json.y,
            type: 'contour',
            colorbar: {
              title: text.unit,
              titleside: 'top'
            },
            hovertemplate: `%{xaxis.title.text}: %{x}<br>%{yaxis.title.text}: %{y} m<br>${text.title.split(' @')[0]}: %{z} ${text.unit}<extra></extra>`
          }]
          plotProps.layout.xaxis!.title! = {
            text: text.xLabel,
            standoff: 10
          }
          plotProps.layout.yaxis!.title! = {
            text: `${t('StatMean.depth')} (m)`,
            standoff: 5
          }
          plotProps.layout.title = {
            text: text.title,
            y: 0.94
          }
          const newProps = Object.assign({}, plotProps)
          setPlotProps(newProps)
          setOpen(true)
        })
    }
  }, [url, coord])

  return (
    <>
      <RenderIf isTrue={open}>
        <LineChart ref={plotRef} plotProps={plotProps} setOpen={setOpen} />
      </RenderIf>
    </>
  )
}