import { useState } from "react";
import { useSelector } from "react-redux";
import { MapContainer, ZoomControl, ScaleControl } from 'react-leaflet'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import "leaflet/dist/leaflet.css";
import 'css/Map.css'
import { RootState } from "store/store"
import CoordinatesInput from "components/CoordinatesInput"
import MouseCoordinates from "components/MouseCoordinates";
import MyBaseLayers from "components/Baselayers";
import APILayers from "components/APIlayers";
import MoveableMarker from "components/MoveableMarker";
import PinnedMarker from "components/PinnedMarker";

const LeafletMap = () => {
  const d = new Date()
  const utc = Math.floor((d.getTime() + d.getTimezoneOffset() * 60 * 1000) / (60 * 1000 * 10)) * (60 * 1000 * 10)
  const [datetime, setDatetime] = useState(new Date(utc));
  // const [isswhowindow ,sei] useState<boolean>(fasle)
  const inputStat = useSelector((state: RootState) => state.coordInput.active);
  const inputLat = useSelector((state: RootState) => state.coordInput.inputLat)
  const inputLon = useSelector((state: RootState) => state.coordInput.inputLon)
  const mapCenter: number = 121
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
        center={[23.5, mapCenter]}
        zoom={7}
        minZoom={2}
        zoomControl={false}
        maxBounds={[[90, -239], [-90, 481]]} //121+-360為中心設定邊界減少載入
      >
        <CoordinatesInput active={inputStat} />
        <ScaleControl imperial={false} />
        <MouseCoordinates />
        <MyBaseLayers />
        <APILayers datetime={datetime} />
        {/* 
        {isㄊㄟ}
        */}
        {inputStat && <MoveableMarker position={{ lat: inputLat, lng: inputLon }} centerLon={mapCenter} />}
        {inputStat && <PinnedMarker />}
        <ZoomControl position="topright" />
      </MapContainer>
    </>
  )
}

export default LeafletMap;