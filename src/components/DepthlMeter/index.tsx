import { useState } from 'react';
import { useMap } from 'react-leaflet';
import { Box, Paper } from '@mui/material';
import { createPortal } from 'react-dom'
import { SliderMarks } from 'types'
import { DepthMeterSlider } from 'components/DepthMeterSlider'

export const DepthMeter = (props: { values: number[], marks: SliderMarks[] }) => {
  const mapContainer = document.getElementById('mapContainer')
  const map = useMap()
  const [isEnter, setIsEnter] = useState(false)
  const mouseEnter = () => {
    map.dragging.disable()
    setIsEnter(true)
  }
  const mouseLeave = () => {
    map.dragging.enable()
    setIsEnter(false)
  }
  if (mapContainer) {
    return (
      createPortal(
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row-reverse',
          }}
        >
          <Paper
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
            sx={{
              position: 'absolute',
              zIndex: 1000,
              width: '95px',
              display: 'flex',
              margin: '2px',
              padding: '15px 5px',
              top: '400px',
              height: 'calc(70vh - 300px)',
              backgroundColor: 'rgba(255,255,255,1)',
              // backgroundColor: isEnter ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
            }}>
            <DepthMeterSlider values={props.values} marks={props.marks} />
          </Paper>
        </Box>
        , mapContainer)
    )
  } else {
    return <></>
  }
}