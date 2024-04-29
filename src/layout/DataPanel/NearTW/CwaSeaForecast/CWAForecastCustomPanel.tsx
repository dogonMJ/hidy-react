import { SyntheticEvent, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { Box, Checkbox, Divider, MenuItem, Select, Stack, Typography, SelectChangeEvent, FormControlLabel } from '@mui/material';
import { ColorPalette } from 'components/ColorPalette/ColorPalette';
import { CTDPalette, MinMax } from 'types';
import { OpacitySlider } from 'components/OpacitySlider';
import { PanelSlider } from 'components/PanelSlider';
import { cwaForecastSlice } from 'store/slice/cwaForecastSlice';
import { reversePalette } from 'layout/DataPanel/ODB/OdbCTD';
import CMEMSPalettes from "assets/jsons/CMEMS_cmap.json"
import { CWADefaults } from 'store/slice/cwaForecastSlice';
import { DefaultRangeButton } from 'components/DefaultRangeButton';
import { PanelMinMaxField } from 'components/PanelMinMaxField/PanelMinMaxField';
interface CWACustomPanelProps {
  identifier: string
}

export const CWAForecastCustomPanel = (props: CWACustomPanelProps) => {
  const { identifier } = props
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const customs = useAppSelector(state => state.cwaForecast[identifier])
  const opacity = customs.opacity
  const palette = customs.palette
  const inverse = customs.inverse
  const mask = customs.mask
  const min = customs.min
  const max = customs.max
  const [panelRange, setPanelRange] = useState<MinMax>({ min: min, max: max })
  const [opacitySlider, setOpacitySlider] = useState(opacity ?? 100)

  const handleOpacityCommitted = (event: SyntheticEvent | Event, newValue: number | number[]) => dispatch(cwaForecastSlice.actions.setOpacity({ identifier, opacity: opacitySlider }))
  const handleOpacityChange = (event: Event, newValue: number | number[]) => setOpacitySlider(newValue as number)
  const handlePaletteChange = (event: SelectChangeEvent) => dispatch(cwaForecastSlice.actions.setPalette({ identifier, palette: event.target.value as CTDPalette }))
  const handleMask = () => {
    dispatch(cwaForecastSlice.actions.setMask({ identifier, mask: !mask }))
  }
  const handleDefaultRange = () => {
    const defaultMin = CWADefaults[identifier].min
    const defaultMax = CWADefaults[identifier].max
    setPanelRange({ min: defaultMin, max: defaultMax })
    dispatch(cwaForecastSlice.actions.setRange({ identifier, min: defaultMin, max: defaultMax }))
  }
  const setRange = ({ min, max }: MinMax) => {
    dispatch(cwaForecastSlice.actions.setRange({ identifier, min: min, max: max }))
  }
  return (
    <>
      <Divider variant="middle" />
      <Box sx={{ margin: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.CTD.segment')}
        </Typography>
        {/* <PanelSlider initValue={interval} min={0} max={30} onChangeCommitted={handleIntervalChangeCommitted} track={false} /> */}
        <Stack direction='row' alignItems='center' marginLeft={0}>
          <Select
            name='CWA-palette'
            size='small'
            value={palette}
            onChange={handlePaletteChange}
            sx={{ marginLeft: 2.1, marginBottom: 2 }}
          >
            {
              Object.keys(CMEMSPalettes).map(color => {
                return (
                  <MenuItem key={color} value={color} title={color}>
                    <ColorPalette palette={reversePalette(CMEMSPalettes[color as keyof typeof CMEMSPalettes], inverse)} />
                  </MenuItem>
                )
              })
            }
          </Select>
          <Checkbox
            id='CWA-inverse'
            size="small"
            sx={{ pr: '2px', pt: '4px' }}
            checked={inverse}
            onChange={() => dispatch(cwaForecastSlice.actions.setIeverse({ identifier, inverse: !inverse }))} />
          <Typography variant="caption">
            {t('OdbData.CTD.rev')}
          </Typography>
        </Stack>
        <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.CTD.thresholds')}
        </Typography>
        <Stack direction='row' spacing={2} sx={{ ml: 2.1, mb: 2 }}>
          <PanelMinMaxField inputRange={panelRange} setInputRange={setPanelRange} setRange={setRange} />
          <Stack>
            <DefaultRangeButton setRange={handleDefaultRange} />
            <FormControlLabel
              label={<Typography variant="caption" >{t('OdbData.CTD.mask')}</Typography>}
              control={<Checkbox id='CWA-mask' size="small" sx={{ p: '2px' }} checked={mask} onChange={handleMask} />}
            />
          </Stack>
        </Stack>
        <OpacitySlider opacity={opacitySlider} onChange={handleOpacityChange} onChangeCommitted={handleOpacityCommitted} />
      </Box >
    </>
  )
}