import { useState } from "react";
import { Tooltip, CircleMarker, Circle } from 'react-leaflet'
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import { coor } from 'types';
import FormatCoordinate from "components/FormatCoordinate";

interface CircleStyles {
  fill: boolean
  opacity: number
  zIndex?: number
  stroke?: boolean
}

const DataToolTip = (props: { position: coor, content: any }) => {
  const latlonFormat = useSelector((state: RootState) => state.coordInput.latlonformat)
  const [circleStyle, setCircleStyle] = useState<CircleStyles>({ fill: false, opacity: 0, stroke: false, zIndex: 1000 })

  const handleCircleMarker = {
    mouseover: () => {
      setCircleStyle({ fill: true, opacity: 1 })
    },
    mouseout: () => {
      setCircleStyle({ fill: false, opacity: 0 })
    }
  }
  return (
    <CircleMarker center={props.position} radius={10} eventHandlers={handleCircleMarker} pathOptions={circleStyle}>
      <Circle center={props.position} />
      <Tooltip pane={'tooltipPane'} >
        <FormatCoordinate coords={props.position} format={latlonFormat} /><br />
        <span style={{ whiteSpace: 'pre-line' }}>{props.content}</span>
      </Tooltip>
    </CircleMarker >
  )
}

export default DataToolTip