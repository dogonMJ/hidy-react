import Slider, { SliderThumb } from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import { SliderMarks } from 'types'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import React, { forwardRef, useState } from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { coordInputSlice } from "store/slice/mapSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store"
const preventHorizontalKeyboardNavigation = (event: React.KeyboardEvent) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
  }
}
interface ValueLabelComponentProps {
  children: React.ReactElement;
  value: number;
  sx: SxProps<Theme>;
}

const ThumbComponent = forwardRef<HTMLElement, any>((props, ref) => {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other} sx={{ width: '0', height: '0' }} ref={ref}>
      {children}
      < ArrowRightIcon fontSize={'large'} sx={{ position: 'relative', left: '-9px', }} />
    </SliderThumb >
  );
})
const ValueLabelComponent = (props: ValueLabelComponentProps) => {
  const { children, value } = props;
  return (
    <Tooltip placement="left" title={value} >
      {children}
    </Tooltip >
  )
}

// const MarkComponent = (props)=>{

// }

export const DepthMeterSlider = (props: { values: number[], marks: SliderMarks[] }) => {
  const dispatch = useDispatch()
  const { values, marks } = props
  const maxValue = values.length - 1
  const [value, setValue] = useState(-1)
  const handleChange = (event: Event, value: any) => {
    setValue(value)
  }
  const handleChangeCommitted = (event: any, value: number | number[]) => {
    dispatch(coordInputSlice.actions.depthMeterValue(value as number))
  }
  return (
    <Slider
      key={'slider'}
      track={false}
      orientation="vertical"
      onKeyDown={preventHorizontalKeyboardNavigation}
      valueLabelDisplay="auto"
      min={0}
      max={maxValue}
      value={value === -1 ? maxValue : value}
      scale={x => values[x]}
      valueLabelFormat={x => `${Math.round(x * 10) / 10}m`}
      marks={marks}
      slots={{ valueLabel: ValueLabelComponent, thumb: ThumbComponent, }}
      slotProps={{ markLabel: { style: { fontSize: '12px', marginLeft: -15 } } }}
      onChange={handleChange}
      onChangeCommitted={handleChangeCommitted}
      sx={{
        // zIndex: 700,
        // '& input[type="range"]': {
        //   WebkitAppearance: 'slider-vertical',
        // },
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