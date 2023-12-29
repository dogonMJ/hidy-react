import { useState } from "react";
import { useMapEvent } from 'react-leaflet'
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { CoordinatesInput } from "layout/MouseCoordinates/CoordinatesInput"
import FormatCoordinate from "components/FormatCoordinate";
import { PinnedMarker } from "layout/MouseCoordinates/PinnedMarker";
import { MoveableMarker } from "layout/MouseCoordinates/MoveableMarker";
import { IconButton, Paper } from '@mui/material';
import { LocationOff, LocationOn, SyncAlt } from '@mui/icons-material';
import { useMapDragScroll } from "hooks/useMapDragScroll";
import { onoffsSlice } from "store/slice/onoffsSlice";
import { LatLngExpression } from "leaflet";
import { mapSlice } from "store/slice/mapSlice";


const MouseCoordinates = () => {
  const dispatch = useAppDispatch()
  const { setDrag } = useMapDragScroll()
  const checked = useAppSelector(state => state.switches.checked)
  const current = useAppSelector(state => state.coordInput.current)
  const latlonFormat = useAppSelector(state => state.map.latlonformat)
  const [active, setActive] = useState(checked.includes('coordInput'))
  const [coords, setCoords] = useState<LatLngExpression>({ lat: 0, lng: 0 });

  useMapEvent('mousemove', (evt) => setCoords(evt.latlng))

  const toggleInput = () => {
    const currentIndex = checked.indexOf('coordInput');
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push('coordInput');
      setActive(true)
    } else {
      newChecked.splice(currentIndex, 1);
      setActive(false)
    }
    dispatch(onoffsSlice.actions.setChecked(newChecked))
  };
  const switchFormat = () => dispatch(mapSlice.actions.switchFormat(latlonFormat));
  const handleMouseEnter = () => setDrag(false)
  const handleMouseLeave = () => setDrag(true)

  return (
    <Paper
      id='mouseCoordinates'
      className="mousePos"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <table
        style={{ fontFamily: 'monospace' }}
      >
        <tbody>
          <tr>
            <td style={{ width: '9.6rem' }}>
              <FormatCoordinate coords={coords} format={latlonFormat} />
            </td>
            <td style={{ width: '4rem' }}>
              <IconButton aria-label="toggleInput" onClick={toggleInput} size="small" style={{ float: 'right' }}>
                {active ? <LocationOff style={{ fontSize: '20px' }} /> : <LocationOn style={{ fontSize: '20px' }} />}
              </IconButton>
              <IconButton aria-label="switchFormat" onClick={switchFormat} size="small" style={{ float: 'right' }}>
                <SyncAlt style={{ fontSize: '19px' }} />
              </IconButton>
            </td>
          </tr>
        </tbody>
      </table>
      {active && <CoordinatesInput />}
      {active && <PinnedMarker />}
      {active && <MoveableMarker position={{ lat: current[0], lng: current[1] }} centerLon={121} />}
    </Paper>
  )
}

export default MouseCoordinates