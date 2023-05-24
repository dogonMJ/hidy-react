import { useState } from "react";
import { IconButton, Slide, Paper, Stack, ButtonGroup } from "@mui/material";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { ClipScreenshot } from "components/ClipScreenshot";
import { PortalControlButton } from "components/PortalControlButton";
import { useMap } from "react-leaflet";
import { Positions } from "types";

export const ScreenshotControl = (props: { position: Positions }) => {
  const map = useMap()
  const [showBanner, setShowBanner] = useState(false)
  return (
    <PortalControlButton position={props.position}>
      <Stack
        direction="row"
        sx={{
          overflow: 'hidden',
          // maxHeight: 60,
        }}
      >
        <Slide in={showBanner} direction='left' mountOnEnter unmountOnExit >
          <Paper sx={{ marginRight: -3.5, paddingRight: "30px", borderRadius: 0.5 }} elevation={2}>
            <ClipScreenshot />
          </Paper>
        </Slide>
        <Paper sx={{ borderRadius: 0.5 }}>
          {/* <ButtonGroup orientation="vertical"> */}
          <IconButton
            onClick={() => {
              if (showBanner === true) {
                map.getContainer().style.cursor = ''
              }
              setShowBanner(!showBanner)
            }}
            sx={{
              width: 30,
              height: 30,
              borderRadius: 0
            }}
            tabIndex={-1}
            disableRipple
          >
            <CameraAltIcon fontSize="small" style={{ color: '#464646' }} />
          </IconButton>
          {/* <ClipScreenshot /> */}
          {/* </ButtonGroup> */}
        </Paper>
      </Stack>
    </PortalControlButton>
  )
}