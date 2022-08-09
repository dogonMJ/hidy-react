import { Box, ToggleButtonGroup } from '@mui/material';
import { createPortal } from 'react-dom'

export const SubSelection = (props: { children: any, select: string, handleChange: any }) => {
  const mapContainer = document.getElementById('mapContainer')
  if (mapContainer) {
    return (
      createPortal(
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <ToggleButtonGroup
            exclusive
            value={props.select}
            onChange={props.handleChange}
            size="small"
            sx={{
              position: 'relative',
              zIndex: 1700,
              backgroundColor: 'white',
            }}>
            {props.children}
          </ToggleButtonGroup>
        </Box>
        , mapContainer)
    )
  } else {
    return <></>
  }
}