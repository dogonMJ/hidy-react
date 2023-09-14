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

interface VerticalPlotProps {
  lat: number
  lng: number
  mode: string
  parameter: string
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

const parameters = ["temperature", "salinity", "density", "fluorescence", "transmission", "oxygen",]

export const VerticalPlot: React.FC<VerticalPlotProps> = memo(({ lat, lng, mode, parameter, setOpen }) => {
  const ref = useRef(null)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const secondPar = useSelector((state: RootState) => state.odbCtdStates.profileSecondPar)
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
    },
    config: {
      scrollZoom: true,
      displayModeBar: true,
    }
  })
  const url = `https://ecodata.odb.ntu.edu.tw/api/ctd?lon0=${lng}&lat0=${lat}&mode=${mode}&dep_mode=exact&format=geojson&append=${parameter},${secondPar}`
  useEffect(() => {
    fetch(url)
      .then(resp => resp.json())
      .then(json => {
        plotProps.layout.title = {
          text: `${lat} \u00B0N, ${lng} \u00B0E`,
          font: {
            size: 12
          }
        }
        if (plotProps.layout.yaxis?.title) {
          plotProps.layout.yaxis.title = { text: `${t('OdbData.depth')} (m)`, standoff: 0 }
        }
        if (plotProps.layout.xaxis?.title) {
          plotProps.layout.xaxis.title = { text: parameter, standoff: 0 }
        }
        if (plotProps.layout.xaxis2?.title) {
          plotProps.layout.xaxis2.title = { text: secondPar, standoff: 0 }
        }
        const pairs: any = []
        const pairs2: any = []
        json.features.forEach((feature: any) => {
          pairs.push({ x: feature.properties[parameter], y: feature.properties.depth })
          pairs2.push({ x: feature.properties[secondPar], y: feature.properties.depth })
        })
        const main = sortXY(pairs)
        const sub = sortXY(pairs2)
        plotProps.data = [{
          x: main.x,
          y: main.y,
          type: 'scatter',
          name: t(`OdbData.CTD.${parameter}`),
        },
        {
          x: sub.x,
          y: sub.y,
          type: 'scatter',
          xaxis: 'x2',
          name: t(`OdbData.CTD.${secondPar}`),
        }
        ]
        const newProps = Object.assign({}, plotProps)
        setPlotProps(newProps)
      })
      .catch(() => { })
  }, [url, parameter, secondPar, t])

  return (
    <>
      <Box sx={{ marginLeft: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.CTD.secondPar')}
        </Typography>
        <Select
          size='small'
          name='ODB-CTD-prof_para'
          sx={{ marginLeft: 2.1, marginBottom: 2 }}
          defaultValue={'temperature'}
          value={secondPar}
          onChange={(event) => dispatch(odbCtdSlice.actions.ProfileSecondPar(event.target.value))}
        >
          {parameters.map((par, index) => {
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