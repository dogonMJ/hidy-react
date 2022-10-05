import { Control, ControlOptions, DomUtil } from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

interface LegendProps extends ControlOptions {
  legendContent: string
  legendClassNames?: string
}

export const LegendControl = (props: LegendProps) => {
  const map = useMap()
  const legend = new Control(props)
  legend.onAdd = () => {
    const div = DomUtil.create('div', `legendbg ${props.legendClassNames}`);
    div.innerHTML = props.legendContent
    return div;
  }
  useEffect(() => {
    legend.addTo(map)
    return () => {
      legend.remove()
    }
  }, [props.legendContent])
  return null
}