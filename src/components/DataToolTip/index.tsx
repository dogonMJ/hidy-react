import { useState } from "react";
import { Tooltip, CircleMarker } from 'react-leaflet'
import { coor } from 'types';
import FormatCoordinate from "components/FormatCoordinate";
import { useAppSelector } from "hooks/reduxHooks";

interface CircleStyles {
  fill: boolean
  opacity: number
  zIndex?: number
  stroke?: boolean
  color?: string
  fillColor?: string
}
const pointStyle = {
  stroke: true,
  color: "black",
  weight: 1,
  fill: true,
  fillColor: "white",
  fillOpacity: 1,
  zIndex: 1700
}

const DataToolTip = (props: { position: coor, content: any }) => {
  const latlonFormat = useAppSelector(state => state.map.latlonformat)
  const [circleStyle, setCircleStyle] = useState<CircleStyles>({ fill: false, opacity: 0, stroke: false, zIndex: 1500 })

  const handleCircleMarker = {
    mouseover: () => setCircleStyle({ fill: true, opacity: 1 }),
    mouseout: () => setCircleStyle({ fill: false, opacity: 0 })
  }
  return (
    <CircleMarker center={props.position} radius={15} eventHandlers={handleCircleMarker} pathOptions={circleStyle}>
      <CircleMarker center={props.position} radius={3} pathOptions={pointStyle} />
      <Tooltip >
        <FormatCoordinate coords={props.position} format={latlonFormat} /><br />
        <span style={{ whiteSpace: 'pre-line', }}>{props.content}</span>
      </Tooltip>
    </CircleMarker >
  )
}

export default DataToolTip