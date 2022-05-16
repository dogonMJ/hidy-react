import L from "leaflet";
import { Marker, Popup } from 'react-leaflet'
import FormatCoordinate from 'components/FormatCoordinate'
import { RootState } from "store/store"
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button, Stack } from '@mui/material';

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

const MarkerSet = (props: markerSet) => {
  const { t } = useTranslation();
  const latlonFormat = useSelector((state: RootState) => state.coordInput.latlonformat)
  const [markerLat, markerLon] = [...props.markerCoord]
  if (markerLat !== null && markerLon !== null) {
    if (props.id !== undefined) {
      return (
        <Marker position={[markerLat, markerLon]} icon={greenIcon} >
          <Popup>
            <Stack>
              <FormatCoordinate coords={{ lat: markerLat, lng: markerLon }} format={latlonFormat} />
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
        <Marker position={[markerLat, markerLon]} icon={blueIcon} >
          <Popup>
            <FormatCoordinate coords={{ lat: markerLat, lng: markerLon }} format={latlonFormat} />
          </Popup>
        </Marker>
      )
    }
  } else {
    return <></>
  }
}

export default MarkerSet