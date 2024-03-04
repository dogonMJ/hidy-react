import { coor } from 'types';
import { MarkerSet } from "layout/MouseCoordinates/MarkerSet";
import { FC, memo } from 'react';
interface MoveableMarkerType {
  position: coor
  centerLon: number

}

export const MoveableMarker: FC<MoveableMarkerType> = memo(({ position, centerLon, ...rest }) => {
  const markerLat = position.lat
  const markerLon = position.lng
  let markerLon2;
  if (markerLon <= centerLon) { //地圖中線
    markerLon2 = markerLon + 360
  } else {
    markerLon2 = markerLon - 360
  }
  return (
    <>
      {/* <MarkerSet markerCoord={[markerLat, markerLon]} />
      <MarkerSet markerCoord={[markerLat, markerLon2]} /> */}
      <MarkerSet markerCoord={[markerLat, markerLon]} {...rest} />
      <MarkerSet markerCoord={[markerLat, markerLon2]} {...rest} />
    </>
  )
}
)