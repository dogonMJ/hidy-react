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
import 'leaflet'
// @ts-ignore
import 'leaflet-measure/'
import 'leaflet-measure/dist/leaflet-measure.css';
// @ts-ignore
import Cache from 'cachai';

declare const L: any;
// const MeasureControl = withLeaflet(MeasureControlDefault);
const cache = new Cache(400)
const addLeafletMeasureControl = (map: L.Map) => {
  const measureControl = new L.Control.Measure({
    position: 'topright',
    lineColor: 'blue',
    primaryLengthUnit: 'kilometers',
    secondaryLengthUnit: 'nauticalmiles',
    primaryAreaUnit: 'acres',
    secondaryAreaUnit: 'hectares',
    units: {
      nauticalmiles: {
        factor: 1 / 1852,
        display: 'nm',
        decimals: 1
      },
      sqkilometers: {
        factor: 1 / 1000000,
        display: 'km\u00B2',
        decimals: 1
      }
    }
  });
  measureControl.addTo(map);
}
const LeafletMap = () => {
  const d = new Date()
  const [datetime, setDatetime] = useState(d);//new Date(utc)
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
          maxDate: d,
          time_24hr: true,
          allowInput: false,
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
        whenCreated={(map) => addLeafletMeasureControl(map)}
      >
        <CoordinatesInput active={inputStat} />
        <APILayers datetime={datetime} cache={cache} />
        <ScaleControl imperial={false} />
        <MouseCoordinates />
        <MyBaseLayers />

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