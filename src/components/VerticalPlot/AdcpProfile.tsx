import { useEffect, useRef, useState, memo } from 'react'
import { LineChart } from 'components/LineChart';
import { PlotParams } from "react-plotly.js";
import { useTranslation } from 'react-i18next';
import { AlertSlide } from 'components/AlertSlide/AlertSlide';
import { VerticalPlotProps, AdcpFeature } from 'types';
import { calSpd, calDir } from 'Utils/UtilsODB';


export const AdcpProfile: React.FC<VerticalPlotProps> = memo(({ lat, lng, mode, parameter, setOpen }) => {
  const ref = useRef(null)
  const { t } = useTranslation()
  const [warning, setWarning] = useState(false)
  const [plotProps, setPlotProps] = useState<PlotParams>({
    data: [],
    layout: {
      width: 400,
      height: 500,
      dragmode: 'zoom',
      hovermode: "y unified",
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
      xaxis2: {
        linewidth: 1,
        color: '#ff7f0e',
        hoverformat: '.3f',
        overlaying: 'x',
      },
      yaxis: {
        showline: true,
        mirror: true,
        title: {
          text: `${t('OdbData.depth')} (m)`,
          standoff: 5,
        },
      },
      font: {
        family: 'Rubik, "Open Sans", verdana, arial, sans-serif'
      }
    },
    config: {
      scrollZoom: true,
      displayModeBar: true,
    }
  })
  const url = `https://ecodata.odb.ntu.edu.tw/api/sadcp?lon0=${lng}&lat0=${lat}&mode=${mode}&dep_mode=exact&format=geojson&append=u,v,count&mean_threshold=10`
  useEffect(() => {
    fetch(url)
      .then(resp => resp.json())
      .then(json => {
        plotProps.layout.title = {
          text: `${lat} \u00B0N, ${lng} \u00B0E`,
          font: {
            size: 12
          },
        }
        if (plotProps.layout.yaxis?.title) {
          plotProps.layout.yaxis.title = { text: `${t('OdbData.depth')} (m)`, standoff: 0 }
        }
        if (plotProps.layout.xaxis?.title) {
          plotProps.layout.xaxis.title = { text: parameter, standoff: 0 }
        }

        json.features.sort((a: AdcpFeature, b: AdcpFeature) => a.properties.depth - b.properties.depth)
        const spd = json.features.map((feature: AdcpFeature) => calSpd(feature.properties.u as number, feature.properties.v as number))
        const dir = json.features.map((feature: AdcpFeature) => calDir(feature.properties.u as number, feature.properties.v as number))
        const y = json.features.map((feature: AdcpFeature) => -feature.properties.depth)
        plotProps.data = [{
          x: spd,
          y: y,
          type: 'scatter',
          name: t(`OdbData.current.spd`),
        }, {
          x: dir,
          y: y,
          type: 'scatter',
          xaxis: 'x2',
          name: t(`OdbData.current.dir`),
        },]

        const newProps = Object.assign({}, plotProps)
        setPlotProps(newProps)
      })
      .catch(() => { })
  }, [url, t])

  return (
    <>
      <LineChart ref={ref} paneName={'ADCPProfile'} plotProps={plotProps} setOpen={setOpen} positionOffset={{ x: -200, y: -125 }} />
      <AlertSlide open={warning} setOpen={setWarning} severity='error'>
        {t('alert.fetchFail')}
      </AlertSlide>
    </>
  )
})