import { useEffect, useRef, useState } from "react"
import { useMap } from "react-leaflet"
import * as geojson from 'geojson';
import { Box, Typography, Stack, MenuItem, InputLabel, Select, SelectChangeEvent, FormControl, Switch } from '@mui/material'
import { styled } from '@mui/material/styles';
import { useTranslation } from "react-i18next";
import { ProcUrl } from 'layout/DataPanel/StatisticMean/ProcUrl';
import { RenderIf } from "components/RenderIf/RenderIf";
import { TopoJSON } from "components/TopoJSON/TopoJSON";
import { varList } from "./varList"
import InfoButton from "components/InfoButton";

const depths = [0, 10, 20, 30, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500]

const PeriodSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    transform: 'translateX(0px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(20px)',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#8CBBE9',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#1976D2',
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#8CBBE9',
  },
}));

const gridStyle = {
  weight: 2,
  color: '#838383'
}

export const StatisticMean = () => {
  const { t } = useTranslation()
  const map = useMap()
  const [parameter, setParameter] = useState('close')
  const [monthly, setMonthly] = useState(false)
  const [profile, setProfile] = useState(false)
  const [depth, setDepth] = useState(0)
  const [girdLines, setGridLines] = useState<any>()
  const [gridCoord, setGridCoord] = useState<string>('')

  const handleMouseLeave = () => {
    map.scrollWheelZoom.enable()
    map.dragging.enable()
  }
  const handleParameter = (event: SelectChangeEvent) => {
    setParameter(event.target.value)
  }
  const handlePeriodSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonthly(event.target.checked)
  }
  const handleType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(event.target.checked)
  }
  const handleDepth = (event: SelectChangeEvent) => {
    setDepth(Number(event.target.value))
  }

  const styleFunc = () => gridStyle
  const onEachGridLine = (feature: geojson.Feature<geojson.LineString, any>, layer: L.Path) => {
    const dir = Number(feature.properties.title) < 100 ? 'N' : 'E' //暫時，超過範圍再以geometry.coordinate處理
    layer.bindTooltip(`${feature.properties.title} \u00b0${dir}`, { sticky: true })
    layer.on('mouseover', () => {
      layer.setStyle({ color: 'white' })
    })
    layer.on('mouseout', () => {
      layer.setStyle(gridStyle)
    })
    layer.on('click', () => {
      setGridCoord(feature.properties.title.replace('.', ''))
    })
  }

  useEffect(() => {
    fetch('https://odbpo.oc.ntu.edu.tw/static/figs/clim/climgridxy4s.topojson')
      .then((response) => response.json())
      .then((json) => setGridLines(json))
  }, [])

  return (
    <>
      <Box sx={{ margin: 1 }}>
        <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
          <InputLabel >{t('StatMean.parameter')}</InputLabel>
          <Select
            value={parameter}
            label="Parameters"
            onChange={handleParameter}
          >
            {Object.keys(varList).map((par: string, id: number) => {
              const unit = varList[par].unit === '' ? '' : `(${varList[par].unit})`
              return <MenuItem key={id} value={par} onMouseLeave={handleMouseLeave}>{`${t(varList[par].name)} ${unit}`}</MenuItem>
            })}
          </Select>
        </FormControl>
        <Stack direction="row" spacing={1} alignItems="center">
          <InfoButton dataId="StatMeanLongterm" />
          <Typography style={{ marginLeft: -5 }}>{t('StatMean.longterm')}</Typography>
          <PeriodSwitch onChange={handlePeriodSwitch} />
          <Typography>{t('StatMean.monthly')}</Typography>
          <InfoButton dataId="StatMeanMonthly" />
        </Stack>
      </Box>
      <RenderIf isTrue={varList[parameter].name !== 'StatMean.close'}>
        <ProcUrl parameter={parameter} depth={depth} monthly={monthly} profile={profile} coord={gridCoord} />
      </RenderIf>
      <Box sx={{ margin: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <InfoButton dataId="StatMeanContour" />
          <Typography style={{ marginLeft: -5 }}>{t('StatMean.contour')}</Typography>
          <PeriodSwitch onChange={handleType} />
          <Typography>{t('StatMean.profile')}</Typography>
          <InfoButton dataId="StatMeanProfile" />
        </Stack>
      </Box>
      <RenderIf isTrue={!profile && varList[parameter].name !== 'StatMean.close'}>
        <Box sx={{ margin: 1 }}>
          <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
            <InputLabel >{t('StatMean.depth')}</InputLabel>
            <Select
              value={depth.toString()}
              label="Depths"
              onChange={handleDepth}
            >
              {depths.map((dep: number, id: number) => {
                return <MenuItem key={id} value={dep} onMouseLeave={handleMouseLeave}>{dep} m</MenuItem>
              })}
            </Select>
          </FormControl>
        </Box>
      </RenderIf>
      <RenderIf isTrue={profile && varList[parameter].name !== 'StatMean.close'}>
        <TopoJSON data={girdLines} style={styleFunc} onEachFeature={onEachGridLine} />
      </RenderIf>
    </>
  )
}