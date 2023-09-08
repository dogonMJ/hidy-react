
import { Tooltip } from "react-leaflet"
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import { coor } from "types";
import { TooltipProps } from "react-leaflet";
import FormatCoordinate from "components/FormatCoordinate";

export const GeoJsonTooltip = (props: { position: coor | null | undefined, content: string | JSX.Element, tooltipProps?: TooltipProps }) => {
  const latlonFormat = useSelector((state: RootState) => state.coordInput.latlonformat)
  const { position, content, tooltipProps } = props
  if (position) {
    return (
      <Tooltip {...tooltipProps}>
        <FormatCoordinate coords={position} format={latlonFormat} /><br />
        {typeof content === 'string' ? <span style={{ whiteSpace: 'pre-line' }}>{content}</span> : content}
      </Tooltip>
    )
  } else {
    return (
      <Tooltip {...tooltipProps}>
        {typeof content === 'string' ? <span style={{ whiteSpace: 'pre-line' }}>{content}</span> : content}
      </Tooltip>
    )
  }
}