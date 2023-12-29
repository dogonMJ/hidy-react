import { coor } from 'types';
import { MarkerSet } from "layout/MouseCoordinates/MarkerSet";
import { memo } from 'react';

export const MoveableMarker = memo((props: { position: coor, centerLon: number }) => {
  const markerLat = props.position.lat
  const markerLon = props.position.lng
  let markerLon2;
  if (markerLon <= props.centerLon) { //地圖中線
    markerLon2 = markerLon + 360
  } else {
    markerLon2 = markerLon - 360
  }
  return (
    <>
      {/* <MarkerSet markerCoord={[markerLat, markerLon]} />
      <MarkerSet markerCoord={[markerLat, markerLon2]} /> */}
      <MarkerSet markerCoord={[markerLat, markerLon]} />
      <MarkerSet markerCoord={[markerLat, markerLon2]} />
    </>
  )
}
)