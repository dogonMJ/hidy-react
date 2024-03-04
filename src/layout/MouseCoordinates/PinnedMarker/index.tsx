import { MarkerSet } from "layout/MouseCoordinates/MarkerSet"
import { coordInputSlice } from "store/slice/coordInputSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { memo, useCallback } from "react";

export const PinnedMarker = memo(() => {
  const dispatch = useAppDispatch()
  const markers = useAppSelector(state => state.coordInput.markers)

  const removeMarker = useCallback((evt: React.MouseEvent<HTMLButtonElement>): void => {
    const target = evt.target as HTMLButtonElement
    const idx = Number(target.dataset.idx)
    const markerList = [...markers]
    markerList.splice(idx, 1)
    dispatch(coordInputSlice.actions.setMarkers(markerList));
  }, [markers])

  return (
    <>
      {markers.map((pos, idx) => <MarkerSet key={idx} markerCoord={pos} id={idx} onclick={removeMarker} />)}
    </>
  )
}
)