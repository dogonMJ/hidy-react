import { useState } from "react"
import { Slider, SliderProps } from "@mui/material"

interface PanelSliderProps extends SliderProps {
  initValue: any
}

export const PanelSlider: React.FC<PanelSliderProps> = ({ initValue, ...props }) => {
  const [value, setValue] = useState<any>(initValue)
  const handleChange = (event: Event, newValue: any) => {
    setValue(newValue as any[]);
  };
  return (
    <Slider
      value={value}
      onChange={handleChange}
      valueLabelDisplay="auto"
      marks
      sx={{ width: '85%', marginLeft: 2.1 }}
      {...props}
    />
  )
}