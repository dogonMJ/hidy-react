import 'leaflet'
import { useRef } from 'react';
import { useDispatch } from "react-redux";
import { coordInputSlice } from "store/slice/mapSlice";
import { MapContainer, ZoomControl } from 'react-leaflet'
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
import { ScreenshotControl } from 'components/ScreenshotControl';
import { Graticule } from 'components/Graticule/index';
import { Stack } from '@mui/material';
declare const L: any;

const LeafletMap = () => {
  const mapRef = useRef<any>()
  const dispatch = useDispatch()
  const timeNow = new Date()
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
        <CustomScaleControl />
        <MouseCoordinates />
        <DataPanel />
        <DragDrop />
        <Graticule />
      </MapContainer>
    </>
  )
}

export default LeafletMap;
