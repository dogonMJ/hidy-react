import Slider, { SliderThumb } from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import { SliderMarks } from 'types'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const preventHorizontalKeyboardNavigation = (event: React.KeyboardEvent) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
  }
}

const ThumbComponent = (props: any) => {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other} sx={{ width: '0', height: '0' }}>
      <ArrowRightIcon fontSize={'large'} sx={{ position: 'relative', left: '-9px', }} />
      {children}
    </SliderThumb>
  );
}

const ValueLabelComponent = (props: any) => {
  const { children, value } = props;
  return (
    <Tooltip placement="left" title={value}>
      <>
        {children}
      </>
    </Tooltip >
  )
}

export const DepthMeterSlider = (props: { values: number[], marks: SliderMarks[], handleChange: any }) => {
  const { values, marks, handleChange } = props
  const maxValue = values.length - 1
  return (
    <Slider
      key={'slider'}
      track={false}
      orientation="vertical"
      onKeyDown={preventHorizontalKeyboardNavigation}
      valueLabelDisplay="on"
      min={0}
      max={maxValue}
      defaultValue={(maxValue) ? maxValue : 49}
      scale={x => values[x]}
      valueLabelFormat={x => `${Math.round(x * 10) / 10}m`}
      marks={marks}
      components={{ Thumb: ThumbComponent, ValueLabel: ValueLabelComponent, }}
      onChange={handleChange}
      sx={{
        zIndex: 1000,
        '& input[type="range"]': {
          WebkitAppearance: 'slider-vertical',
        },
        '& .MuiSlider-thumb': {
          '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: '0 0 0 0px rgba(58, 133, 137, 0.16)',
            backgroundColor: 'transparent',
          },
        },
      }}
    />
  )
}