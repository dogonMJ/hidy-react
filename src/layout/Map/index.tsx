import 'leaflet'
import { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store"
import { coordInputSlice } from "store/slice/mapSlice";
import { MapContainer, ZoomControl } from 'react-leaflet'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import "leaflet/dist/leaflet.css";
import 'css/Map.css'
import MouseCoordinates from "layout/MouseCoordinates";
import MyBaseLayers from "components/Baselayers";
import DataPanel from "layout/DataPanel";
import { LanguageControl } from 'components/LanguageControl'
import { CPlanControl } from 'components/CplanControl';
import { DragDrop } from 'components/DragDrop';
import { SeafloorControl } from 'components/SeafloorControl';
// @ts-ignore
import 'leaflet-measure/'
// @ts-ignore
import "./leaflet.latlng-graticule.js"
import 'leaflet-measure/dist/leaflet-measure.css';
import { account } from 'Utils/UtilsAccount'
import { SignInControl } from 'components/SignInControl';
import CustomControl from "react-leaflet-custom-control";
import { CustomScaleControl } from 'components/CustomScaleControl';
import { ScaleUnitType } from 'types'
import { ScreenshotControl } from 'components/ScreenshotControl';
declare const L: any;
// const MeasureControl = withLeaflet(MeasureControlDefault);

// const addLeafletMeasureControl = (map: L.Map) => {
//   const measureControl = new L.Control.Measure({
//     position: 'topright',
//     lineColor: 'blue',
//     primaryLengthUnit: 'kilometers',
//     secondaryLengthUnit: 'nauticalmiles',
//     primaryAreaUnit: 'sqkilometers',
//     secondaryAreaUnit: 'hectares',
//     units: {
//       nauticalmiles: {
//         factor: 1 / 1852,
//         display: 'nm',
//         decimals: 1
//       },
//       sqkilometers: {
//         factor: 1 / 1000000,
//         display: 'km\u00B2',
//         decimals: 1
//       }
//     }
//   })
//   measureControl.addTo(map);
// }

interface UnitSwitch {
  [index: string]: ScaleUnitType
}
const unitSwitch: UnitSwitch = {
  'metric': 'nautical',
  'nautical': 'imperial',
  'imperial': 'metric',
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

const LeafletMap = () => {
  const dispatch = useDispatch()
  const timeNow = new Date()
  const scaleUnit = useSelector((state: RootState) => state.coordInput.scaleUnit);
  // const datetime = useSelector((state: RootState) => state.coordInput.datetime);
  const checkLogin = async () => {
    const userInfo = await account.getUserInfo()
    dispatch(coordInputSlice.actions.userInfo(userInfo))
  }
  checkLogin()

  return (
    <>
      <Flatpickr
        className='dateTimePicker'
        data-enable-time
        // value={datetime}
        onChange={([datetime]) => dispatch(coordInputSlice.actions.changeDatetime(datetime.toISOString()))}
        options={{
          defaultDate: new Date(),
          maxDate: timeNow.setDate(timeNow.getDate() + 9),
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
        preferCanvas={true}
        doubleClickZoom={false}
        dragging={true}
        renderer={L.canvas({ tolerance: 3 })}
        maxBounds={[[90, -239], [-90, 481]]} //121+-360為中心設定邊界減少載入
        whenCreated={(map) => {
          addGraticule(map)
        }}
      // worldCopyJump={true}
      >
        <div id={'LengendContainer'} style={{ display: 'flex', flexDirection: 'column-reverse', position: 'absolute', bottom: 25, zIndex: 1000 }}></div>
        <CustomControl position='topright'>
          <SignInControl />
          <MyBaseLayers />
          <ZoomControl position="topright" />
          <CPlanControl />
          <LanguageControl />
          <ScreenshotControl position="topright" />
          <SeafloorControl />
        </CustomControl>
        <CustomControl position='bottomleft'>
          <CustomScaleControl
            metric={scaleUnit === 'metric' ? true : false}
            nautical={scaleUnit === 'nautical' ? true : false}
            imperial={scaleUnit === 'imperial' ? true : false}
            onClick={() => dispatch(coordInputSlice.actions.scaleUnitSwitch(unitSwitch[scaleUnit]))}
          />
        </CustomControl>
        <ScreenshotControl position="bottomright" />
        <MouseCoordinates />
        <DataPanel />
        <DragDrop />
      </MapContainer>
    </>
  )
}

export default LeafletMap;