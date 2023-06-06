import { useState } from "react";
import { useMapEvent } from 'react-leaflet'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store"
import { coordInputSlice } from "store/slice/mapSlice";
import { coor } from 'types';
import CoordinatesInput from "layout/MouseCoordinates/CoordinatesInput"
import FormatCoordinate from "components/FormatCoordinate";
import PinnedMarker from "layout/MouseCoordinates/PinnedMarker";
import MoveableMarker from "layout/MouseCoordinates/MoveableMarker";
import { IconButton, Paper } from '@mui/material';
import { LocationOff, LocationOn, SyncAlt } from '@mui/icons-material';

const MouseCoordinates = () => {
  const dispatch = useDispatch()
  const inputActiveState = useSelector((state: RootState) => state.coordInput.active)
  const inputLat = useSelector((state: RootState) => state.coordInput.inputLat)
  const inputLon = useSelector((state: RootState) => state.coordInput.inputLon)
  const latlonFormat = useSelector((state: RootState) => state.coordInput.latlonformat)
  const [coords, setCoords] = useState<coor>({ lat: 0, lng: 0 });

  useMapEvent('mousemove', (evt) => {
    setCoords(evt.latlng)
  })
  const toggleInput = () => {
    dispatch(coordInputSlice.actions.switchActive(
      !inputActiveState
    ));
  }
  const switchFormat = () => {
    dispatch(coordInputSlice.actions.switchFormat(
      latlonFormat
    ));
  }
  const handleMouseEnter = () => {
    dispatch(coordInputSlice.actions.enterPanel(true))
  }
  const handleMouseLeave = () => {
    dispatch(coordInputSlice.actions.enterPanel(false))
  }
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
                {inputActiveState ? <LocationOff style={{ fontSize: '20px' }} /> : <LocationOn style={{ fontSize: '20px' }} />}
              </IconButton>
              <IconButton aria-label="switchFormat" onClick={switchFormat} size="small" style={{ float: 'right' }}>
                <SyncAlt style={{ fontSize: '19px' }} />
              </IconButton>
            </td>
          </tr>
        </tbody>
      </table>
      {inputActiveState && <CoordinatesInput />}
      {inputActiveState && <PinnedMarker />}
      {inputActiveState && <MoveableMarker position={{ lat: inputLat, lng: inputLon }} centerLon={121} />}
    </Paper>
  )
}

export default MouseCoordinates