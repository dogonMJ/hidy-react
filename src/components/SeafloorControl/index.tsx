
import { useState } from "react";
import { useTranslation } from "react-i18next";
import 'leaflet-draw/dist/leaflet.draw.css'
import { ButtonGroup, IconButton, Paper } from "@mui/material";
import { DrawShapes } from "components/DrawShapes";
import ShapeLineIcon from '@mui/icons-material/ShapeLine';
import { RenderIf } from "components/RenderIf/RenderIf";
import InfoButton from "components/InfoButton";
import { PortalControlButton } from "components/PortalControlButton";

export const SeafloorControl = () => {
  const { t } = useTranslation()
  const [showDrawLine, setShowDrawLine] = useState(false)
  return (
    <PortalControlButton position="topright">
      <Paper sx={{ borderRadius: 0.5 }}>
        <ButtonGroup orientation="vertical" >
          <IconButton
            aria-label={`${t('draw.title')}`}
            title={`${t('draw.title')}`}
            onClick={() => { setShowDrawLine(!showDrawLine) }}
            sx={{
              width: 30,
              height: 30,
              borderRadius: 0,
            }}
            tabIndex={-1}
            disableRipple
          >
            <ShapeLineIcon fontSize="small" style={{ color: '#464646' }} />
          </IconButton>
          <RenderIf isTrue={showDrawLine}>
            <InfoButton
              dataId='draw'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              itemSx={{ minWidth: 0 }}
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
      <RenderIf isTrue={showDrawLine}>
        <DrawShapes />
      </RenderIf>
    </PortalControlButton >
  )
}