import { Control, ControlOptions, DomUtil } from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect, memo } from "react";
import { createRoot } from "react-dom/client";

interface LegendProps extends ControlOptions {
  legendContent: string | JSX.Element
  legendClassNames?: string
}

export const LegendControl = memo((props: LegendProps) => {
  const map = useMap()
  const legend = new Control(props)
  legend.onAdd = () => {
    const div = props.legendClassNames ?
      DomUtil.create('div', `legendbg ${props.legendClassNames}`) :
      DomUtil.create('div', `legendbg`)
    if (typeof props.legendContent === 'string') {
      div.innerHTML = props.legendContent
    } else {
      const root = createRoot(div)
      root.render(props.legendContent)
    }
    return div;
  }
  useEffect(() => {
    legend.addTo(map)
    return () => {
      legend.remove()
    }
  }, [props.legendContent])
  return null
})