
import { useState, useEffect } from "react";
import leaflet, { Control } from 'leaflet';
import Draw from 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css'
import { createPortal } from "react-dom";
import { Button, ButtonGroup, IconButton } from "@mui/material";
import { DrawShapes } from "components/DrawShapes";
import ShapeLineIcon from '@mui/icons-material/ShapeLine';
import { RenderIf } from "components/RenderIf/RenderIf";
import InfoButton from "components/InfoButton";
import { useTranslation } from "react-i18next";

declare const L: any;

export const SeafloorControl = () => {
  const { t } = useTranslation()
  const [container, setContainer] = useState<any>(document.createElement('div'))
  const [showDrawLine, setShowDrawLine] = useState(false)
  const positionClass = 'leaflet-top leaflet-right'

  useEffect(() => {
    const targetDiv = document.getElementsByClassName(positionClass)
    setContainer(targetDiv[0])
  }, [])

  L.DomEvent.disableClickPropagation(container)

  return createPortal(
    <>
      <div className='leaflet-control leaflet-bar bg-white seafloor-control' tabIndex={-1}>
        <ButtonGroup orientation="vertical">
          <IconButton
            aria-label={t('draw.title')}
            title={t('draw.title')}
            onClick={() => { setShowDrawLine(!showDrawLine) }}
            sx={{
              width: 30,
              height: 30,
              borderRadius: 0,
              borderBottom: "1px solid #ccc",
            }}
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
        <RenderIf isTrue={showDrawLine}>
          <DrawShapes />
        </RenderIf>
      </div>
    </>
    , container
  )
}