import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMapEvent } from 'react-leaflet'
import formatCoordinate from "components/FormatCoordinate";
import { RootState } from "../../store/store"
import { coordInputSlice } from "../../store/slice/mapSlice";
import { coor } from 'types';

const MouseCoordinates = () => {
  const dispatch = useDispatch()
  const inputActiveState = useSelector((state: RootState) => state.coordInput.active)
  const [coords, setCoords] = useState<coor>({ lat: 0, lng: 0 });
  useMapEvent('mousemove', (evt) => {
    setCoords(evt.latlng)
  })
  const toggleInput = () => {
    dispatch(coordInputSlice.actions.switchActive(
      !inputActiveState
    ));
  }
  return (
    <div className="mousePos" onClick={toggleInput}>
      {formatCoordinate(coords, 'latlon-dms')}
      <button>
        change
      </button>
    </div>
  )
}

export default MouseCoordinates