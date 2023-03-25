import { useTranslation } from "react-i18next";
import { Stack, Slider } from "@mui/material"
import OpacityIcon from '@mui/icons-material/Opacity';

export const OpacitySlider = (props: { opacity: number, onChange: (event: Event, value: number | number[], activeThumb: number) => void }) => {
  const { opacity, onChange } = { ...props }
  const { t } = useTranslation()
  return (
    <Stack spacing={0} direction="row" sx={{ mb: 1, width: '90%' }} alignItems="center" justifyContent="space-around">
      <OpacityIcon />
      {t('WMSSelector.opacity')}
      <Slider
        sx={{ maxWidth: '65%' }}
        value={opacity}
        onChange={onChange}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value}%`}
      />
    </Stack>
  )
}