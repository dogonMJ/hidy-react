import { Box, Stack, Typography } from "@mui/material"
import { ColorPalette } from "components/ColorPalette/ColorPalette"
import { LegendControl } from "components/LeafletLegend"
import { ControlPosition } from "leaflet"
import { memo } from "react"

export const ColorPaletteLegend = memo((props: {
  palette: string[],
  interval: number,
  min: number,
  max: number,
  title: string,
  position?: ControlPosition
}) => {
  const { palette, interval, min, max, title, position = 'bottomleft' } = props
  const FULLWIDTH = 180
  return (
    <LegendControl
      position={position}
      legendContent={
        <Box>
          <Typography variant="caption">{title}</Typography>
          <ColorPalette palette={palette} interval={interval} fullLength={FULLWIDTH} />
          <Stack
            direction={'row'}
            justifyContent="space-between"
            alignItems="baseline"
            spacing={2}
          >
            <Box m={0} textAlign={'left'}>
              {min}
            </Box>
            {interval !== 0 &&
              <Box m={0} textAlign={'right'}>
                {max}
              </Box>
            }
          </Stack>
        </Box>
      }
    />
  )
})