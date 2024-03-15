import { memo, useState } from "react";
import { useMapEvent } from 'react-leaflet'
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { CoordinatesInput } from "layout/MouseCoordinates/CoordinatesInput"
import FormatCoordinate from "components/FormatCoordinate";
import { PinnedMarker } from "layout/MouseCoordinates/PinnedMarker";
import { MoveableMarker } from "layout/MouseCoordinates/MoveableMarker";
import { IconButton, Paper, Stack, Typography } from '@mui/material';
import { LocationOff, LocationOn, Sync, SyncAlt, SyncDisabled } from '@mui/icons-material';
import { useMapDragScroll } from "hooks/useMapDragScroll";
import { onoffsSlice } from "store/slice/onoffsSlice";
import { LatLngExpression } from "leaflet";
import { mapSlice } from "store/slice/mapSlice";
import { ConverCoordinates } from "./ConvertCoordinate";
import { useTranslation } from "react-i18next";

export const MouseCoordinates = memo(() => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { setDrag } = useMapDragScroll()
  const checked = useAppSelector(state => state.switches.checked)
  const current = useAppSelector(state => state.coordInput.current)
  const latlonFormat = useAppSelector(state => state.map.latlonformat)
  const [activeMarker, setActiveMarker] = useState(checked.includes('coordInput'))
  const [activeTransform, setActiveTransform] = useState(false)
  const [coords, setCoords] = useState<LatLngExpression>({ lat: 0, lng: 0 });

  useMapEvent('mousemove', (evt) => setCoords(evt.latlng))

  const toggleMarker = () => {
    const currentIndex = checked.indexOf('coordInput');
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push('coordInput');
      setActiveMarker(true)
    } else {
      newChecked.splice(currentIndex, 1);
      setActiveMarker(false)
    }
    dispatch(onoffsSlice.actions.setChecked(newChecked))
  }

  const toggleConvert = () => {
    setActiveTransform((prev) => !prev)
  }
  const switchFormat = () => dispatch(mapSlice.actions.switchFormat(latlonFormat));
  const handleMouseEnter = () => setDrag(false)
  const handleMouseLeave = () => setDrag(true)

  return (
    <Stack
      onMouseOver={handleMouseEnter} //快速移動滑鼠可能會導致mouseenter判定失敗
      onMouseLeave={handleMouseLeave}
    >
      <Paper
        id='mouseCoordinates'
        className="mousePos"
      >
        <Stack direction='row' >
          <Typography
            variant="caption"
            display='flex'
            alignItems='center'
            sx={{
              fontFamily: 'monospace',
              width: 152,
              paddingInline: '4px',
              paddingTop: '2px'
            }} >
            <FormatCoordinate coords={coords} format={latlonFormat} />
          </Typography>
          <IconButton title={t('switchFormat')} aria-label="switchFormat" onClick={switchFormat} size="small" sx={{ paddingInline: '2px' }}>
            <SyncAlt style={{ fontSize: '19px' }} />
          </IconButton>
          <IconButton title={t('coordHeader')} aria-label="toggleInput" onClick={toggleMarker} size="small" sx={{ paddingInline: 0 }} >
            {activeMarker ? <LocationOff style={{ fontSize: '19px' }} /> : <LocationOn style={{ fontSize: '19px' }} />}
          </IconButton>
          <IconButton title={t('transformHeader')} aria-label="transformer" onClick={toggleConvert} size="small" sx={{ paddingInline: '2px' }} >
            {activeTransform ? <SyncDisabled style={{ fontSize: '19px' }} /> : <Sync style={{ fontSize: '19px' }} />}
          </IconButton>
        </Stack>
      </Paper>
      {activeTransform && <ConverCoordinates activeMarker={activeMarker} />}
      {activeMarker && <CoordinatesInput />}
      {activeMarker && <PinnedMarker />}
      {activeMarker && <MoveableMarker position={{ lat: current[0], lng: current[1] }} centerLon={121} />}
    </Stack>
  )
})