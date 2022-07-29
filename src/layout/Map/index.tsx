import 'leaflet'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store"
import { coordInputSlice } from "store/slice/mapSlice";
import { MapContainer, ZoomControl, ScaleControl } from 'react-leaflet'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import "leaflet/dist/leaflet.css";
import 'css/Map.css'
import { useEffect, useRef, useState, useMemo } from "react";
import MouseCoordinates from "layout/MouseCoordinates";
import MyBaseLayers from "components/Baselayers";
import DataPanel from "layout/DataPanel";
import LayerLegend from 'components/LayerLegend';
import { LanguageControl } from 'components/LanguageControl'
import { DepthMeter } from 'components/DepthMeter';
import { RenderIf } from 'components/RenderIf/RenderIf';
import { CPlan } from 'components/Cplan';
// @ts-ignore
import 'leaflet-measure/'
// @ts-ignore
import "./leaflet.latlng-graticule.js"
import 'leaflet-measure/dist/leaflet-measure.css';

declare const L: any;
// const MeasureControl = withLeaflet(MeasureControlDefault);

const addLeafletMeasureControl = (map: L.Map) => {
  const measureControl = new L.Control.Measure({
    position: 'topright',
    lineColor: 'blue',
    primaryLengthUnit: 'kilometers',
    secondaryLengthUnit: 'nauticalmiles',
    primaryAreaUnit: 'sqkilometers',
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
  })
  measureControl.addTo(map);
}
const addGraticule = (map: L.Map) => {
  const graticule = new L.latlngGraticule({
    showLabel: true,
    dashArray: [0, 0],
    opacity: 0.5,
    weight: 0.5,
    font: '12px Rubik',
    zoomInterval: [
      { start: 2, end: 3, interval: 30 },
      { start: 4, end: 4, interval: 10 },
      { start: 5, end: 6, interval: 5 },
      { start: 7, end: 7, interval: 2 },
      { start: 8, end: 9, interval: 1 },
      { start: 10, end: 11, interval: 0.5 },
    ]
  })
  graticule.addTo(map);
}
const is3D = (identifier: string) => identifier.slice(0, 2) === '3d' ? true : false
const LeafletMap = () => {
  const dispatch = useDispatch()
  const timeNow = new Date()
  const datetime = useSelector((state: RootState) => state.coordInput.datetime);
  const layerIdentifier = useSelector((state: RootState) => state.coordInput.layerIdent);
  return (
    <>
      <Flatpickr
        className='dateTimePicker'
        data-enable-time
        value={Date.parse(datetime)}
        onChange={([datetime]) => dispatch(coordInputSlice.actions.changeDatetime(datetime.toISOString()))}
        options={{
          maxDate: timeNow.setDate(timeNow.getDate() + 9),
          time_24hr: true,
          allowInput: false,
          minuteIncrement: 10,
          weekNumbers: true,
        }}
      />
      <LayerLegend />
      <MapContainer
        id='mapContainer'
        className='mapContainer'
        center={[23.5, 121]}
        zoom={7}
        minZoom={2}
        maxZoom={18}
        zoomControl={false}
        preferCanvas={true}
        doubleClickZoom={false}
        renderer={L.canvas()}
        maxBounds={[[90, -239], [-90, 481]]} //121+-360為中心設定邊界減少載入
        whenCreated={(map) => {
          addLeafletMeasureControl(map);
          addGraticule(map)
        }}
      >
        <LanguageControl position='topright' />
        <MyBaseLayers />
        <ZoomControl position="topright" />
        <ScaleControl imperial={false} />
        <MouseCoordinates />
        <DataPanel />
        <CPlan />
        <RenderIf isTrue={is3D(layerIdentifier)}>
          <DepthMeter opacity={1} />
        </RenderIf>
      </MapContainer>

    </>
  )
}

export default LeafletMap;