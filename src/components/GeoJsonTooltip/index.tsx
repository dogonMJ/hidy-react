
import { Tooltip } from "react-leaflet"
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import { coor } from "types";
import { TooltipProps } from "react-leaflet";
import FormatCoordinate from "components/FormatCoordinate";

export const GeoJsonTooltip = (props: { position: coor | null | undefined, content: string, tooltipProps?: TooltipProps }) => {
  const latlonFormat = useSelector((state: RootState) => state.coordInput.latlonformat)
  if (props.position) {
    return (
      <Tooltip {...props.tooltipProps}>
        <FormatCoordinate coords={props.position} format={latlonFormat} /><br />
        <span style={{ whiteSpace: 'pre-line' }}>{props.content}</span>
      </Tooltip>
    )
  } else {
    return (
      <Tooltip {...props.tooltipProps}>
        <span style={{ whiteSpace: 'pre-line' }}>{props.content}</span>
      </Tooltip>
    )
  }
}