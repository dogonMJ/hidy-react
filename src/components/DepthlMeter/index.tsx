import { useMap } from 'react-leaflet';
import { Box, Paper } from '@mui/material';
import { createPortal } from 'react-dom'
import { SliderMarks } from 'types'
import { DepthMeterSlider } from 'components/DepthlMeter/DepthMeterSlider'
import { memo, useState } from 'react';

export const DepthMeter = memo((props: { values: number[], marks: SliderMarks[], user?: any }) => {
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
              zIndex: 700,
              width: '3.5rem',
              display: 'flex',
              marginRight: '12px',
              padding: '15px 5px',
              top: '585px',
              height: 'calc(70vh - 400px)',
              backgroundColor: 'rgba(255,255,255,1)',
              // backgroundColor: isEnter ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.7)',
            }}>
            <DepthMeterSlider values={props.values} marks={props.marks} user={props.user} />
          </Paper>
        </Box>
        , mapContainer)
    )
  } else {
    return <></>
  }
})