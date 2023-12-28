import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store/store"
import { ExtendedScaleControl } from './ExtendedScaleControl';
import { Button } from '@mui/material';
import { unitSwitch } from 'Utils/UtilsMap';
import { useMapEvents } from 'react-leaflet';
import { mapSlice } from 'store/slice/mapSlice';

export const CustomScaleControl = () => {
  const dispatch = useDispatch()
  const ref = useRef<any>(null)
  const [width, setWidth] = useState(90)
  const scaleUnit = useSelector((state: RootState) => state.map.scaleUnit)
  const handleClick = () => {
    dispatch(mapSlice.actions.scaleUnitSwitch(scaleUnit))
    ref.current.setUnit(unitSwitch[scaleUnit])
    setWidth(ref.current.getContainer().offsetWidth)
  }
  useMapEvents({
    zoomend: () => setWidth(ref.current.getContainer().offsetWidth)
  })
  useEffect(() => {
    if (scaleUnit) {
      ref.current.setUnit(scaleUnit)
      setWidth(ref.current.getContainer().offsetWidth)
    }
  }, [])
  return (
    <>
      <Button
        onClick={handleClick}
        disableFocusRipple
        disableRipple
        sx={{ position: 'absolute', zIndex: 1000, bottom: 5, height: 19, width: width, left: 5 }}
      />
      <ExtendedScaleControl ref={ref} />
    </>
  )
}