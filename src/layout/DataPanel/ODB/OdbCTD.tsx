import { useEffect, useRef, useState, SyntheticEvent, ChangeEvent, memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store"
import { odbCtdSlice } from 'store/slice/odbCtdSlice';
import { GeoJSON } from 'react-leaflet'
import { Box, Checkbox, Divider, MenuItem, Select, Slider, Stack, TextField, Typography, SelectChangeEvent } from '@mui/material';
import { FeatureCollection, Point } from 'geojson'
import { createIntervalList, findInterval, getColorWithInterval, point2polygon, periodTransform, ctdDepthMeterProps, palettes } from 'Utils/UtilsODB';
import { DepthMeter } from 'components/DepthlMeter';
import { LegendControl } from 'components/LeafletLegend';
import { ColorPalette } from 'components/ColorPalette/ColorPalette';
import * as geojson from 'geojson';
import { renderToString } from 'react-dom/server';
import { VerticalPlot } from 'components/VerticalPlot/VerticalPlot';
import { RenderIf } from 'components/RenderIf/RenderIf';
import { AlertSlide } from 'components/AlertSlide/AlertSlide';
import { Palette } from 'types';


const ctdDepths = ctdDepthMeterProps().ctdDepths
const marks = ctdDepthMeterProps().marks

const LegendCTD = memo((props: { palette: string[], interval: number, min: number, max: number, title: string }) => {
  const { palette, interval, min, max, title } = props
  const fullWidth = 180
  const offset = interval ? fullWidth / (interval + 2) : fullWidth / 2
  return (
    <Box>
      <Typography variant="caption">{title}</Typography>
      <ColorPalette palette={palette} interval={interval} fullLength={fullWidth} />
      <Stack
        direction={'row'}
        justifyContent="space-between"
        alignItems="baseline"
        spacing={2}
      >
        <Box m={0} paddingLeft={`${offset - 10}px`} width={'20px'} textAlign={'center'}>
          {min}
        </Box>
        {interval !== 0 &&
          <Box m={0} paddingRight={`${offset - 10}px`} width={'20px'} textAlign={'center'}>
            {max}
          </Box>
        }
      </Stack>
    </Box>
  )
})

const reversePalette = (palette: string[], reverse: boolean) => reverse ? [...palette].reverse() : palette

export const OdbCTD = () => {
  const ref = useRef<any>()
  const hasEffectRun = useRef<{ [key: string]: boolean }>({ temperature: true, salinity: false, });
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const type = useSelector((state: RootState) => state.odbCtdStates.selection)
  const period = useSelector((state: RootState) => state.coordInput.OdbCurSelection)
  const depthMeterValue = useSelector((state: RootState) => state.coordInput.depthMeterValue)
  const palette = useSelector((state: RootState) => state.odbCtdStates.palette)
  const mask = useSelector((state: RootState) => state.odbCtdStates.mask)
  const reverse = useSelector((state: RootState) => state.odbCtdStates.reverse)
  const interval = useSelector((state: RootState) => state.odbCtdStates.interval)
  const minValue = useSelector((state: RootState) => state.odbCtdStates.min)
  const maxValue = useSelector((state: RootState) => state.odbCtdStates.max)
  const opacity = useSelector((state: RootState) => state.odbCtdStates.opacity)
  const [data, setData] = useState<any>()
  const [sliderInterval, setSliderInterval] = useState(interval)
  const [ptData, setPtData] = useState({ lat: 121, lng: 20 })
  const [openVertical, setOpenVertical] = useState(false)
  const [warning, setWarning] = useState(false)

  const depth = depthMeterValue >= 0 ? ctdDepths[depthMeterValue] : ctdDepths[ctdDepths.length - 1]
  const mode = periodTransform[period]
  const legend = useMemo(() =>
    <LegendControl
      position='bottomleft'
      legendContent={
        <LegendCTD
          palette={reversePalette(palettes[palette], reverse)}
          interval={interval}
          min={minValue}
          max={maxValue}
          title={t(`OdbData.CTD.${type}`)}
        />
      }
    />
    , [palette, interval, maxValue, minValue, type, reverse, t])

  const onEachFeature = (feature: geojson.Feature<geojson.Polygon, any>, layer: any) => {
    const property = feature.properties
    const center = property.center
    const content = (
      <Box>
        {center[1]}, {center[0]}<br />
        {t('OdbData.depth')}: {property.depth} m<br />
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

  const handlePaletteChange = (event: SelectChangeEvent) => dispatch(odbCtdSlice.actions.Palette(event.target.value as Palette))
  const handleOpacityChange = (event: Event, newValue: number | number[]) => dispatch(odbCtdSlice.actions.Opacity(newValue as number))
  const handleIntervalChange = (event: Event, newValue: number | number[]) => setSliderInterval(newValue as number)
  const handleIntervalChangeCommitted = (event: SyntheticEvent | Event, newValue: number | number[]) => dispatch(odbCtdSlice.actions.Interval(newValue as number))
  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => dispatch(odbCtdSlice.actions.Min(Number(event.target.value)))
  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => dispatch(odbCtdSlice.actions.Max(Number(event.target.value)))
  const handleMinMaxBlur = () => {
    if (minValue > maxValue) {
      dispatch(odbCtdSlice.actions.Min(Number(maxValue)))
      dispatch(odbCtdSlice.actions.Max(Number(minValue)))
    }
  }

  useEffect(() => {
    if (!hasEffectRun.current[type]) {
      //default value
      switch (type) {
        case 'salinity':
          dispatch(odbCtdSlice.actions.Min(34))
          dispatch(odbCtdSlice.actions.Max(35))
          break
        case 'density':
          dispatch(odbCtdSlice.actions.Min(21))
          dispatch(odbCtdSlice.actions.Max(28))
          break
        case 'transmission':
          dispatch(odbCtdSlice.actions.Min(0))
          dispatch(odbCtdSlice.actions.Max(100))
          break
        case 'fluorescence':
          dispatch(odbCtdSlice.actions.Min(0))
          dispatch(odbCtdSlice.actions.Max(0.3))
          break
        case 'oxygen':
          dispatch(odbCtdSlice.actions.Min(50))
          dispatch(odbCtdSlice.actions.Max(220))
          break
      }
      hasEffectRun.current[type] = true
    }
  }, [type])
  useEffect(() => {
    fetch(`https://ecodata.odb.ntu.edu.tw/api/ctd?lon0=100&lon1=140&lat0=2&lat1=35&dep0=${depth}&dep_mode=exact&mode=${mode}&format=geojson&append=temperature,salinity,density,fluorescence,transmission,oxygen,count`)
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
        ref.current.clearLayers()
        ref.current.addData(json)
      })
      .catch((e) => setWarning(true))
  }, [t, depth, mode])

  return (
    <>
      <Divider variant="middle" />
      <Box sx={{ margin: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.CTD.segment')}
        </Typography>
        <Slider
          value={sliderInterval}
          onChange={handleIntervalChange}
          onChangeCommitted={handleIntervalChangeCommitted}
          min={0}
          max={30}
          valueLabelDisplay="auto"
          marks
          track={false}
          sx={{ width: '85%', marginLeft: 2.1 }}
        />
        <Stack direction='row' alignItems='center' marginLeft={0}>
          <Select
            name='ODB-CTD-palette'
            size='small'
            value={palette}
            onChange={handlePaletteChange}
            sx={{ marginLeft: 2.1, marginBottom: 2 }}
          >
            <MenuItem value='plasma'><ColorPalette palette={reversePalette(palettes['plasma'], reverse)} interval={interval} /></MenuItem>
            <MenuItem value='viridis'><ColorPalette palette={reversePalette(palettes['viridis'], reverse)} interval={interval} /></MenuItem>
            <MenuItem value='magma'><ColorPalette palette={reversePalette(palettes['magma'], reverse)} interval={interval} /></MenuItem>
            <MenuItem value='coolwarm'><ColorPalette palette={reversePalette(palettes['coolwarm'], reverse)} interval={interval} /></MenuItem>
            <MenuItem value='bwr'><ColorPalette palette={reversePalette(palettes['bwr'], reverse)} interval={interval} /></MenuItem>
            <MenuItem value='jet'><ColorPalette palette={reversePalette(palettes['jet'], reverse)} interval={interval} /></MenuItem>
            <MenuItem value='YlGnBu'><ColorPalette palette={reversePalette(palettes['YlGnBu'], reverse)} interval={interval} /></MenuItem>
            <MenuItem value='YlOrRd'><ColorPalette palette={reversePalette(palettes['YlOrRd'], reverse)} interval={interval} /></MenuItem>
          </Select>
          <Checkbox id='ODB-CTD-reverse' size="small" sx={{ pr: '2px', pt: '4px' }} checked={reverse} onChange={() => dispatch(odbCtdSlice.actions.Reverse(!reverse))} />
          <Typography variant="caption">
            {t('OdbData.CTD.rev')}
          </Typography>
        </Stack>
        <Stack direction='row' spacing={4}>
          <Typography variant="subtitle2" gutterBottom>
            {t('OdbData.CTD.thresholds')}
          </Typography>
          <TextField
            label={t('OdbData.min')}
            size="small"
            type="number"
            variant="standard"
            value={minValue}
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
            value={maxValue}
            onChange={handleMaxChange}
            onBlur={handleMinMaxBlur}
            sx={{
              width: 50
            }}
          />
        </Stack>
        <Stack direction='row' alignItems='center' marginLeft={9}>
          <Checkbox id='ODB-CTD-mask' size="small" sx={{ pr: '2px', pt: '4px' }} checked={mask} onChange={() => dispatch(odbCtdSlice.actions.Mask(!mask))} />
          <Typography variant="caption" >
            {t('OdbData.CTD.mask')}
          </Typography>
        </Stack>
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.CTD.opacity')}
        </Typography>
        <Slider
          value={opacity}
          onChange={handleOpacityChange}
          min={0}
          max={100}
          step={1}
          defaultValue={100}
          valueLabelDisplay="auto"
          sx={{ width: '85%', marginLeft: 2.1 }}
        />
      </Box>
      <GeoJSON
        ref={ref}
        data={data}
        onEachFeature={onEachFeature}
        style={(feature: any) => {
          const properties = feature.properties
          const value = properties[type]
          if (value) {
            const i = findInterval(value, createIntervalList(minValue, maxValue, interval))
            const colorList = reversePalette(palettes[palette], reverse)
            return {
              color: getColorWithInterval(colorList, interval + 2)[i],
              weight: 0,
              fillOpacity: (mask && (value < minValue || value > maxValue)) ? 0 : opacity / 100
            }
          } else {
            return {
              weight: 0,
              fillOpacity: 0
            }
          }
        }} />
      <DepthMeter values={ctdDepths} marks={marks} />
      {legend}
      <RenderIf isTrue={openVertical}>
        <VerticalPlot lat={ptData.lat} lng={ptData.lng} mode={mode} parameter={type} setOpen={setOpenVertical} />
      </RenderIf>
      <Divider variant="middle" />
      <AlertSlide open={warning} setOpen={setWarning} severity='error'>
        {t('alert.fetchFail')}
      </AlertSlide>
    </>
  )
}