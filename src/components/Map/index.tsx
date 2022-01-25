import { useState, useMemo, } from "react";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, LayersControl, ZoomControl, ScaleControl } from 'react-leaflet'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import "leaflet/dist/leaflet.css";
import './Map.css'
// @ts-ignore
import { BingLayer } from 'react-leaflet-bing-v2' //not yet ts version
import { RootState } from "store/store"
import ProcUrls from 'components/Map/Urlchange'
import { CoordinatesInput, MouseCoordinates } from 'components/MapPosition'
const { BaseLayer } = LayersControl;

const LeafletMap = () => {
  const d = new Date()
  const utc = Math.floor((d.getTime() + d.getTimezoneOffset() * 60 * 1000) / (60 * 1000 * 10)) * (60 * 1000 * 10)
  const [datetime, setDatetime] = useState(new Date(utc));
  const [isswhowindow ,sei] useState<boolean>(fasle)
  const bing_key = 'AtxhFL61gkrGg34Rd6hUnrZbAYu3s_fpbocD79mi7w3YEWzY0SoK2wD0HJJlgg4I'
  
  const inputStat = useSelector((state: RootState) => state.inputActive.active);
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
        <CoordinatesInput active={inputStat} />
        <ScaleControl imperial={false} />
        {/* <MouseCoordinates inputStatus={coordInputStauts} /> */}
        <MouseCoordinates />
        {isㄊㄟ}
        {movable && <}
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