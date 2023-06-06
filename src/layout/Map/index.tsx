import 'leaflet'
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store"
import { coordInputSlice } from "store/slice/mapSlice";
import { LayersControl, MapContainer, ZoomControl } from 'react-leaflet'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import "leaflet/dist/leaflet.css";
import 'css/Map.css'
import MouseCoordinates from "layout/MouseCoordinates";
import { MyBaseLayers } from "components/Baselayers";
import DataPanel from "layout/DataPanel";
import { LanguageControl } from 'components/LanguageControl'
import { CPlanControl } from 'components/CplanControl';
import { DragDrop } from 'components/DragDrop';
import { SeafloorControl } from 'components/SeafloorControl';
// @ts-ignore
import 'leaflet-measure/'
import 'leaflet-measure/dist/leaflet-measure.css';
import { account } from 'Utils/UtilsAccount'
import { SignInControl } from 'components/SignInControl';
import { CustomScaleControl } from 'components/CustomScaleControl';
import { ScaleUnitType } from 'types'
import { ScreenshotControl } from 'components/ScreenshotControl';
import { Graticule } from 'components/Graticule/index';
import { Stack } from '@mui/material';
declare const L: any;

interface UnitSwitch {
  [index: string]: ScaleUnitType
}
const unitSwitch: UnitSwitch = {
  'metric': 'nautical',
  'nautical': 'imperial',
  'imperial': 'metric',
}

const LeafletMap = () => {
  const mapRef = useRef<any>()
  const ref = useRef<any>()
  const dispatch = useDispatch()
  const timeNow = new Date()
  const scaleUnit = useSelector((state: RootState) => state.coordInput.scaleUnit);
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
        ref={mapRef}
        key={scaleUnit} //to update map
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
      // worldCopyJump={true}
      >
        <div id={'LengendContainer'} style={{ display: 'flex', flexDirection: 'column-reverse', position: 'absolute', bottom: 25, zIndex: 1000 }}></div>
        <Stack direction="column">
          <SignInControl />
          <LanguageControl />
          <MyBaseLayers />
          <ZoomControl position="topright" />
          <CPlanControl />
          <ScreenshotControl position="topright" />
          <SeafloorControl />
        </Stack>
        <CustomScaleControl
          ref={ref}
          metric={scaleUnit === 'metric' ? true : false}
          nautical={scaleUnit === 'nautical' ? true : false}
          imperial={scaleUnit === 'imperial' ? true : false}
          onClick={() => dispatch(coordInputSlice.actions.scaleUnitSwitch(scaleUnit))}
        />
        <MouseCoordinates />
        <DataPanel />
        <DragDrop />
        <Graticule />
      </MapContainer>
    </>
  )
}

export default LeafletMap;
