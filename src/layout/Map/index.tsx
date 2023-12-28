import 'leaflet'
import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { MapContainer, ZoomControl } from 'react-leaflet'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import "leaflet/dist/leaflet.css";
import 'css/Map.css'
import { Stack } from '@mui/material';
import MouseCoordinates from "layout/MouseCoordinates";
import DataPanel from "layout/DataPanel";
import { MyBaseLayers } from "components/Baselayers";
import { LanguageControl } from 'components/LanguageControl'
import { CPlanControl } from 'components/CplanControl';
import { DragDrop } from 'components/DragDrop';
import { SeafloorControl } from 'components/SeafloorControl';
// @ts-ignore
import 'leaflet-measure/'
import 'leaflet-measure/dist/leaflet-measure.css';
import { account } from 'Utils/UtilsAccount'
import { readUrlQuery } from "Utils/UtilsStates";
import { SignInControl } from 'components/SignInControl';
import { CustomScaleControl } from 'components/CustomScaleControl';
import { ScreenshotControl } from 'components/ScreenshotControl';
import { Graticule } from 'components/Graticule/index';
import { ShareControl } from 'components/ShareControl/indext';
import { mapSlice } from 'store/slice/mapSlice';
import { isCenter } from 'Utils/UtilsMap';

declare const L: any;

const LeafletMap = () => {
  const mapRef = useRef<any>()
  const dispatch = useAppDispatch()
  const defaultOptions = readUrlQuery('map')
  const defaultZoom = defaultOptions && Number(defaultOptions.z) ? Number(defaultOptions.z) : 7
  const defaultCenter = defaultOptions && isCenter(defaultOptions.c) ? JSON.parse(defaultOptions.c) : [23.5, 121]
  const defaultDate = useAppSelector(state => state.map.datetime)
  const timeNow = new Date()
  const checkLogin = async () => {
    const userInfo = await account.getUserInfo()
    dispatch(mapSlice.actions.userInfo(userInfo))
  }

  useEffect(() => {
    checkLogin()
  }, [])
  return (
    <>
      <MapContainer
        ref={mapRef}
        id='mapContainer'
        className='mapContainer'
        center={defaultCenter}
        zoom={defaultZoom}
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
        <Flatpickr
          id={'dateTimePicker'}
          className='dateTimePicker'
          data-enable-time
          // value={datetime}
          onChange={([datetime]) => dispatch(mapSlice.actions.setDatetime(datetime.toISOString()))}
          options={{
            defaultDate: defaultDate,
            maxDate: timeNow.setDate(timeNow.getDate() + 9),
            time_24hr: true,
            allowInput: false,
            minuteIncrement: 10,
            weekNumbers: true,
          }}
        />
        <div id={'LengendContainer'} style={{ display: 'flex', flexDirection: 'column-reverse', position: 'absolute', bottom: 25, zIndex: 1000 }}></div>
        <Stack direction="column">
          <SignInControl />
          <ShareControl />
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
