import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMapEvent } from 'react-leaflet'
import FormatCoordinate from "components/FormatCoordinate";
import { RootState } from "../../store/store"
import { coordInputSlice } from "../../store/slice/mapSlice";
import { coor } from 'types';
import { useTranslation } from "react-i18next";

const MouseCoordinates = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const inputActiveState = useSelector((state: RootState) => state.coordInput.active)
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
  return (
    <div className="mousePos" >
      <FormatCoordinate coords={coords} format={latlonFormat} />
      <button onClick={switchFormat}>
        {t('coordFormat')}
      </button>
      <button onClick={toggleInput}>
        {t('coordInput')}
      </button>
    </div>
  )
}

export default MouseCoordinates