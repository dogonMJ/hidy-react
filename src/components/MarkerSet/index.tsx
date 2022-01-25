interface markerSet {
    markerCoord: (number | null)[],
    icon: L.Icon,
    id?: number,
    onclick?: (evt: React.MouseEvent<HTMLButtonElement>) => void,
  }
  
  
  const MarkerSet = (props: markerSet) => {
    const [markerLat, markerLon] = [...props.markerCoord]
    if (markerLat !== null && markerLon !== null) {
      if (props.id !== undefined) {
        return (
          <Marker position={[markerLat, markerLon]} icon={greenIcon} >
            <Popup>
              <table className="popupMarker">
                <FormatCoordinate position={{ lat: markerLat, lng: markerLon }} />
              </table>
              <button className='markerRemoveBtn' onClick={props.onclick} data-idx={props.id}>remove</button>
            </Popup>
          </Marker>
        )
      } else {
        return (
          <Marker position={[markerLat, markerLon]} icon={props.icon}  >
            <Popup>
              <table className="popupMarker">
                <FormatCoordinate position={{ lat: markerLat, lng: markerLon }} />
              </table>
            </Popup>
          </Marker>
        )
      }
    } else {
      return <></>
    }
  }