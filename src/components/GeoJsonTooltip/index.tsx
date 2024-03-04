
import { Tooltip } from "react-leaflet"
import { coor } from "types";
import { TooltipProps } from "react-leaflet";
import FormatCoordinate from "components/FormatCoordinate";
import { useAppSelector } from "hooks/reduxHooks";

export const GeoJsonTooltip = (props: { position: coor | null | undefined, content: string | JSX.Element, tooltipProps?: TooltipProps }) => {
  const latlonFormat = useAppSelector(state => state.map.latlonformat)
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