import { useTranslation } from "react-i18next";
import { Stack, Slider, SliderProps } from "@mui/material"
import OpacityIcon from '@mui/icons-material/Opacity';

interface OpacitySliderProps extends SliderProps {
  opacity: number
}

export const OpacitySlider: React.FC<OpacitySliderProps> = ({ opacity, ...props }) => {
  const { t } = useTranslation()
  return (
    <Stack spacing={0} direction="row" sx={{ mb: 1, width: '90%' }} alignItems="center" justifyContent="space-around">
      <OpacityIcon />
      {t('CustomLayer.opacity')}
      <Slider
        sx={{ maxWidth: '65%' }}
        value={opacity}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value}%`}
        {...props}
      />
    </Stack>
  )
}