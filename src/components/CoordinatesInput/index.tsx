import { useState } from "react";
import { useMap } from "react-leaflet"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store"
import { coordInputSlice } from "../../store/slice/mapSlice";
import { useTranslation } from "react-i18next";

const CoordinatesInput = (props: { active: boolean }) => {
  const map = useMap();
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const boundCenter: any = map.options.center
  const inputLat = useSelector((state: RootState) => state.coordInput.inputLat)
  const inputLon = useSelector((state: RootState) => state.coordInput.inputLon)
  const markers = useSelector((state: RootState) => state.coordInput.markers)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const target = evt.target as HTMLInputElement
    if (target.placeholder === 'Latitude') {
      dispatch(coordInputSlice.actions.changeLat(Number(target.value)));
    } else {
      dispatch(coordInputSlice.actions.changeLon(Number(target.value)));
    }
  }
  const addMarkerBtn = () => {
    let inputLon2: number;
    if (inputLon <= boundCenter[1]) { //中線
      inputLon2 = inputLon + 360
    } else {
      inputLon2 = inputLon - 360
    }
    dispatch(coordInputSlice.actions.changeMarkers([...markers, [inputLat, inputLon], [inputLat, inputLon2]]));
  }
  const flyTo = () => {
    map.flyTo([inputLat, inputLon])
  }
  if (props.active) {
    return (
      <>
        <table className="coordInput">
          <thead>
            <tr>
              <td colSpan={2}>{t('coordHeader')}</td>
              <td>
                <button onClick={addMarkerBtn}>{t('addMarker')}</button>
                <button onClick={flyTo}>{t('centerOnLocation')}</button>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="number" placeholder="Latitude" value={inputLat} onChange={handleChange} /></td>
              <td>,</td>
              <td><input type="number" placeholder="Longitude" value={inputLon} onChange={handleChange} /></td>
            </tr>
          </tbody>
        </table>
      </>
    )
  } else {
    return (
      <></>
    )
  }
}

export default CoordinatesInput