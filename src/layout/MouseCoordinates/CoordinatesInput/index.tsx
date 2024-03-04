import { useMap } from "react-leaflet"
import { coordInputSlice } from "../../../store/slice/coordInputSlice";
import { useTranslation } from "react-i18next";
import { TextField, IconButton, Paper } from '@mui/material';
import { GpsFixed, AddLocationAlt } from '@mui/icons-material';
import { LatLngBounds } from "leaflet";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { useMapDragScroll } from "hooks/useMapDragScroll";
import { memo } from "react";

export const CoordinatesInput = memo(() => {
  const map = useMap();
  const { setDrag } = useMapDragScroll()
  const { t } = useTranslation();
  const dispatch = useAppDispatch()
  // const boundCenter: any = map.options.center
  const current = useAppSelector(state => state.coordInput.current)
  const inputLat = current[0]
  const inputLon = current[1]
  const markers = useAppSelector(state => state.coordInput.markers)

  const mouseEnter = () => setDrag(false)
  const mouseLeave = () => setDrag(true)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const target = evt.target as HTMLInputElement
    if (target.id === 'lat') {
      dispatch(coordInputSlice.actions.setCurrent([Number(target.value), inputLon]))
    } else {
      dispatch(coordInputSlice.actions.setCurrent([inputLat, Number(target.value)]))
    }
  }
  // const addMarkerBtn = () => {
  //   let inputLon2: number;
  //   const maxBounds = map.options.maxBounds as LatLngBounds
  //   if (inputLon <= maxBounds.getCenter().lng) { //中線
  //     inputLon2 = inputLon + 360
  //   } else {
  //     inputLon2 = inputLon - 360
  //   }
  //   dispatch(coordInputSlice.actions.setMarkers([...markers, [inputLat, inputLon], [inputLat, inputLon2]]));
  // }
  const addMarkerBtn = () => {
    dispatch(coordInputSlice.actions.setMarkers([...markers, [inputLat, inputLon]]));
  }
  const flyTo = () => {
    map.flyTo([inputLat, inputLon])
  }

  const styles = {
    textField: {
      width: 'auto',
    },
    input: {
      fontFamily: 'Monospace',
      fontSize: '10px',
      height: '1.9rem'
    },
    inputLabel: {
      fontSize: '15px',
    },
  };
  return (
    <Paper
      className="mousePos coordInput"
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}>
      <table >
        <thead>
          <tr>
            <td>{t('coordHeader')}</td>
            <td>
              {/* <IconButton aria-label="addMarker" onClick={changeCursorMode} style={{ float: 'right' }} size="small" >
                <AdsClick style={{ fontSize: '20px' }} />
              </IconButton> */}
              <IconButton aria-label="addMarker" onClick={addMarkerBtn} style={{ float: 'right' }} size="small" >
                <AddLocationAlt style={{ fontSize: '20px' }} />
              </IconButton>
              <IconButton aria-label="centerOnLocation" onClick={flyTo} style={{ float: 'right' }} size="small">
                <GpsFixed sx={{ fontSize: '19px' }} />
              </IconButton>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <TextField
                id="lat"
                type="number"
                size="small"
                style={styles.textField}
                label={t("latitude")}
                value={inputLat}
                onChange={handleChange}
                InputProps={{
                  style: styles.input
                }}
                InputLabelProps={{
                  shrink: true,
                  style: styles.inputLabel
                }}
              />
            </td>
            <td>
              <TextField
                id="lon"
                type="number"
                size="small"
                style={styles.textField}
                label={t("longitude")}
                value={inputLon}
                onChange={handleChange}
                InputProps={{
                  style: styles.input
                }}
                InputLabelProps={{
                  shrink: true,
                  style: styles.inputLabel
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </Paper>
  )
}
)