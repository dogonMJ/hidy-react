import L from "leaflet";
import { Marker, Popup } from 'react-leaflet'
import formatCoordinate from 'components/FormatCoordinate'

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
  const [markerLat, markerLon] = [...props.markerCoord]
  if (markerLat !== null && markerLon !== null) {
    if (props.id !== undefined) {
      return (
        <Marker position={[markerLat, markerLon]} icon={greenIcon} >
          <Popup>
            {/* <table className="popupMarker"> 
            <FormatCoordinate position={{ lat: markerLat, lng: markerLon }} />     
            </table> */}
            {formatCoordinate({ lat: markerLat, lng: markerLon }, 'latlon-dms')}
            <br />
            <button className='markerRemoveBtn' onClick={props.onclick} data-idx={props.id}>remove</button>
          </Popup>
        </Marker>
      )
    } else {
      return (
        <Marker position={[markerLat, markerLon]} icon={blueIcon}  >
          <Popup>
            {/* <table className="popupMarker">
            <FormatCoordinate position={{ lat: markerLat, lng: markerLon }} />
            </table> */}
            {formatCoordinate({ lat: markerLat, lng: markerLon }, 'latlon-dms')}
          </Popup>
        </Marker>
      )
    }
  } else {
    return <></>
  }
}

export default MarkerSet