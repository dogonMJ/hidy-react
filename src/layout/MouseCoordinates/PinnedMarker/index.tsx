import { MarkerSet } from "layout/MouseCoordinates/MarkerSet"
import { coordInputSlice } from "store/slice/coordInputSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { memo, useCallback, useEffect, useRef } from "react";

export const PinnedMarker = memo((props: { openPopup?: boolean }) => {
  const ref = useRef<any>([])
  const dispatch = useAppDispatch()
  const markers = useAppSelector(state => state.coordInput.markers)

  const removeMarker = useCallback((evt: React.MouseEvent<HTMLButtonElement>): void => {
    const target = evt.target as HTMLButtonElement
    const idx = Number(target.dataset.idx)
    const markerList = [...markers]
    markerList.splice(idx, 1)
    dispatch(coordInputSlice.actions.setMarkers(markerList));
  }, [markers])

  useEffect(() => {
    if (ref.current && props.openPopup) {
      ref.current.forEach((marker: any) => {
        if (marker) marker.openPopup()
      })
    }
  }, [props.openPopup])

  return (
    <>
      {markers.map((pos, idx) =>
        <MarkerSet key={idx}
          ref={(e: any) => ref.current[idx] = e}
          markerCoord={pos} id={idx}
          onclick={removeMarker}
        />)}
    </>
  )
}
)