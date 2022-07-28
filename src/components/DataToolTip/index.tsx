import { useState } from "react";
import { Tooltip, CircleMarker } from 'react-leaflet'
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import { coor } from 'types';
import FormatCoordinate from "components/FormatCoordinate";

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
  const latlonFormat = useSelector((state: RootState) => state.coordInput.latlonformat)
  const [circleStyle, setCircleStyle] = useState<CircleStyles>({ fill: false, opacity: 0, stroke: false, zIndex: 1500 })

  const handleCircleMarker = {
    mouseover: () => setCircleStyle({ fill: true, opacity: 1 }),
    mouseout: () => setCircleStyle({ fill: false, opacity: 0 })
  }
  return (
    <CircleMarker pane={'markerPane'} center={props.position} radius={15} eventHandlers={handleCircleMarker} pathOptions={circleStyle}>
      <CircleMarker pane={'markerPane'} center={props.position} radius={3} pathOptions={pointStyle} />
      <Tooltip pane={'tooltipPane'} >
        <FormatCoordinate coords={props.position} format={latlonFormat} /><br />
        <span style={{ whiteSpace: 'pre-line' }}>{props.content}</span>
      </Tooltip>
    </CircleMarker >
  )
}

export default DataToolTip