import { useEffect, useState, SyntheticEvent, ChangeEvent, useMemo } from 'react'
import { renderToString } from 'react-dom/server';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { odbCtdSlice } from 'store/slice/odbCtdSlice';
import { GeoJSON } from 'react-leaflet'
import { Box, Checkbox, Divider, MenuItem, Select, Stack, TextField, Typography, SelectChangeEvent, Button, FormControlLabel } from '@mui/material';
import { FeatureCollection, Point } from 'geojson'
import * as geojson from 'geojson';
import { createIntervalList, findInterval, getColorWithInterval, point2polygon, periodTransform, ctdDepthMeterProps, palettes, defaultCtdRange } from 'Utils/UtilsODB';
import { DepthMeter } from 'components/DepthlMeter';
import { ColorPalette } from 'components/ColorPalette/ColorPalette';
import { CtdProfile } from 'components/VerticalPlot/CtdProfile';
import { RenderIf } from 'components/RenderIf/RenderIf';
import { AlertSlide } from 'components/AlertSlide/AlertSlide';
import { CtdParameters, CtdPeriods, CTDPalette, validatePalette, validateCtdParameters as ctdPar, validatePeriods as periods } from 'types';
import { OpacitySlider } from 'components/OpacitySlider';
import { PanelSlider } from 'components/PanelSlider';
import { ColorPaletteLegend } from 'components/ColorPaletteLegend';

const ctdDepths = ctdDepthMeterProps().ctdDepths
const marks = ctdDepthMeterProps().marks

export const reversePalette = (palette: string[], reverse: boolean) => reverse ? [...palette].reverse() : palette

export const OdbCTD = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const type = useAppSelector(state => state.odbCtd.par)
  const period = useAppSelector(state => state.odbCtd.period)
  const depthMeterValue = useAppSelector(state => state.map.depthMeterValue['odbCtd'])
  const palette = useAppSelector(state => state.odbCtd.palette)
  const mask = useAppSelector(state => state.odbCtd.mask)
  const reverse = useAppSelector(state => state.odbCtd.reverse)
  const interval = useAppSelector(state => state.odbCtd.interval)
  const fixRange = useAppSelector(state => state.odbCtd.fixRange)
  const minmax = useAppSelector(state => state.odbCtd.range)
  const opacity = useAppSelector(state => state.odbCtd.opacity)
  const [ptData, setPtData] = useState({ lat: 121, lng: 20 })
  const [openVertical, setOpenVertical] = useState(false)
  const [warning, setWarning] = useState(false)
  const [data, setData] = useState<any>({ features: {} })

  const depth = ctdDepths[depthMeterValue]
  const mode = periodTransform[period]

  const onEachFeature = (feature: geojson.Feature<geojson.Polygon, any>, layer: any) => {
    const property = feature.properties
    const center = property.center
    const content = (
      <Box>
        {center[1]}, {center[0]}<br />
        {t('OdbData.depth')} (m): {property.depth}<br />
        {t('OdbData.CTD.temperature')}: {property.temperature}<br />
        {t('OdbData.CTD.salinity')}: {property.salinity}<br />
        {t('OdbData.CTD.density')}: {property.density}<br />
        {t('OdbData.CTD.transmission')}: {property.transmission}<br />
        {t('OdbData.CTD.fluorescence')}: {property.fluorescence}<br />
        {t('OdbData.CTD.oxygen')}: {property.oxygen}<br />
        {t('OdbData.count')}: {property.count}
      </Box>
    )
    layer.bindTooltip(renderToString(content))
    layer.on('click', () => {
      setPtData({
        lat: center[1],
        lng: center[0],
      })
      setOpenVertical(true)
    })
  }

  const handlePaletteChange = (event: SelectChangeEvent) => dispatch(odbCtdSlice.actions.setPalette(event.target.value as CTDPalette))
  const handleOpacityChange = (event: Event, newValue: number | number[]) => dispatch(odbCtdSlice.actions.setOpacity(newValue as number))
  const handleIntervalChangeCommitted = (event: SyntheticEvent | Event, newValue: number | number[]) => dispatch(odbCtdSlice.actions.setInterval(newValue as number))
  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (fixRange) {
      ctdPar.forEach((parameter) => {
        dispatch(odbCtdSlice.actions.setRange({ par: parameter, min: Number(event.target.value) }))
      })
    } else {
      dispatch(odbCtdSlice.actions.setRange({ par: type, min: Number(event.target.value) }))
    }
  }
  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (fixRange) {
      ctdPar.forEach((parameter) => {
        dispatch(odbCtdSlice.actions.setRange({ par: parameter, max: Number(event.target.value) }))
      })
    } else {
      dispatch(odbCtdSlice.actions.setRange({ par: type, max: Number(event.target.value) }))
    }
  }
  const handleMinMaxBlur = () => {
    const min = minmax[type].min
    const max = minmax[type].max
    if (min > max) {
      if (fixRange) {
        ctdPar.forEach((parameter) => {
          dispatch(odbCtdSlice.actions.setRange({ par: parameter, min: max, max: min }))
        })
      } else {
        dispatch(odbCtdSlice.actions.setRange({ par: type, min: max, max: min }))
      }
    }
  }
  const handleFixRange = () => {
    if (!fixRange) {
      ctdPar.forEach((parameter) => {
        dispatch(odbCtdSlice.actions.setRange({ par: parameter, min: minmax[type].min, max: minmax[type].max }))
      })
    }
    dispatch(odbCtdSlice.actions.setFixRange(!fixRange))
  }

  const handleDefaultRange = () => {
    dispatch(odbCtdSlice.actions.setFixRange(false))
    ctdPar.forEach((parameter) => {
      dispatch(odbCtdSlice.actions.setRange({ par: parameter, min: defaultCtdRange[parameter].min, max: defaultCtdRange[parameter].max }))
    })
  }

  const handleTypeChange = (event: SelectChangeEvent) => dispatch(odbCtdSlice.actions.setSelection(event.target.value as CtdParameters))
  const handlePeriodChange = (event: SelectChangeEvent) => dispatch(odbCtdSlice.actions.setPeriod(event.target.value as CtdPeriods))
  const handleMask = () => dispatch(odbCtdSlice.actions.setMask(!mask))
  useEffect(() => {
    fetch(`https://ecodata.odb.ntu.edu.tw/api/ctd?lon0=100&lon1=140&lat0=2&lat1=35&dep0=${depth * -1}&dep_mode=exact&mode=${mode}&format=geojson&append=temperature,salinity,density,fluorescence,transmission,oxygen,count`)
      .then((response) => response.json())
      .then((json: FeatureCollection) => {
        json.features.forEach((feature) => {
          const point = feature.geometry as Point
          if (feature.properties) {
            feature.properties['center'] = point.coordinates
          }
          const polygon = point2polygon(point)
          feature.geometry = polygon
        })
        setData(json)
      })
      .catch((e) => setWarning(true))
  }, [t, depth, mode])

  return (
    <>
      <Divider variant="middle" />
      <Box sx={{ margin: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.CTD.selection')}
        </Typography>
        <Stack direction='row' spacing={2} sx={{ ml: 2.1, mb: 2 }}>
          <Select
            labelId="ctdpar-label"
            size='small'
            label='gf'
            value={type}
            onChange={handleTypeChange}
            defaultValue='temperature'
          >
            {
              ctdPar.map((par: string) => {
                return <MenuItem key={`ctd-${par}`} value={par}>{t(`OdbData.CTD.${par}`)}</MenuItem>
              })
            }
          </Select>
          <Select
            size='small'
            value={period}
            onChange={handlePeriodChange}
            defaultValue='avg'
          >
            {
              periods.map((period: string) => {
                return <MenuItem key={`ctd-${period}`} value={period}>{t(`OdbData.${period}`)}</MenuItem>
              })
            }
          </Select>
        </Stack>
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.CTD.segment')}
        </Typography>
        <PanelSlider initValue={interval} min={0} max={30} onChangeCommitted={handleIntervalChangeCommitted} track={false} />
        <Stack direction='row' alignItems='center' marginLeft={0}>
          <Select
            name='ODB-CTD-palette'
            size='small'
            value={palette}
            onChange={handlePaletteChange}
            sx={{ marginLeft: 2.1, marginBottom: 2 }}
          >
            {
              validatePalette.map(color => {
                return <MenuItem key={color} value={color}><ColorPalette palette={reversePalette(palettes[color], reverse)} interval={interval} /></MenuItem>
              })
            }
          </Select>
          <Checkbox id='ODB-CTD-reverse' size="small" sx={{ pr: '2px', pt: '4px' }} checked={reverse} onChange={() => dispatch(odbCtdSlice.actions.setReverse(!reverse))} />
          <Typography variant="caption">
            {t('OdbData.CTD.rev')}
          </Typography>
        </Stack>
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.CTD.thresholds')}
        </Typography>
        <Stack direction='row' spacing={2} sx={{ ml: 2.1, mb: 2 }}>
          <TextField
            label={t('OdbData.min')}
            size="small"
            type="number"
            variant="standard"
            value={minmax[type].min}
            onChange={handleMinChange}
            onBlur={handleMinMaxBlur}
            sx={{
              width: 50
            }}
          />
          <TextField
            label={t('OdbData.max')}
            size="small"
            type="number"
            variant="standard"
            value={minmax[type].max}
            onChange={handleMaxChange}
            onBlur={handleMinMaxBlur}
            sx={{
              width: 50
            }}
          />
          <Stack>
            <Stack direction={'row'} alignItems="center" >
              <FormControlLabel
                label={<Typography variant="caption" >{t('OdbData.CTD.fixRange')}</Typography>}
                control={<Checkbox id='ODB-CTD-fixRange' size="small" sx={{ p: '2px' }} checked={fixRange} onChange={handleFixRange} />}
              />
              <Button
                id='ODB-CTD-defaultRange'
                size="small"
                variant='outlined'
                sx={{
                  height: 20,
                  p: 0,
                  color: 'black',
                  borderColor: 'lightgray',
                  '&:hover': {
                    borderColor: 'lightgrey',
                    bgcolor: 'whitesmoke'
                  },
                }}
                onClick={handleDefaultRange}
              >
                {t('OdbData.CTD.defaultRange')}
              </Button>
            </Stack>
            <FormControlLabel
              label={<Typography variant="caption" >{t('OdbData.CTD.mask')}</Typography>}
              control={<Checkbox id='ODB-CTD-mask' size="small" sx={{ p: '2px' }} checked={mask} onChange={handleMask} />}
            />
          </Stack>
        </Stack>
        <OpacitySlider opacity={opacity} onChange={handleOpacityChange} />
      </Box >
      <GeoJSON
        key={`${depth}_${data.features.length}`}
        data={data}
        onEachFeature={onEachFeature}
        style={(feature: any) => {
          const value = feature.properties[type]
          if (value) {
            const i = findInterval(value, createIntervalList(minmax[type].min, minmax[type].max, interval))
            const colorList = reversePalette(palettes[palette], reverse)
            return {
              color: getColorWithInterval(colorList, interval + 2)[i],
              weight: 0,
              fillOpacity: (mask && (value < minmax[type].min || value > minmax[type].max)) ? 0 : opacity / 100
            }
          } else {
            return {
              weight: 0,
              fillOpacity: 0
            }
          }
        }} />
      <DepthMeter values={ctdDepths} marks={marks} user={'odbCtd'} />
      <ColorPaletteLegend
        palette={reversePalette(palettes[palette], reverse)}
        interval={interval}
        min={minmax[type].min}
        max={minmax[type].max}
        title={t(`OdbData.CTD.${type}`)}
      />
      <RenderIf isTrue={openVertical}>
        <CtdProfile lat={ptData.lat} lng={ptData.lng} mode={mode} parameter={type} setOpen={setOpenVertical} />
      </RenderIf>
      <Divider variant="middle" />
      <AlertSlide open={warning} setOpen={setWarning} severity='error'>
        {t('alert.fetchFail')}
      </AlertSlide>
    </>
  )
}