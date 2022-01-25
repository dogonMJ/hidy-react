import React, { useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMapEvent, Marker, Popup, useMap } from 'react-leaflet'
import "flatpickr/dist/themes/dark.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { RootState } from "../store/store"
import { inputActiveSlice } from "../store/slice/mapSlice";

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
interface coords {
  lat: number,
  lng: number
}
interface markerSet {
  markerCoord: (number | null)[],
  icon: L.Icon,
  id?: number,
  onclick?: any,
}
const formatLonLat = (degree: number) => {
  const deg = Number(degree)
  const d = Math.trunc(deg);
  const minfloat = Math.abs(deg - d) * 60;
  const m = Math.floor(minfloat);
  const s = Math.round((minfloat - m) * 60);
  const m4 = minfloat.toFixed(2).padStart(5, '0')
  const min = m.toString().padStart(2, '0')
  const sec = s.toString().padStart(2, '0')
  return [deg.toFixed(5), m4, d.toString(), min, sec]
}

const FormatCoordinate = (props: { position: coords }) => {
  const lat = props.position.lat
  let lon = props.position.lng
  const mutiple = Math.floor(lon / 360)
  if (mutiple > 0) {
    lon = lon - 360 * mutiple
  } else if (mutiple < 0) {
    lon = lon + 360 * Math.abs(mutiple)
  }
  if (lon > 180) { lon -= 360 }

  const [latD5, latM4, latD, latM, latS] = [...formatLonLat(lat)]
  const [lonD5, lonM4, lonD, lonM, lonS] = [...formatLonLat(lon)]
  return (
    <tbody>
      <tr >
        <td>Latitude</td>
        <td>,</td>
        <td>Longitude{"\u00A0"}</td>
      </tr>
      <tr>
        <td>{latD + "\u00B0" + latM + "'" + latS + '"'}</td>
        <td>,</td>
        <td>{lonD + "\u00B0" + lonM + "'" + lonS + '"'}</td>
      </tr>
      <tr>
        <td>{latD + "\u00B0" + latM4 + "'"}</td>
        <td>, </td>
        <td>{lonD + "\u00B0" + lonM4 + "'"}</td>
      </tr>
      <tr>
        <td>{latD5 + "\u00B0"}</td>
        <td>, </td>
        <td>{lonD5 + "\u00B0"}</td>
      </tr>
    </tbody>
  )
}
const MarkerSet = (props: markerSet) => {
  const [markerLat, markerLon] = [...props.markerCoord]
  if (markerLat !== null && markerLon !== null) {
    if (props.id !== undefined) {
      return (
        <Marker position={[markerLat, markerLon]} icon={greenIcon} >
          <Popup>
            <table className="popupMarker">
              <FormatCoordinate position={{ lat: markerLat, lng: markerLon }} />
            </table>
            <button className='markerRemoveBtn' onClick={props.onclick} data-idx={props.id}>remove</button>
          </Popup>
        </Marker>
      )
    } else {
      return (
        <Marker position={[markerLat, markerLon]} icon={props.icon}  >
          <Popup>
            <table className="popupMarker">
              <FormatCoordinate position={{ lat: markerLat, lng: markerLon }} />
            </table>
          </Popup>
        </Marker>
      )
    }
  } else {
    return <></>
  }
}
const MoveableMarker = (props: { position: coords, centerLon: number }) => {
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
  const removeMarker = (evt: React.MouseEvent<HTMLButtonElement>) => {
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
  const [coords, setCoords] = useState<coords>({ lat: 0, lng: 0 });
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
