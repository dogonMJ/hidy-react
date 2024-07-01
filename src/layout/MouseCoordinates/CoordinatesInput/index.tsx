import { useMap } from "react-leaflet"
import { coordInputSlice } from "../../../store/slice/coordInputSlice";
import { useTranslation } from "react-i18next";
import { TextField, IconButton, Paper, Stack, Typography, TextFieldProps, } from '@mui/material';
import { GpsFixed, AddLocationAlt, Pentagon, SyncAlt } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { useMapDragScroll } from "hooks/useMapDragScroll";
import { memo, useEffect, useState } from "react";
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
    padding: 0
  },
  dmsInput: {
    fontFamily: 'monospace',
    fontSize: '12px',
    height: '1.9rem',
  }
};

type DMSInputProps = {
  cat: 'lat' | 'lng'
  coord: number
} & TextFieldProps

const dmsPart = (dms: string, coord: number, newCoord: number) => {
  const sign = coord < 0 ? -1 : 1;
  const absCoord = Math.abs(coord);
  const degree = Math.trunc(absCoord);
  const min = (Math.trunc(Math.round((absCoord - degree) * 60))) / 60 //round for float problem
  switch (dms) {
    case 'd':
      const newSign = newCoord < 0 ? -1 : 1;
      return newSign * (absCoord - degree + Math.abs(newCoord));
    case 'm':
      return sign * (absCoord - min + Math.abs(newCoord) / 60)
    case 's':
      return sign * (degree + min + Math.abs(newCoord) / 3600)
    default:
      throw new Error("Invalid dms value. Use 'd', 'm', or 's'.");
  }
};
const d2dms = (degree: number) => {
  const sign = degree < 0 ? -1 : 1;
  const absDegree = Math.abs(degree);
  let d = Math.trunc(absDegree);
  const minfloat = Math.abs(absDegree - d) * 60;
  let m = Math.floor(minfloat);
  let s = Math.round((minfloat - m) * 60 * 10000) / 10000; //float problem
  if (s === 60) {
    s = 0;
    if (m + 1 === 60) {
      m = 0;
      d += Math.sign(degree);
    } else {
      m += 1;
    }
  }
  return [sign * d, m, s]
}
const DMSInput: React.FC<DMSInputProps> = ({ cat, coord, ...props }) => {
  const [d, m, s] = d2dms(coord)
  const { t } = useTranslation()
  return (
    <Stack direction={'row'}>
      <TextField
        id={`${cat}_d`}
        label={t('d')}
        value={Number(d)}
        type="number"
        size="small"
        style={styles.textField}
        InputProps={{ style: styles.dmsInput }}
        InputLabelProps={{
          shrink: true,
          style: styles.inputLabel
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '5px 0 0 5px',
          },
          '& .MuiOutlinedInput-input': {
            padding: '8.5px 5px '
          }
        }}
        {...props}
      />
      <TextField
        id={`${cat}_m`}
        label={t('m')}
        value={Number(m)}
        type="number"
        size="small"
        style={styles.textField}
        InputProps={{ style: styles.dmsInput }}
        InputLabelProps={{
          shrink: true,
          style: styles.inputLabel
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '0 0 0 0',
            '& fieldset': {
              borderLeftColor: 'rgba(0, 0, 0, 0)',
              borderRightColor: 'rgba(0, 0, 0, 0)',
            },
          },
          '& .MuiOutlinedInput-input': {
            padding: '8.5px 5px '
          }
        }}
        {...props}
      />
      <TextField
        id={`${cat}_s`}
        label={t('s')}
        value={Number(s)}
        type="number"
        size="small"
        style={styles.textField}
        InputProps={{ style: styles.dmsInput }}
        InputLabelProps={{
          shrink: true,
          style: styles.inputLabel
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '0 5px 5px 0',
          },
          '& .MuiOutlinedInput-input': {
            padding: '8.5px 5px '
          }
        }}
        {...props}
      />
    </Stack>
  )
}

export const CoordinatesInput = memo(() => {
  const map = useMap();
  const { setDrag } = useMapDragScroll()
  const { t } = useTranslation();
  const dispatch = useAppDispatch()
  const current = useAppSelector(state => state.coordInput.current)
  const markers = useAppSelector(state => state.coordInput.markers) as LatLngTuple[]
  const frameOn = useAppSelector(state => state.coordInput.frameOn)
  const [inputValue, setInputValue] = useState<LatLngTuple>(current)
  const [dms, setDms] = useState(false)
  const inputLat = inputValue[0]
  const inputLon = inputValue[1]
  const mouseEnter = () => setDrag(false)
  const mouseLeave = () => setDrag(true)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const target = evt.target as HTMLInputElement
    if (target.id === 'lat') {
      setInputValue([Number(target.value), inputLon])
    } else {
      setInputValue([inputLat, Number(target.value)])
    }
  }

  const dmsChange = (ev: any) => {
    const [latlng, dms] = [...ev.target.id.split('_')]
    if (latlng === 'lat') {
      const value = dmsPart(dms, inputValue[0], Number(ev.target.value))
      if (value) setInputValue([value, inputLon])
    } else {
      const value = dmsPart(dms, inputValue[1], Number(ev.target.value))
      if (value) setInputValue([inputLat, value])
    }
  }

  const onBlur = () => {
    dispatch(coordInputSlice.actions.setCurrent(inputValue))
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

  useEffect(() => {
    setInputValue(current)
  }, [current])

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
              <IconButton title={t('switchFormat')} aria-label="move to" onClick={() => setDms(!dms)} size="small" sx={{ paddingLeft: 0, paddingRight: '2px' }}>
                <SyncAlt sx={{ fontSize: '19px' }} />
              </IconButton>
              <IconButton title={t('flyto')} aria-label="move to" onClick={flyTo} size="small" sx={{ paddingLeft: 0, paddingRight: '2px' }}>
                <GpsFixed sx={{ fontSize: '19px' }} />
              </IconButton>
              <IconButton title={t('addMarker')} aria-label="add marker" onClick={addMarkerBtn} size="small" sx={{ paddingLeft: 0, paddingRight: '6px' }}>
                <AddLocationAlt style={{ fontSize: '19px' }} />
              </IconButton>
            </div>
          </Stack>
          {dms &&
            <Stack direction='row' spacing={1} sx={{ paddingBlock: '6px' }}>
              <DMSInput cat='lat' coord={inputLat} onBlur={onBlur} onChange={dmsChange} onKeyDown={(ev) => { if (ev.key.toLowerCase() === 'enter') { onBlur() } }} />
              <DMSInput cat='lng' coord={inputLon} onBlur={onBlur} onChange={dmsChange} onKeyDown={(ev) => { if (ev.key.toLowerCase() === 'enter') { onBlur() } }} />
            </Stack>
          }
          {!dms &&
            <Stack direction='row' spacing={1} sx={{ paddingBlock: '6px' }}>
              <TextField
                id="lat"
                type="number"
                size="small"
                style={styles.textField}
                label={t("latitude")}
                value={inputLat}
                onChange={handleChange}
                onBlur={onBlur}
                onKeyDown={(ev) => { if (ev.key.toLowerCase() === 'enter') { onBlur() } }}
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
                onBlur={onBlur}
                onKeyDown={(ev) => { if (ev.key.toLowerCase() === 'enter') { onBlur() } }}
                InputProps={{ style: styles.input }}
                InputLabelProps={{
                  shrink: true,
                  style: styles.inputLabel
                }}
              />
            </Stack>
          }
        </Stack>
      </Paper>
    </>
  )
}
)