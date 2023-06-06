// @ts-ignore
import { useMap } from "react-leaflet";
import "./leaflet.latlng-graticule.js"
declare const L: any;

export const Graticule = () => {
  const map = useMap()
  const graticule = new L.latlngGraticule({
    showLabel: true,
    dashArray: [0, 0],
    opacity: 0.5,
    weight: 0.5,
    // font: '12px Rubik',
    zoomInterval: [
      { start: 2, end: 3, interval: 30 },
      { start: 4, end: 4, interval: 10 },
      { start: 5, end: 6, interval: 5 },
      { start: 7, end: 7, interval: 2 },
      { start: 8, end: 9, interval: 1 },
      { start: 10, end: 11, interval: 0.5 },
    ]
  })
  graticule.addTo(map);
  return null
}



