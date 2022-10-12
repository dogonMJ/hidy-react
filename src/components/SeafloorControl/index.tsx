import { useState, useEffect } from "react";
import 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import { createPortal } from "react-dom";
import { IconButton } from "@mui/material";
import LandscapeIcon from '@mui/icons-material/Landscape';
import { DrawLine } from "components/DrawShapes"
declare const L: any;

export const SeafloorControl = () => {
  const [container, setContainer] = useState<any>(document.createElement('div'))
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
          onClick={() => { console.log('zzz') }}
          sx={{
            width: 30,
            height: 30
          }}
        >
          <LandscapeIcon />
        </IconButton>
      </div>
    </>
    , container
  )
}