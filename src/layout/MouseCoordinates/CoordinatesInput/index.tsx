import { useMap } from "react-leaflet"
import { coordInputSlice } from "../../../store/slice/coordInputSlice";
import { useTranslation } from "react-i18next";
import { TextField, IconButton, Paper, Stack, Typography } from '@mui/material';
import { GpsFixed, AddLocationAlt, Pentagon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { useMapDragScroll } from "hooks/useMapDragScroll";
import { memo } from "react";
import { LatLngTuple } from "leaflet";
import { RenderIf } from "components/RenderIf/RenderIf";
const styles = {
  textField: {
    width: 'auto',
  },
  input: {
    fontFamily: 'monospace',
    fontSize: '12px',
    height: '1.9rem'
  },
  inputLabel: {
    fontSize: '14px',
  },
};

export const CoordinatesInput = memo(() => {
  const map = useMap();
  const { setDrag } = useMapDragScroll()
  const { t } = useTranslation();
  const dispatch = useAppDispatch()
  const current = useAppSelector(state => state.coordInput.current)
  const markers = useAppSelector(state => state.coordInput.markers) as LatLngTuple[]
  const frameOn = useAppSelector(state => state.coordInput.frameOn)
  const inputLat = current[0]
  const inputLon = current[1]

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
  const addMarkerBtn = () => {
    dispatch(coordInputSlice.actions.setMarkers([...markers, [inputLat, inputLon]]));
  }
  const flyTo = () => {
    map.flyTo([inputLat, inputLon])
  }
  const handlePolygon = () => {
    dispatch(coordInputSlice.actions.setFrameOn(!frameOn));
  }
  return (
    <>
      <Paper
        className="mousePos"
        id='coordinatesInput'
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        sx={{ bottom: '50px' }}
      >
        <Stack>
          <Stack direction='row' display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant="caption" sx={{ paddingLeft: '4px' }}>
              {t('coordHeader')}
            </Typography>
            <div>
              <RenderIf isTrue={markers && markers.length > 1}>
                <IconButton title={t('createPolygon')} aria-label="move to" onClick={handlePolygon} size="small" sx={{ paddingRight: '2px' }}>
                  <Pentagon sx={{ fontSize: '17px', transform: "rotate(45deg)" }} />
                </IconButton>
              </RenderIf>
              <IconButton title={t('flyto')} aria-label="move to" onClick={flyTo} size="small" sx={{ paddingLeft: 0, paddingRight: '2px' }}>
                <GpsFixed sx={{ fontSize: '19px' }} />
              </IconButton>
              <IconButton title={t('addMarker')} aria-label="add marker" onClick={addMarkerBtn} size="small" sx={{ paddingLeft: 0, paddingRight: '6px' }}>
                <AddLocationAlt style={{ fontSize: '19px' }} />
              </IconButton>
            </div>
          </Stack>
          <Stack direction='row' spacing={1} sx={{ paddingBlock: '6px' }}>
            <TextField
              id="lat"
              type="number"
              size="small"
              style={styles.textField}
              label={t("latitude")}
              value={inputLat}
              onChange={handleChange}
              InputProps={{ style: styles.input }}
              InputLabelProps={{
                shrink: true,
                style: styles.inputLabel
              }}
            />
            <TextField
              id="lon"
              type="number"
              size="small"
              style={styles.textField}
              label={t("longitude")}
              value={inputLon}
              onChange={handleChange}
              InputProps={{ style: styles.input }}
              InputLabelProps={{
                shrink: true,
                style: styles.inputLabel
              }}
            />
          </Stack>
        </Stack>
      </Paper>
    </>
  )
}
)