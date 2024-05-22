import { useTranslation } from "react-i18next";
import { Stack, Slider, SliderProps, SxProps } from "@mui/material"
import OpacityIcon from '@mui/icons-material/Opacity';

interface OpacitySliderProps extends SliderProps {
  opacity: number
  componentSx?: SxProps
}

export const OpacitySlider: React.FC<OpacitySliderProps> = ({ opacity, componentSx, ...props }) => {
  const { t } = useTranslation()
  return (
    <Stack
      spacing={2}
      direction="row"
      sx={componentSx ?? { mb: 1, width: '90%' }}
      alignItems="center"
      justifyContent="space-around"
    >
      <OpacityIcon sx={{ color: '#000', opacity: 0.6 }} />
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