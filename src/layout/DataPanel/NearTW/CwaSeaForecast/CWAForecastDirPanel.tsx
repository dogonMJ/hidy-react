import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch } from "@mui/material";
import { PanelSlider } from "components/PanelSlider";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { useTranslation } from "react-i18next";
import { cwaForecastDirSlice } from "store/slice/cwaForecastDirSlice";
import { CWAArrowColor } from "types";

export const CWAForecastDirPanel = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const arrow = useAppSelector(state => state.cwaForecastDir.arrow)
  const level = useAppSelector(state => state.cwaForecastDir.level)
  const scale = useAppSelector(state => state.cwaForecastDir.scale)
  const marks = [
    { value: 1, label: t('CwaSeaForecast.small') },
    { value: 2, label: t('CwaSeaForecast.medium') },
    { value: 3, label: t('CwaSeaForecast.large') },
  ]
  return (
    <Box sx={{ padding: '4px 25px' }}>
      <FormControl>
        <FormLabel id="ArrowSwitch">{t('CwaSeaForecast.arrowStyle')}</FormLabel>
        <RadioGroup
          row
          aria-labelledby="ArrowSwitch"
          name="ArrowSwitch"
          value={arrow}
          onChange={(e) => dispatch(cwaForecastDirSlice.actions.setArrow(e.target.value as CWAArrowColor))}
        >
          <FormControlLabel value="grey" control={<Radio />} label={t('CwaSeaForecast.grey')} />
          <FormControlLabel value="black" control={<Radio />} label={t('CwaSeaForecast.black')} />
          <FormControlLabel value="orange" control={<Radio />} label={t('CwaSeaForecast.orange')} />
        </RadioGroup>
      </FormControl>
      <br />

      <FormControlLabel
        control={
          <Switch
            checked={scale}
            onChange={() => dispatch(cwaForecastDirSlice.actions.setScale(!scale))}
          />
        }
        label={t("CwaSeaForecast.scale")}
      />
      <br />
      <FormControl sx={{ width: '100%' }}>
        <FormLabel >{t('CwaSeaForecast.arrowSize')}</FormLabel>
        <PanelSlider
          initValue={level}
          min={1}
          max={3}
          onChangeCommitted={(e, value) => dispatch(cwaForecastDirSlice.actions.setLevel(value as number))}
          track={false}
          marks={marks}
          valueLabelDisplay="off"
        />
      </FormControl>
    </Box>
  )
}