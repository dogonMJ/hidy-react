import { Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next';
import { memo } from 'react'

export const SubSelection = memo((props: { select: string, handleChange: any, values: string[], transParentNode?: string }) => {

  const { t } = useTranslation()
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
            {
              props.values.map((value) => {
                return (
                  <ToggleButton value={value} key={value}>
                    {t(`${props.transParentNode}.${value}`)}
                  </ToggleButton>
                )
              })
            }
          </ToggleButtonGroup>
        </Box>
        , mapContainer)
    )
  } else {
    return <></>
  }
})