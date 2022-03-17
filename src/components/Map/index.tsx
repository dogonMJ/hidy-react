import 'leaflet'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store"
import { coordInputSlice } from "store/slice/mapSlice";
import { MapContainer, ZoomControl, ScaleControl } from 'react-leaflet'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import "leaflet/dist/leaflet.css";
import 'css/Map.css'

import MouseCoordinates from "components/MouseCoordinates";
import MyBaseLayers from "components/Baselayers";
import SwitchLang from 'components/SwitchLang';
import DataPanel from "components/DataPanel";
import AnimatedLayers from "components/DataPanel/AnimatedCurrents/AnimatedLayers";
// @ts-ignore
import 'leaflet-measure/'
import 'leaflet-measure/dist/leaflet-measure.css';

declare const L: any;
// const MeasureControl = withLeaflet(MeasureControlDefault);
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
  const dispatch = useDispatch()
  const d = new Date()
  const datetime = useSelector((state: RootState) => state.coordInput.datetime);
  const identifier = useSelector((state: RootState) => state.coordInput.animateIdent);
  return (
    <>
      <Flatpickr
        className='dateTimePicker'
        data-enable-time
        value={Date.parse(datetime)}
        onChange={([datetime]) => dispatch(coordInputSlice.actions.changeDatetime(datetime.toISOString()))}
        options={{
          maxDate: d,
          time_24hr: true,
          allowInput: false,
          minuteIncrement: 10,
          weekNumbers: true,
        }}
      />
      <MapContainer
        id='mapContainer'
        className='mapContainer'
        center={[23.5, 121]}
        zoom={7}
        minZoom={2}
        maxZoom={18}
        zoomControl={false}
        maxBounds={[[90, -239], [-90, 481]]} //121+-360為中心設定邊界減少載入
        whenCreated={(map) => addLeafletMeasureControl(map)}
      >
        {identifier !== "close" && <AnimatedLayers indetifier={identifier} />}
        <MyBaseLayers />
        <ZoomControl position="topright" />
        <ScaleControl imperial={false} />
        <MouseCoordinates />
        <DataPanel />
        <SwitchLang />
      </MapContainer>
    </>
  )
}

export default LeafletMap;