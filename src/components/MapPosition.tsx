import React, { useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMapEvent, Marker, Popup, useMap } from 'react-leaflet'
import "flatpickr/dist/themes/dark.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { RootState } from "../store/store"
import { inputActiveSlice } from "../store/slice/mapSlice";
import { coor } from 'types';

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


const MoveableMarker = (props: { position: coor, centerLon: number }) => {
  const markerLat = props.position.lat
  const markerLon = props.position.lng
  let markerLon2;
  if (markerLon <= props.centerLon) { //地圖中線
    markerLon2 = markerLon + 360
  } else {
    markerLon2 = markerLon - 360
  }
  return (
    <>
      <MarkerSet markerCoord={[markerLat, markerLon]} icon={blueIcon} />
      <MarkerSet markerCoord={[markerLat, markerLon2]} icon={blueIcon} />
    </>
  )
}

const CoordinatesInput = (props: { active: boolean }) => {
  const map = useMap();
  const boundCenter: any = map.options.center
  const [markerLat, setMarkerLat] = useState<number>(map.getCenter().lat)
  const [markerLon, setMarkerLon] = useState<number>(map.getCenter().lng)
  const [markers, setMarkers] = useState<Array<Array<number | null>>>([[null, null]])
  const handleChange = (evt: ChangeEvent) => {
    const target = evt.target as HTMLInputElement
    if (target.placeholder === 'Latitude') {
      setMarkerLat(Number(target.value))
    } else {
      setMarkerLon(Number(target.value))
    }
  }
  const addMarkerBtn = () => {
    let markerLon2: number;
    if (markerLon <= boundCenter[1]) { //中線
      markerLon2 = markerLon + 360
    } else {
      markerLon2 = markerLon - 360
    }
    setMarkers([...markers, [markerLat, markerLon], [markerLat, markerLon2]])
  }
  const removeMarker = (evt: React.MouseEvent<HTMLButtonElement>): void => {
    const target = evt.target as HTMLButtonElement
    const idx = Number(target.dataset.idx)
    if (idx % 2 === 0) {
      // idx=0 is [null,null]
      markers.splice(idx - 1, 2)
    } else {
      markers.splice(idx, 2)
    }
    setMarkers([...markers])
  }
  const flyTo = () => {
    map.flyTo([markerLat, markerLon])
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
              <td><input type="number" placeholder="Latitude" value={markerLat} onChange={handleChange} /></td>
              <td>,</td>
              <td><input type="number" placeholder="Longitude" value={markerLon} onChange={handleChange} /></td>
            </tr>
          </tbody>
        </table>
        <MoveableMarker position={{ lat: markerLat, lng: markerLon }} centerLon={boundCenter[1]} />
        {
          markers.map((pos, idx) => <MarkerSet key={idx} markerCoord={pos} icon={greenIcon} id={idx} onclick={removeMarker} />)
        } 
      </>
    )
  } else {
    return (
      <></>
    )
  }
}
const MouseCoordinates = () => {
  const dispatch = useDispatch()
  const inputActiveState = useSelector((state: RootState) => state.inputActive)
  const [coords, setCoords] = useState<coor>({ lat: 0, lng: 0 });
  useMapEvent('mousemove', (evt) => {
    setCoords(evt.latlng)
  })
  const toggleInput = () => {
    dispatch(inputActiveSlice.actions.switchActive(
      !inputActiveState.active
    ));
  }
  return (
    <>
      <table className="mousePos" onClick={toggleInput}>
        <FormatCoordinate position={coords} />
      </table>
    </>
  )
}

export { CoordinatesInput, MouseCoordinates }
