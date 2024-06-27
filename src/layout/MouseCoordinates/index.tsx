import { memo, useMemo, useState } from "react";
import { Polygon, Polyline, Tooltip, useMapEvent } from 'react-leaflet'
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { CoordinatesInput } from "layout/MouseCoordinates/CoordinatesInput"
import FormatCoordinate from "components/FormatCoordinate";
import { PinnedMarker } from "layout/MouseCoordinates/PinnedMarker";
import { MoveableMarker } from "layout/MouseCoordinates/MoveableMarker";
import { IconButton, Paper, Stack, Typography } from '@mui/material';
import { LocationOff, LocationOn, Sync, SyncAlt, SyncDisabled } from '@mui/icons-material';
import { useMapDragScroll } from "hooks/useMapDragScroll";
import { onoffsSlice } from "store/slice/onoffsSlice";
import { LatLng, LatLngExpression, LatLngTuple } from "leaflet";
import { mapSlice } from "store/slice/mapSlice";
import { ConverCoordinates } from "./ConvertCoordinate";
import { useTranslation } from "react-i18next";
import { calGeodesic, calPolygon, readableDistance } from "Utils/UtilsDraw";

export const MouseCoordinates = memo(() => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { setDrag } = useMapDragScroll()
  const checked = useAppSelector(state => state.switches.checked)
  const current = useAppSelector(state => state.coordInput.current)
  const latlonFormat = useAppSelector(state => state.map.latlonformat)
  const markers = useAppSelector(state => state.coordInput.markers) as LatLngTuple[]
  const frameOn = useAppSelector(state => state.coordInput.frameOn)
  const scaleUnit = useAppSelector(state => state.map.scaleUnit);
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

  const getArea = useMemo(() => {
    const latlngArray = markers.map((tuple) => ({
      lat: tuple[0],
      lng: tuple[1]
    } as LatLng))
    if (latlngArray.length > 0) {
      const { area, perimeter } = calPolygon(latlngArray, scaleUnit)
      return (
        <Typography variant="caption">
          {t('area')} = {area} <br />
          {t('perimeter')} = {perimeter}
        </Typography>
      )
    } else {
      return null
    }
  }, [markers, scaleUnit, t])

  const getPolyline = useMemo(() => {
    if (markers.length === 2) {
      const distance = calGeodesic(markers[0], markers[1])
      return (
        <Typography variant="caption">
          {t('pathDistance')} = {readableDistance(distance, scaleUnit)}
        </Typography>
      )
    }
  }, [markers, scaleUnit, t])
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
      {activeMarker && <PinnedMarker openPopup={frameOn} />}
      {activeMarker && <MoveableMarker position={{ lat: current[0], lng: current[1] }} centerLon={121} />}
      {frameOn && activeMarker && markers.length > 2 &&
        <Polygon positions={markers} pathOptions={{ color: '#ffe6a8', opacity: 0.9 }}>
          <Tooltip>
            {getArea}
          </Tooltip>
        </Polygon>
      }
      {frameOn && activeMarker && markers.length === 2 &&
        <Polyline positions={markers} pathOptions={{ color: '#ffe6a8', opacity: 0.9 }}>
          <Tooltip>
            {getPolyline}
          </Tooltip>
        </Polyline>
      }
    </Stack>
  )
})