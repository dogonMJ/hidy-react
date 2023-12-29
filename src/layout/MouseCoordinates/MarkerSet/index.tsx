import L from "leaflet";
import { Marker, Popup } from 'react-leaflet'
import FormatCoordinate from 'components/FormatCoordinate'
import { useTranslation } from "react-i18next";
import { Button, Stack, } from '@mui/material';
import { memo, useState } from "react";
import { useAppSelector } from "hooks/reduxHooks";

interface markerSet {
  markerCoord: (number | null)[],
  id?: number,
  onclick?: (evt: React.MouseEvent<HTMLButtonElement>) => void,
}
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const MarkerSet = memo((props: markerSet) => {
  const { t } = useTranslation();
  const latlonFormat = useAppSelector(state => state.map.latlonformat)
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
      fetch(`https://ecodata.odb.ntu.edu.tw/gebco?lon=${lon}&lat=${markerLat}`)
        .then(res => res.json())
        .then(json => setElevation(json.z[0]))
    }
  }

  if (markerLat !== null && markerLon !== null) {
    if (props.id !== undefined) {
      return (
        <Marker position={[markerLat, markerLon]} icon={greenIcon} eventHandlers={{ popupopen: popupopen }}>
          <Popup>
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
        <Marker position={[markerLat, markerLon]} icon={blueIcon} eventHandlers={{ popupopen: popupopen }} >
          <Popup>
            <FormatCoordinate coords={{ lat: markerLat, lng: markerLon }} format={latlonFormat} />
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