import { MarkerSet } from "layout/MouseCoordinates/MarkerSet"
import { coordInputSlice } from "store/slice/coordInputSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { memo } from "react";

export const PinnedMarker = memo(() => {
  const dispatch = useAppDispatch()
  const markers = useAppSelector(state => state.coordInput.markers)

  const removeMarker = (evt: React.MouseEvent<HTMLButtonElement>): void => {
    const target = evt.target as HTMLButtonElement
    const idx = Number(target.dataset.idx)
    const markerList = [...markers]
    if (idx % 2 === 0) {
      // idx=0 is [null,null]
      markerList.splice(idx - 1, 2)
    } else {
      markerList.splice(idx, 2)
    }
    dispatch(coordInputSlice.actions.setMarkers(markerList));
  }
  return (
    <>
      {markers.map((pos, idx) => <MarkerSet key={idx} markerCoord={pos} id={idx} onclick={removeMarker} />)}
    </>
  )
}
)