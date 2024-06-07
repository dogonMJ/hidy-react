import { useEffect, useState } from "react"
import * as geojson from 'geojson';
import { Box, Typography, Stack, MenuItem, InputLabel, Select, SelectChangeEvent, FormControl } from '@mui/material'
import { useTranslation } from "react-i18next";
import { ProcUrl } from 'layout/DataPanel/StatisticMean/ProcUrl';
import { RenderIf } from "components/RenderIf/RenderIf";
import { TopoJSON } from "components/TopoJSON/TopoJSON";
import { varList, longtermDepths as depths } from "./varList"
import InfoButton from "components/InfoButton";
import { SwitchSameColor } from "components/SwitchSameColor";
import { useMapDragScroll } from "hooks/useMapDragScroll";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { longtermSlice } from "store/slice/longtermSlice";
import { useSingleComponentCheck } from "hooks/useSingleComponentCheck";
import { LongtermPar } from "types";

const PeriodSwitch = SwitchSameColor()
const gridStyle = {
  weight: 2,
  color: '#838383'
}

export const StatisticMean = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { setDrag } = useMapDragScroll()
  const { addCheckedComponent, removeCheckedComponent } = useSingleComponentCheck()
  const parameter = useAppSelector(state => state.longterm.par)
  const monthly = useAppSelector(state => state.longterm.monthly)
  const profile = useAppSelector(state => state.longterm.profile)
  const depth = useAppSelector(state => state.longterm.depth)
  const gridCoord = useAppSelector(state => state.longterm.coord)
  const [girdLines, setGridLines] = useState<any>()

  const handleMouseLeave = () => setDrag(true)
  const handleParameter = (event: SelectChangeEvent) => {
    dispatch(longtermSlice.actions.setPar(event.target.value as LongtermPar))
    event.target.value === 'close' ? removeCheckedComponent('longterm') : addCheckedComponent('longterm')
  }
  const handlePeriodSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(longtermSlice.actions.setMonthly(event.target.checked))
  }
  const handleType = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(longtermSlice.actions.setProfile(event.target.checked))
  }
  const handleDepth = (event: SelectChangeEvent) => {
    dispatch(longtermSlice.actions.setDepth(Number(event.target.value)))
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
      dispatch(longtermSlice.actions.setCoord(feature.properties.title.replace('.', '')))
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
          <InputLabel id="statmean-para-label">{t('StatMean.parameter')}</InputLabel>
          <Select
            labelId="statmean-para-label"
            id="statmean-para-select"
            name="statmean-parameter"
            value={parameter}
            label={t('StatMean.parameter')}
            onChange={handleParameter}
          >
            {Object.keys(varList).map((par: string, id: number) => {
              const typedPar = par as LongtermPar
              const unit = varList[typedPar].unit === '' ? '' : `(${varList[typedPar].unit})`
              return <MenuItem key={id} value={par} onMouseLeave={handleMouseLeave}>{`${t(varList[typedPar].name)} ${unit}`}</MenuItem>
            })}
          </Select>
        </FormControl>
        <Stack direction="row" spacing={1} alignItems="center">
          <InfoButton dataId="StatMeanLongterm" />
          <Typography style={{ marginLeft: -5 }}>{t('StatMean.longterm')}</Typography>
          <PeriodSwitch id={`switch-statmena-period`} onChange={handlePeriodSwitch} checked={monthly} />
          <Typography>{t('StatMean.monthly')}</Typography>
          <InfoButton dataId="StatMeanMonthly" />
        </Stack>
      </Box >
      <RenderIf isTrue={varList[parameter].name !== 'StatMean.close'}>
        <ProcUrl parameter={parameter} depth={depth} monthly={monthly} profile={profile} coord={gridCoord} />
      </RenderIf>
      <Box sx={{ margin: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <InfoButton dataId="StatMeanContour" />
          <Typography style={{ marginLeft: -5 }}>{t('StatMean.contour')}</Typography>
          <PeriodSwitch id={`switch-statmena-type`} onChange={handleType} checked={profile} />
          <Typography>{t('StatMean.profile')}</Typography>
          <InfoButton dataId="StatMeanProfile" />
        </Stack>
      </Box>
      <RenderIf isTrue={!profile && varList[parameter].name !== 'StatMean.close'}>
        <Box sx={{ margin: 1 }}>
          <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
            <InputLabel id="statmean-depth-label">{t('StatMean.depth')}</InputLabel>
            <Select
              name="statmean-depth"
              labelId="statmean-depth-label"
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