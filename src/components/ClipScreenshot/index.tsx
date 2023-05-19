import { MouseEvent, useRef, useState } from "react";
import { LatLngBounds, LatLngExpression } from "leaflet";
import { useMapEvents, Rectangle, useMap, Pane } from "react-leaflet";
// import html2canvas from "html2canvas";
import 'leaflet'
import { screenshot } from "Utils/UtilsScreenshot";
declare const L: any
interface Selections {
  bounds: LatLngBounds | null;
  isDragging: boolean;
  // center?: LatLngExpression;
  // zoom?: number
}
export const ClipScreenshot = () => {
  const map = useMap()
  const rectRef = useRef<any>()
  const [clippingMode, setClippingMode] = useState(false)
  const [overButton, setOverButton] = useState(false)
  const [selection, setSelection] = useState<Selections>({
    bounds: null,
    isDragging: false,
  });

  useMapEvents({
    "mousedown": (e) => {
      // e.originalEvent.preventDefault();
      if (!map || !clippingMode) return;
      const startPoint = map.mouseEventToLatLng(e.originalEvent);
      setSelection({
        bounds: new LatLngBounds(startPoint, startPoint),
        isDragging: true,
      })
    }
    ,
    "mousemove": (e) => {
      if (!selection.isDragging || !map || !clippingMode) return;
      const endPoint = map.mouseEventToLatLng(e.originalEvent);
      setSelection((prevSelection) => ({
        ...prevSelection,
        bounds: new LatLngBounds(
          prevSelection.bounds?.getNorthWest() as LatLngExpression,
          endPoint
        ),
      }));
    },
    "mouseup": (e) => {
      const bounds = rectRef.current?.getBounds()
      if (!map || !clippingMode) return;
      if (bounds) {
        map.fitBounds(bounds)
        setTimeout(() =>
          setSelection((prevSelection) => ({
            ...prevSelection,
            isDragging: false,
          }))
          , 10)
      }
    },
    "movestart": () => {
      if (!selection.isDragging) {
        setSelection((prevSelection) => ({
          ...prevSelection,
          bounds: null
        }))
      }
    },
  })

  const handleCapture = async () => {
    if (!map) return;
    const bounds = selection.bounds;
    bounds ? screenshot(map, bounds) : screenshot(map, map.getBounds())
  }

  const handleMode = () => {
    if (clippingMode) {
      setClippingMode(false)
      map.dragging.enable()
      map.getContainer().style.cursor = ''
    } else {
      setClippingMode(true)
      map.dragging.disable()
      map.getContainer().style.cursor = 'crosshair'
    }
  }
  return (
    <div>
      <button
        onClick={handleMode}
      // onMouseEnter={() => setOverButton(true)}
      // onMouseLeave={() => setOverButton(false)}
      >
        {'clipping mode'}
      </button>
      <button
        onClick={handleCapture}
      // onMouseEnter={() => setOverButton(true)}
      // onMouseLeave={() => setOverButton(false)}
      >
        {'Capture'}
      </button>
      {selection.bounds &&
        <Pane name='clip' >
          <Rectangle ref={rectRef} bounds={selection.bounds} />
        </Pane>
      }
    </div>
  );
};
