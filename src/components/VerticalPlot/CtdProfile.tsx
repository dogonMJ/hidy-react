import { useEffect, useRef, useState, memo } from 'react'
import { LineChart } from 'components/LineChart';
import { PlotParams } from "react-plotly.js";
import { sortXY } from 'Utils/UtilsODB';
import { Select, MenuItem, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/store';
import { odbCtdSlice } from 'store/slice/odbCtdSlice';
import { AlertSlide } from 'components/AlertSlide/AlertSlide';
import { VerticalPlotProps, CtdFeature, CtdProperties, CtdParameters } from 'types';

interface CustomAxis extends Plotly.LayoutAxis, Plotly.Axis {
  ticklabelposition: "outside" | "inside" | "outside top" | "inside top" | "outside left" | "inside left" | "outside right" | "inside right" | "outside bottom" | "inside bottom"
}
interface CustomLayout extends Plotly.Layout {
  xaxis: Partial<CustomAxis>;
}
interface CustomPlotParams extends PlotParams {
  layout: Partial<CustomLayout>
}

const parameters = ["temperature", "salinity", "density", "fluorescence", "transmission", "oxygen",]

export const CtdProfile: React.FC<VerticalPlotProps> = memo(({ lat, lng, mode, parameter, setOpen }) => {
  const ref = useRef(null)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const x2Par = useSelector((state: RootState) => state.odbCtd.pX2)
  const yPar = useSelector((state: RootState) => state.odbCtd.pY)
  const period = useSelector((state: RootState) => state.odbCtd.period)
  const [warning, setWarning] = useState(false)
  const [plotProps, setPlotProps] = useState<CustomPlotParams>({
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
      showlegend: true,
      legend: {
        orientation: "h",
        x: 0.5,
        y: -0.07,
        xanchor: 'center'
      },
      margin: {
        b: 50,
        t: 50,
        r: 30,
        l: 70
      },
      xaxis: {
        linewidth: 1,
        color: '#1f77b4',
        hoverformat: '.3f',
        side: 'top',
        mirror: true,
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
  const url = `https://ecodata.odb.ntu.edu.tw/api/ctd?lon0=${lng}&lat0=${lat}&mode=${mode}&dep_mode=exact&format=geojson&append=${parameter},${x2Par},${yPar}`
  useEffect(() => {
    fetch(url)
      .then(resp => resp.json())
      .then(json => {
        plotProps.layout.title = {
          text: `${lat} \u00B0N, ${lng} \u00B0E  ${t(`OdbData.${period}`)}`,
          font: {
            size: 12
          }
        }

        if (plotProps.layout.yaxis?.title) {
          plotProps.layout.yaxis.title = { text: `${t(`OdbData.CTD.${yPar}`)}`, standoff: 0 }
        }

        json.features.sort((a: CtdFeature, b: CtdFeature) => a.properties.depth - b.properties.depth)
        const x1 = json.features.map((feature: CtdFeature) => feature.properties[parameter as keyof CtdProperties])
        const y = json.features.map((feature: CtdFeature) => yPar === 'depth' ? -feature.properties.depth : feature.properties[yPar as keyof CtdProperties])

        if (x2Par === 'close') {
          plotProps.data = [{
            x: x1,
            y: y,
            type: 'scatter',
            name: t(`OdbData.CTD.${parameter}`),
            hovertemplate: '%{x}',
          },]

        } else {
          const x2 = json.features.map((feature: CtdFeature) => feature.properties[x2Par as keyof CtdProperties])
          // const y = json.features.map((feature: CtdFeature) => -feature.properties.depth)
          plotProps.data = [{
            x: x1,
            y: y,
            type: 'scatter',
            name: t(`OdbData.CTD.${parameter}`),
          },
          {
            x: x2,
            y: y,
            type: 'scatter',
            xaxis: 'x2',
            name: t(`OdbData.CTD.${x2Par}`),
          }]
        }
        const newProps = Object.assign({}, plotProps)
        setPlotProps(newProps)
      })
      .catch(() => { })
  }, [url, parameter, x2Par, yPar, t])

  return (
    <>
      <Box sx={{ marginLeft: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.CTD.yPar')}
        </Typography>
        <Select
          size='small'
          name='ODB-CTD-prof_y'
          sx={{ marginLeft: 2.1, marginBottom: 2 }}
          defaultValue={'temperature'}
          value={yPar}
          onChange={(event) => dispatch(odbCtdSlice.actions.setProfileYPar(event.target.value as CtdParameters))}
        >
          {['depth', ...parameters].map((par, index) => {
            return <MenuItem key={index} value={par}>{t(`OdbData.CTD.${par}`)}</MenuItem>
          })}
        </Select>
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.CTD.x2Par')}
        </Typography>
        <Select
          size='small'
          name='ODB-CTD-prof_para'
          sx={{ marginLeft: 2.1, marginBottom: 2 }}
          defaultValue={'temperature'}
          value={x2Par}
          onChange={(event) => dispatch(odbCtdSlice.actions.setProfileX2Par(event.target.value as CtdParameters))}
        >
          {['close', ...parameters].map((par, index) => {
            return <MenuItem key={index} value={par}>{t(`OdbData.CTD.${par}`)}</MenuItem>
          })}
        </Select>
      </Box>
      <LineChart ref={ref} paneName={'CTDProfile'} plotProps={plotProps} setOpen={setOpen} positionOffset={{ x: -200, y: -125 }} />
      <AlertSlide open={warning} setOpen={setWarning} severity='error'>
        {t('alert.fetchFail')}
      </AlertSlide>
    </>
  )
})