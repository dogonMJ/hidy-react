import { useMap } from "react-leaflet"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store"
import { coordInputSlice } from "../../store/slice/mapSlice";
import { useTranslation } from "react-i18next";
import { TextField, IconButton, Paper } from '@mui/material';
import { GpsFixed, AddLocationAlt } from '@mui/icons-material';

const CoordinatesInput = () => {
  const map = useMap();
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const boundCenter: any = map.options.center
  const inputLat = useSelector((state: RootState) => state.coordInput.inputLat)
  const inputLon = useSelector((state: RootState) => state.coordInput.inputLon)
  const markers = useSelector((state: RootState) => state.coordInput.markers)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const target = evt.target as HTMLInputElement
    if (target.id === 'lat') {
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
    <Paper className="mousePos coordInput">
      <table >
        <thead>
          <tr>
            <td>{t('coordHeader')}</td>
            <td>
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

export default CoordinatesInput