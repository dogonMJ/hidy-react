import { HTMLAttributes, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Positions } from "types";
declare const L: any;

const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}

interface ControlButtonProps extends HTMLAttributes<HTMLDivElement> {
  position: Positions
}
export const PortalControlButton: React.FC<ControlButtonProps> = (props) => {
  const { position, children, className = "leaflet-control leaflet-bar", ...rest } = props

  const [container, setContainer] = useState<Element>(document.createElement('div'))
  const positionClass = ((position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright)
  L.DomEvent.disableClickPropagation(container)

  useEffect(() => {
    if (position === "topleft" || position === "topright") {
      const targetDiv = document.getElementsByClassName(positionClass)[0]
      setContainer(targetDiv)
    }
  }, [])
  return createPortal(
    <div className={className} {...rest} tabIndex={-1}>
      {children}
    </div>
    , container)
}
