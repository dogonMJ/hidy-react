import { useEffect, useRef, useState } from "react"
import { LineChart } from "components/LineChart"
import { PlotParams } from "react-plotly.js";
import { RenderIf } from "components/RenderIf/RenderIf";
import { useTranslation } from "react-i18next";
import { calSpd } from "Utils/UtilsODB";
import { FeaturedPlayList } from "@mui/icons-material";
import { feature } from "topojson-client";
interface AdcpJsonFeature {
  latitude: number
  longitude: number
  depth: number
  u: number
  v: number
  time_period: string
}

export const LineProfile = (props: { url: string, text: { [key: string]: string } }) => {
  const { url, text } = props
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const plotRef = useRef<any>()
  const [plotProps, setPlotProps] = useState<PlotParams>({
    data: [],
    layout: {
      width: 800,
      height: 300,
      dragmode: 'zoom',
      hovermode: 'closest',
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
        // fixedrange: true,
      },
      yaxis: {
        title: {
          text: `${t('StatMean.depth')} (m)`,
          standoff: 5
        },
      }
    },
    config: {
      scrollZoom: true,
      displayModeBar: true,
    }
  })
  useEffect(() => {
    if (url) {
      fetch(url)
        .then((response) => response.json())
        .then((json) => {
          //限制500公尺內
          const y = [...new Set(json.filter((feature: AdcpJsonFeature) => Number(feature.depth) <= 500 ? true : false)
            .map((feature: AdcpJsonFeature) => -Number(feature.depth)) as number[])]
            .sort((a, b) => a - b)
          const xs = json.map((feature: AdcpJsonFeature) => Number(feature.longitude)) as number[]
          const min = Math.min(...xs)
          const max = Math.max(...xs)
          const x = Array.from({ length: Math.floor((max - min) / 0.25) + 1 }, (_, index) => min + index * 0.25);
          const spd: any[] = []
          json.forEach((feature: any) => {
            const iy = y.indexOf(-feature.depth)
            const ix = x.indexOf(feature.longitude)
            if (!spd[iy]) {
              spd[iy] = new Array(x.length).fill(null);
            }
            // spd[iy][ix] = calSpd(feature.v, feature.u);
            spd[iy][ix] = feature.v;
          })
          plotProps.data = [{
            z: spd,
            x: x,
            y: y,
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
  }, [url, t])

  return (
    <>
      <RenderIf isTrue={open}>
        <LineChart ref={plotRef} paneName="Profile" plotProps={plotProps} setOpen={setOpen} />
      </RenderIf>
    </>
  )
}
