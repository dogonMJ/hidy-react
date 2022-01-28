import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store"
import MarkerSet from "components/MarkerSet"
import { coordInputSlice } from "store/slice/mapSlice";


const PinnedMarker = () => {
  const dispatch = useDispatch()
  const markers = useSelector((state: RootState) => state.coordInput.markers)
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
    dispatch(coordInputSlice.actions.changeMarkers(markerList));
  }

  return (
    <>
      {markers.map((pos, idx) => <MarkerSet key={idx} markerCoord={pos} id={idx} onclick={removeMarker} />)}
    </>
  )
}

export default PinnedMarker