import { Box, Paper, Stack, Typography } from '@mui/material';
import { createPortal } from 'react-dom'
import { SliderMarks } from 'types'
import { DepthMeterSlider } from 'components/DepthlMeter/DepthMeterSlider'
import { memo } from 'react';
import { useMapDragScroll } from 'hooks/useMapDragScroll';
import { useTranslation } from 'react-i18next';

export const DepthMeter = memo((props: { values: number[], marks: SliderMarks[], user?: any }) => {
  const { setDrag } = useMapDragScroll()
  const { t } = useTranslation()
  const mapContainer = document.getElementById('mapContainer')
  const mouseEnter = () => setDrag(false)
  const mouseLeave = () => setDrag(true)

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
              padding: '0px 10px 15px 3px',
              top: '585px',
              height: 'calc(70vh - 400px)',
              backgroundColor: 'rgba(255,255,255,1)',
              // backgroundColor: isEnter ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.7)',
            }}>
            <Stack>
              <Typography sx={{ fontSize: '11px', paddingTop: '3px', paddingBottom: '5px', textAlign: 'center', width: '63px' }}>{t('depth')}</Typography>
              <DepthMeterSlider values={props.values} marks={props.marks} user={props.user} />
            </Stack>
          </Paper>
        </Box>
        , mapContainer)
    )
  } else {
    return <></>
  }
})