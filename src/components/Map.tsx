import React, { useEffect, useState, useRef, useMemo, EventHandler, ChangeEvent } from "react";
import "flatpickr/dist/themes/dark.css";
import Flatpickr from "react-flatpickr";
import "leaflet/dist/leaflet.css";
import L, { LatLng, LatLngBoundsLiteral, LatLngExpression, layerGroup } from "leaflet";
import './Map.css'
// import Urls from './Urlchange'
import { MapContainer, TileLayer, LayersControl, ZoomControl, ScaleControl, useMapEvent, Marker, Popup, useMap, LayerGroup } from 'react-leaflet'
// @ts-ignore
import { BingLayer } from 'react-leaflet-bing-v2' //not yet ts version
import { FunctionExpression } from "typescript";

const { BaseLayer, Overlay } = LayersControl;

interface coords {
  lat: number,
  lng: number
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
const marker = (markerCoord: (number | null)[], icon: L.Icon, key?: number, onclick?: any) => {
  const [markerLat, markerLon] = [...markerCoord]
  if (markerLat !== null && markerLon !== null) {
    if (key !== undefined) {
      return (
        <Marker key={key} position={[markerLat, markerLon]} icon={greenIcon} >
          <Popup>
            <table className="popupMarker">
              <FormatCoordinate position={{ lat: markerLat, lng: markerLon }} />
            </table>
            <button className='markerRemoveBtn' onClick={onclick} data-idx={key}>remove</button>
          </Popup>
        </Marker>
      )
    } else {
      return (
        <Marker position={[markerLat, markerLon]} icon={icon}  >
          <Popup>
            <table className="popupMarker">
              <FormatCoordinate position={{ lat: markerLat, lng: markerLon }} />
            </table>
          </Popup>
        </Marker>
      )
    }
  }
}
const MoveableMarker = (props: { position: coords, centerLon: number }) => {
  const markerLat = props.position.lat
  const markerLon = props.position.lng
  let markerLon2;
  if (markerLon <= props.centerLon) {//地圖中線
    markerLon2 = markerLon + 360
  } else {
    markerLon2 = markerLon - 360
  }
  return (
    <>
      {marker([markerLat, markerLon], blueIcon)}
      {marker([markerLat, markerLon2], blueIcon)}
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
          markers.map((pos, idx) => marker(pos, greenIcon, idx, removeMarker))
        }
      </>
    )
  } else {
    return (
      <></>
    )
  }

}
const MouseCoordinates = (props: { inputStatus: Function }) => {
  const [active, setActive] = useState<boolean>(true);
  const [coords, setCoords] = useState<coords>({ lat: 0, lng: 0 });

  useMapEvent('mousemove', (evt) => {
    setCoords(evt.latlng)
  })
  const toggleInput = () => {
    setActive(!active)
    props.inputStatus(active)
  }
  return (
    <>
      <table className="mousePos" onClick={toggleInput}>
        <FormatCoordinate position={coords} />
      </table>
    </>
  )
}

interface Urls {
  urlRoot: string
  urlDate: Date
  urlEnd: string
}
const ProcUrls = (props: Urls) => {
  const ref = useRef<any>(null)
  const newDate = props.urlDate.toISOString().split('T')[0]
  const url = props.urlRoot + newDate + props.urlEnd
  useEffect(() => {
    // 3. 觸發side effect，TileLayer執行setUrl method，重繪
    // setUrl: Updates the layer's URL template and redraws it
    ref.current.setUrl(url)
  });
  // 1.更改url

  return (
    <>
      {/* 2.渲染DOM */}
      <TileLayer ref={ref} url={url} />
    </>
  )
}

const LeafletMap = () => {
  const d = new Date()
  const utc = Math.floor((d.getTime() + d.getTimezoneOffset() * 60 * 1000) / (60 * 1000 * 10)) * (60 * 1000 * 10)
  const [datetime, setDatetime] = useState(new Date(utc));
  const bing_key = 'AtxhFL61gkrGg34Rd6hUnrZbAYu3s_fpbocD79mi7w3YEWzY0SoK2wD0HJJlgg4I'
  const baseMaps = useMemo(
    () => (
      // 避免重複渲染
      <>
        <LayersControl position='topright'>
          <BaseLayer name='Open Street Map'>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name='Bing Map' checked>
            <BingLayer
              bingkey={bing_key}
              type="Aerial"
            />
          </BaseLayer>
        </LayersControl>
      </>
    )
    , []
  )
  const [inputActive, setInputActive] = useState<boolean>(false)
  const coordInputStauts = (inputStatus: boolean) => {
    setInputActive(inputStatus)
  }
  return (
    <>
      <Flatpickr
        className='dateTimePicker'
        data-enable-time
        value={datetime}
        onChange={([datetime]) => setDatetime(datetime)}
        options={{
          maxDate: new Date(utc),
          time_24hr: true,
          allowInput: true,
          minuteIncrement: 10,
          weekNumbers: true,
        }}
      />
      <MapContainer
        className='mapContainer'
        center={[23.5, 121]}
        zoom={7}
        minZoom={2}
        zoomControl={false}
        maxBounds={[[90, -239], [-90, 481]]} //121+-360為中心設定邊界減少載入
      >
        <CoordinatesInput active={inputActive} />
        <ScaleControl imperial={false} />
        <MouseCoordinates inputStatus={coordInputStauts} />
        {baseMaps}
        <LayersControl>
          <BaseLayer name='Close'>
            <TileLayer url='' />
          </BaseLayer>
          <BaseLayer name='Sea Surface Temperature'>
            <ProcUrls
              urlRoot="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GHRSST_L4_MUR_Sea_Surface_Temperature/default/"
              urlDate={datetime}
              urlEnd="/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png"
            />
          </BaseLayer>
          <BaseLayer name='Sea Surface Temperature Anomalies'>
            <ProcUrls
              urlRoot="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies/default/"
              urlDate={datetime}
              urlEnd="/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png"
            />
          </BaseLayer>
        </LayersControl>
        <ZoomControl position="topright" />
      </MapContainer>
    </>
  )
}

export default LeafletMap;