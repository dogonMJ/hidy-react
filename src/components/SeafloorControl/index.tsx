import { useState, useEffect } from "react";
import 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import { createPortal } from "react-dom";
import { IconButton } from "@mui/material";
import { DrawShapes } from "components/DrawShapes";
import ShapeLineIcon from '@mui/icons-material/ShapeLine';
import { RenderIf } from "components/RenderIf/RenderIf";

declare const L: any;

export const SeafloorControl = () => {
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
        <IconButton
          onClick={() => { setShowDrawLine(!showDrawLine) }}
          sx={{
            width: 30,
            height: 30
          }}
        >
          <ShapeLineIcon fontSize="small" style={{ color: '#464646' }} />
        </IconButton>
        <RenderIf isTrue={showDrawLine}>
          <DrawShapes />
        </RenderIf>
      </div>
    </>
    , container
  )
}