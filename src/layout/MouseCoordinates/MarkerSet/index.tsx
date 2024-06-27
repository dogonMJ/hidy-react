import L from "leaflet";
import { Marker, Popup } from 'react-leaflet'
import FormatCoordinate from 'components/FormatCoordinate'
import { useTranslation } from "react-i18next";
import { Button, Stack, } from '@mui/material';
import { forwardRef, memo, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { coordInputSlice } from "store/slice/coordInputSlice";
import blueIconPng from 'assets/images/marker-icon-blue.png';
import greenIconPng from 'assets/images/marker-icon-green.png';
import shadowPng from 'assets/images/marker-shadow.png'

interface markerSet {
  markerCoord: (number | null)[],
  id?: number,
  onclick?: (evt: React.MouseEvent<HTMLButtonElement>) => void,
  openPopup?: boolean
}
const greenIcon = new L.Icon({
  iconUrl: greenIconPng,
  shadowUrl: shadowPng,
  iconSize: [20, 31],
  iconAnchor: [10.5, 31],
  popupAnchor: [1, -30],
  shadowSize: [31, 31]
});

const blueIcon = new L.Icon({
  iconUrl: blueIconPng,
  shadowUrl: shadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const round5 = (n: number) => Math.round(n * 100000) / 100000

export const MarkerSet = forwardRef((props: markerSet, fowardRef: any) => {
  const ref = useRef<any>()
  const dispatch = useAppDispatch()
  const { t } = useTranslation();
  const latlonFormat = useAppSelector(state => state.map.latlonformat)
  const position = useAppSelector(state => state.coordInput.current)
  const [markerLat, markerLon] = [...props.markerCoord]
  const [elevation, setElevation] = useState(null)
  const popupopen = () => {
    if (markerLat !== null && markerLon !== null) {
      let lon = markerLon
      if (markerLon > 180) {
        const round = Math.round(markerLon / 360)
        lon = markerLon - 360 * round
      } else if (markerLon < -180) {
        const round = -Math.round(markerLon / 360)
        lon = markerLon + 360 * round
      }
      fetch(`${process.env.REACT_APP_PROXY_BASE}/data/gebco?lon=${lon}&lat=${markerLat}`)
        .then(res => res.json())
        .then(json => setElevation(json.z[0]))
    }
  }
  const onDrag = () => {
    const latlng = ref.current.getLatLng()
    dispatch(coordInputSlice.actions.setCurrent([round5(latlng.lat), round5(latlng.lng)]))
  }
  const onDragEnd = () => {
    const latlng = ref.current.getLatLng()
    dispatch(coordInputSlice.actions.setCurrent([round5(latlng.lat), round5(latlng.lng)]))
  }

  if (markerLat !== null && markerLon !== null) {
    if (props.id !== undefined) {
      return (
        <Marker ref={fowardRef} position={[markerLat, markerLon]} icon={greenIcon} eventHandlers={{ popupopen: popupopen }}>
          <Popup autoClose={false}>
            <Stack>
              <FormatCoordinate coords={{ lat: markerLat, lng: markerLon }} format={latlonFormat} />
              {elevation && <div>Elevation: {elevation} m</div>}
              <Button
                size="small"
                style={{ padding: 0, height: '1rem', marginTop: '5px' }}
                onClick={props.onclick}
                data-idx={props.id}>
                {t('remove')}
              </Button>
            </Stack>
          </Popup>
        </Marker>
      )
    } else {
      return (
        <Marker ref={ref} position={position} icon={blueIcon} eventHandlers={{ popupopen: popupopen, dragend: onDragEnd, drag: onDrag }} draggable={true}>
          <Popup>
            <FormatCoordinate coords={position} format={latlonFormat} />
            {elevation && <div>Elevation: {elevation} m</div>}
          </Popup>
        </Marker>
      )
    }
  } else {
    return <></>
  }
}
)