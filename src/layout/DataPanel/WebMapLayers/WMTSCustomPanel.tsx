// import wmList from 'assets/jsons/WebMapsList.json'
import { Box, Button, Checkbox, Divider, FormControlLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material"
import { OpacitySlider } from "components/OpacitySlider"
import { ChangeEvent, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { cmemsList } from "./cmemsWMTSList"
import CMEMSPalettes from "assets/jsons/CMEMS_cmap.json"
import { ColorPalette } from "components/ColorPalette/ColorPalette"
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks"
import { WmProps, webmapSlice } from "store/slice/webmapSlice"

const cmapKey = ["algae", "amp", "balance", "cividis", "cyclic", "delta", "dense", "gray", "haline", "ice", "inferno", "magma", "matter",
  "plasma", "rainbow", "solar", "speed", "tempo", "thermal", "viridis"] as const
export type CMEMSPalette = typeof cmapKey[number];
export const isCMEMSPalette = (p: any): p is CMEMSPalette => cmapKey.includes(p)

interface WMTSCustomPanelProps {
  identifier: string
}
export const WMTSCustomPanel = (props: WMTSCustomPanelProps) => {
  const { identifier } = props
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const wmProps = useAppSelector(state => state.wm.wmProps)
  const palette = wmProps[identifier]?.cmap ?? ''
  const opacity = wmProps[identifier]?.opacity ?? 100
  const mask = wmProps[identifier]?.mask ?? false
  const inverse = wmProps[identifier]?.inverse ?? false
  const range = wmProps[identifier]?.range ?? { min: 0, max: 0 }
  const [inputRange, setInputRange] = useState(identifier === 'close' ? { min: 0, max: 0 } : range)

  const handleMask = () => {
    const newWmProps: WmProps = Object.assign({}, { ...wmProps[identifier], mask: !mask })
    dispatch(webmapSlice.actions.setWmProps({ identifier, newWmProps }))
  }
  const handleInverse = () => {
    const newWmProps: WmProps = Object.assign({}, { ...wmProps[identifier], inverse: !inverse })
    dispatch(webmapSlice.actions.setWmProps({ identifier, newWmProps }))
  }
  const handleOpacityChange = (event: Event, newValue: number | number[]) => {
    const value = newValue as number
    const newWmProps: WmProps = Object.assign({}, { ...wmProps[identifier], opacity: value })
    dispatch(webmapSlice.actions.setWmProps({ identifier, newWmProps }))
  }
  const handlePaletteChange = (event: SelectChangeEvent) => {
    const value = event.target.value as CMEMSPalette
    const newWmProps: WmProps = Object.assign({}, { ...wmProps[identifier], cmap: value })
    dispatch(webmapSlice.actions.setWmProps({ identifier, newWmProps }))
  }

  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputRange({ min: Number(event.target.value), max: range.max })
  }
  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputRange({ min: range.min, max: Number(event.target.value) })
  }
  const handleMinMaxBlur = () => {
    const min = inputRange.min
    const max = inputRange.max
    if (min > max) {
      const newRange = { min: max, max: min }
      setInputRange(newRange)
      const newWmProps: WmProps = Object.assign({}, { ...wmProps[identifier], range: newRange })
      dispatch(webmapSlice.actions.setWmProps({ identifier, newWmProps }))
    } else {
      const newRange = { min: min, max: max }
      const newWmProps: WmProps = Object.assign({}, { ...wmProps[identifier], range: newRange })
      dispatch(webmapSlice.actions.setWmProps({ identifier, newWmProps }))
    }
  }
  const handleDefaultRange = () => {
    const defaultRange = cmemsList[identifier].defaults.range
    setInputRange(defaultRange)
    const newWmProps: WmProps = Object.assign({}, { ...wmProps[identifier], range: defaultRange })
    dispatch(webmapSlice.actions.setWmProps({ identifier, newWmProps }))
  }

  return (
    <>
      <Divider variant="middle" />
      <Box sx={{ margin: 2 }}>
        {/* <Typography variant="subtitle2" gutterBottom>
          {t('OdbData.wm.selection')}
        </Typography> */}
        <Typography variant="subtitle2" gutterBottom>
          {t('wm.palette')}
        </Typography>
        <Stack direction='row' alignItems='center' marginLeft={0}>
          <Select
            name='CMEMS-palette'
            size='small'
            value={palette}
            onChange={handlePaletteChange}
            sx={{ marginLeft: 2.1, marginBottom: 2 }}
          >
            {
              cmapKey.map(color => {
                return (
                  <MenuItem key={color} value={color} title={color}>
                    <ColorPalette palette={CMEMSPalettes[color as keyof typeof CMEMSPalettes]} fullLength={180} />
                  </MenuItem>
                )
              })
            }
          </Select>
          <Checkbox id='CMEMS-inverse' size="small" sx={{ pr: '2px', pt: '4px' }} checked={inverse} onChange={handleInverse} />
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
            value={inputRange.min}
            onChange={handleMinChange}
            onBlur={handleMinMaxBlur}
            onKeyDown={(ev) => {
              if (ev.key.toLowerCase() === 'enter') {
                handleMinMaxBlur()
              }
            }}
            sx={{ width: 70 }}
          />
          <TextField
            label={t('OdbData.max')}
            size="small"
            type="number"
            variant="standard"
            value={inputRange.max}
            onChange={handleMaxChange}
            onBlur={handleMinMaxBlur}
            onKeyDown={(ev) => {
              if (ev.key.toLowerCase() === 'enter') {
                handleMinMaxBlur()
              }
            }}
            sx={{ width: 70 }}
          />
          <Stack>
            <Button
              id='ODB-CMEMS-defaultRange'
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
            <FormControlLabel
              label={<Typography variant="caption" >{t('OdbData.CTD.mask')}</Typography>}
              control={<Checkbox id='ODB-CTD-mask' size="small" sx={{ p: '2px' }} checked={mask} onChange={handleMask} />}
            />
          </Stack>
        </Stack>
        <OpacitySlider opacity={opacity} onChange={handleOpacityChange} />
      </Box >
      <Divider variant="middle" />
    </>
  )
}