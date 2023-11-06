import { useMap } from "react-leaflet"
export const useMapDragScroll = () => {
  const map = useMap()
  const setDrag = (drag: boolean) => {
    drag ? map.dragging.enable() : map.dragging.disable()
  }
  const setScroll = (scroll: boolean) => {
    scroll ? map.scrollWheelZoom.enable() : map.scrollWheelZoom.disable()
  }
  const setDragNScroll = (both: boolean) => {
    if (both) {
      map.scrollWheelZoom.enable()
      map.dragging.enable()
    } else {
      map.scrollWheelZoom.disable()
      map.dragging.disable()
    }
  }
  return { setDrag, setScroll, setDragNScroll }
}