import { useMap } from "react-leaflet"
export const useMapDragScroll = () => {
  const map = useMap()
  const setDrag = (drag: boolean) => {
    drag ? map.dragging.enable() : map.dragging.disable()
  }
  const setScroll = (scroll: boolean) => {
    scroll ? map.scrollWheelZoom.enable() : map.scrollWheelZoom.disable()
  }
  return { setDrag, setScroll }
}