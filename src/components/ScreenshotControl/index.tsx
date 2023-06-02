import { useState } from "react";
import { IconButton, Slide, Paper, Stack, ButtonGroup } from "@mui/material";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { ClipScreenshot } from "components/ClipScreenshot";
import { PortalControlButton } from "components/PortalControlButton";
import { useMap } from "react-leaflet";
import { Positions } from "types";
import { RenderIf } from "components/RenderIf/RenderIf";
import InfoButton from "components/InfoButton";
import { useTranslation } from "react-i18next";

export const ScreenshotControl = (props: { position: Positions }) => {
  const map = useMap()
  const { t } = useTranslation()
  const [showBanner, setShowBanner] = useState(false)
  return (
    <PortalControlButton position={props.position} className='leaflet-control' >
      <Stack
        direction="column"
        spacing={0.5}
        justifyContent="flex-end"
        alignItems="flex-end"
        sx={{
          overflow: 'hidden',
          border: 0,
        }}
      >
        <Paper
          sx={{
            width: '30px',
          }}
          className="leaflet-bar"
        >
          <ButtonGroup orientation="vertical">
            <IconButton
              title={t('screenshot.title')}
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
            <RenderIf isTrue={showBanner}>
              <InfoButton
                dataId="screenshot"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                iconSx={{
                  padding: '5px',
                  width: 30,
                  height: 30,
                  borderRadius: 0,
                }}
              />
            </RenderIf>
          </ButtonGroup>
        </Paper>
        <RenderIf isTrue={showBanner}>
          <Paper className="leaflet-bar">
            <ClipScreenshot />
          </Paper>
        </RenderIf>
      </Stack>
    </PortalControlButton>
  )
}