import { useState } from "react";
import { useMap } from "react-leaflet"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store"
import { coordInputSlice } from "../../store/slice/mapSlice";

const CoordinatesInput = (props: { active: boolean }) => {
  const map = useMap();
  const dispatch = useDispatch()
  const boundCenter: any = map.options.center
  // const [markerLat, setMarkerLat] = useState<number>(map.getCenter().lat)
  // const [markerLon, setMarkerLon] = useState<number>(map.getCenter().lng)
  // const [markers, setMarkers] = useState<Array<Array<number | null>>>([[null, null]])
  const inputLat = useSelector((state: RootState) => state.coordInput.inputLat)
  const inputLon = useSelector((state: RootState) => state.coordInput.inputLon)
  const markers = useSelector((state: RootState) => state.coordInput.markers)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const target = evt.target as HTMLInputElement
    if (target.placeholder === 'Latitude') {
      // setMarkerLat(Number(target.value))
      dispatch(coordInputSlice.actions.changeLat(Number(target.value)));
    } else {
      // setMarkerLon(Number(target.value))
      dispatch(coordInputSlice.actions.changeLon(Number(target.value)));
    }
  }
  const addMarkerBtn = () => {
    let inputLon2: number;
    if (inputLon <= boundCenter[1]) { //中線
      inputLon2 = inputLon + 360
    } else {
      inputLon2 = inputLon - 360
    }
    dispatch(coordInputSlice.actions.changeMarkers([...markers, [inputLat, inputLon], [inputLat, inputLon2]]));
    // setMarkers([...markers, [inputLat, inputLon], [inputLat, inputLon2]])
  }
  // const removeMarker = (evt: React.MouseEvent<HTMLButtonElement>): void => {
  //   const target = evt.target as HTMLButtonElement
  //   const idx = Number(target.dataset.idx)
  //   if (idx % 2 === 0) {
  //     // idx=0 is [null,null]
  //     markers.splice(idx - 1, 2)
  //   } else {
  //     markers.splice(idx, 2)
  //   }
  //   setMarkers([...markers])
  // }
  const flyTo = () => {
    map.flyTo([inputLat, inputLon])
  }
  if (props.active) {
    return (
      <>
        <table className="coordInput">
          <thead>
            <tr>
              <td colSpan={2}>Input Coordinates</td>
              <td>
                <button onClick={addMarkerBtn}>Add Marker</button>
                <button onClick={flyTo}>Fly To</button>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="number" placeholder="Latitude" value={inputLat} onChange={handleChange} /></td>
              <td>,</td>
              <td><input type="number" placeholder="Longitude" value={inputLon} onChange={handleChange} /></td>
            </tr>
          </tbody>
        </table>
        {/* <MoveableMarker position={{ lat: markerLat, lng: markerLon }} centerLon={boundCenter[1]} />
        {
          markers.map((pos, idx) => <MarkerSet key={idx} markerCoord={pos} icon={greenIcon} id={idx} onclick={removeMarker} />)
        } */}
      </>
    )
  } else {
    return (
      <></>
    )
  }
}

export default CoordinatesInput