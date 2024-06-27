import Slider, { SliderThumb } from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import { SliderMarks } from 'types'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import React, { forwardRef, useState } from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { mapSlice } from 'store/slice/mapSlice';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { odbCurrentSlice } from 'store/slice/odbCurrentSlice';
import { odbCtdSlice } from 'store/slice/odbCtdSlice';

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

export const DepthMeterSlider = (props: { values: number[], marks: SliderMarks[], user?: any }) => {
  const dispatch = useAppDispatch()
  const { values, marks } = props
  const maxValue = values.length - 1
  const defaultValue = useAppSelector(state => state.map.depthMeterValue[props.user])
  const [value, setValue] = useState(defaultValue)

  const handleChange = (event: Event, value: any) => setValue(value)

  const handleChangeCommitted = (event: any, value: number | number[]) => {
    dispatch(mapSlice.actions.DepthMeterValue([props.user, value as number])) //更新實際使用state
    // setTitleDepthLabel(`${Math.round(values[value as number] * 10) / 10}`)
    switch (props.user) {
      //只用於更新分享網址避免網址過長，不影響原本功能
      case 'odbCurrent':
        dispatch(odbCurrentSlice.actions.setDepthIndex(value as number))
        break
      case 'odbCtd':
        dispatch(odbCtdSlice.actions.setDepthIndex(value as number))
        break
      case 'cmems':
        dispatch(mapSlice.actions.setWmsDepthIndex(value as number))
        break
    }
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
      value={value}
      scale={x => values[x]}
      valueLabelFormat={x => `${Math.round(x * 10) / 10}m`}
      marks={marks}
      slots={{ valueLabel: ValueLabelComponent, thumb: ThumbComponent, }}
      slotProps={{ markLabel: { style: { fontSize: '12px', marginLeft: -15 } } }}
      onChange={handleChange}
      onChangeCommitted={handleChangeCommitted}
      sx={{
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