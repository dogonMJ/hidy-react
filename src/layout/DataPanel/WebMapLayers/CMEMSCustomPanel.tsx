// import wmList from 'assets/jsons/WebMapsList.json'
import { Box, Button, Checkbox, Divider, FormControlLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material"
import { OpacitySlider } from "components/OpacitySlider"
import { ChangeEvent, useState } from "react"
import { useTranslation } from "react-i18next"
import { cmemsList } from "./WMTSList"
import CMEMSPalettes from "assets/jsons/CMEMS_cmap.json"
import { ColorPalette } from "components/ColorPalette/ColorPalette"
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks"
import { WmProps, webmapSlice } from "store/slice/webmapSlice"
import { reversePalette } from "../ODB/OdbCTD"
import { DefaultRangeButton } from "components/DefaultRangeButton"
import { PanelMinMaxField } from "components/PanelMinMaxField/PanelMinMaxField"
import { MinMax } from "types"

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
  const wmProps = useAppSelector(state => state.webmap[identifier])
  const palette = wmProps?.cmap ?? ''
  const opacity = wmProps?.opacity ?? 100
  const noClamp = wmProps?.noClamp ?? false
  const inverse = wmProps?.inverse ?? false
  const min = wmProps?.min ?? 0
  const max = wmProps?.max ?? 0
  const [panelRange, setPanelRange] = useState(identifier === 'close' ? { min: 0, max: 0 } : { min: min, max: max })

  const handleMask = () => {
    const newWmProps: WmProps = Object.assign({}, { ...wmProps, noClamp: !noClamp })
    dispatch(webmapSlice.actions.setWmProps({ identifier, newWmProps }))
  }
  const handleInverse = () => {
    const newWmProps: WmProps = Object.assign({}, { ...wmProps, inverse: !inverse })
    dispatch(webmapSlice.actions.setWmProps({ identifier, newWmProps }))
  }
  const handleOpacityChange = (event: Event, newValue: number | number[]) => {
    const value = newValue as number
    const newWmProps: WmProps = Object.assign({}, { ...wmProps, opacity: value })
    dispatch(webmapSlice.actions.setWmProps({ identifier, newWmProps }))
  }
  const handlePaletteChange = (event: SelectChangeEvent) => {
    const value = event.target.value as CMEMSPalette
    const newWmProps: WmProps = Object.assign({}, { ...wmProps, cmap: value })
    dispatch(webmapSlice.actions.setWmProps({ identifier, newWmProps }))
  }

  const setRange = (newRange: MinMax) => {
    const newWmProps: WmProps = Object.assign({}, { ...wmProps, ...newRange })
    dispatch(webmapSlice.actions.setWmProps({ identifier, newWmProps }))
  }
  const handleDefaultRange = () => {
    const min = cmemsList[identifier].defaults?.min ?? 0
    const max = cmemsList[identifier].defaults?.max ?? 1
    const defaultRange = { min: min, max: max }
    setPanelRange(defaultRange)
    const newWmProps: WmProps = Object.assign({}, { ...wmProps, ...defaultRange })
    dispatch(webmapSlice.actions.setWmProps({ identifier, newWmProps }))
  }

  return (
    <>
      <Divider variant="middle" />
      <Box sx={{ margin: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('WebMapLayers.palette')}
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
                    <ColorPalette
                      palette={reversePalette(CMEMSPalettes[color as keyof typeof CMEMSPalettes], inverse)}
                      fullLength={180} />
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
          <PanelMinMaxField inputRange={panelRange} setInputRange={setPanelRange} setRange={setRange} />
          <Stack>
            <DefaultRangeButton setRange={handleDefaultRange} />
            <FormControlLabel
              label={<Typography variant="caption" >{t('OdbData.CTD.mask')}</Typography>}
              control={<Checkbox id='ODB-CTD-mask' size="small" sx={{ p: '2px' }} checked={noClamp} onChange={handleMask} />}
            />
          </Stack>
        </Stack>
        <OpacitySlider opacity={opacity} onChange={handleOpacityChange} />
      </Box >
      <Divider variant="middle" />
    </>
  )
}