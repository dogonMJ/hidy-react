import { styled } from '@mui/material/styles';
import { Switch } from '@mui/material'

export const SwitchSameColor = ({
  baseColor = '#fff',
  thumbBackgroundColor = '#1976D2',
  thumbOpacity = 1,
  trackBackgroundColor = '#8CBBE9',
  trackOpacity = 1
} = {}) => {
  return styled(Switch)(({
    '& .MuiSwitch-switchBase': {
      transform: 'translateX(0px)',
      '&.Mui-checked': {
        color: baseColor,
        transform: 'translateX(20px)',
        '& + .MuiSwitch-track': {
          opacity: trackOpacity,
          backgroundColor: trackBackgroundColor,
        },
      },
    },
    '& .MuiSwitch-thumb': {
      opacity: thumbOpacity,
      backgroundColor: thumbBackgroundColor,
    },
    '& .MuiSwitch-track': {
      opacity: trackOpacity,
      backgroundColor: trackBackgroundColor,
    },
  }))
}