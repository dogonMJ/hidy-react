
import { useState, useEffect, useCallback } from 'react';
import { useMap } from 'react-leaflet';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store"
import { coordInputSlice } from "store/slice/mapSlice";
import { Box, Paper } from '@mui/material';
import { DepthMeterSlider } from 'components/DepthMeterSlider'
import { SliderMarks } from 'types'

const isValueExist = (value: any) => value ? true : false
const getTickValues = (ticks: number[], valueArray: number[]) => {
  const values: any[] = []
  ticks.forEach((tick) => values.push(valueArray.find((value) => value <= tick)))
  return values
}
const getMarks = (unit: string, valueArray: number[], ticks = [0, -20, -100, -500, -1000, -2000, -3000, -4000]) => {
  const result: SliderMarks[] = []
  const tickValues = getTickValues(ticks, [...valueArray].reverse())
  valueArray.forEach((value, i) => {
    result.push({ value: i, label: '' })
  })
  tickValues.filter(isValueExist).forEach((value) => {
    const index = valueArray.indexOf(value)
    result[index] = { value: index, label: `${Math.round(value)} ${unit}` }
  })
  result[0] = { value: 0, label: `${Math.round(valueArray[0])} ${unit}` }
  return result
}

export const DepthMeter = (props: { opacity: number }) => {
  const map = useMap()
  const dispatch = useDispatch()
  const elevations = useSelector((state: RootState) => state.coordInput.elevations);
  const [marks, setMarks] = useState<SliderMarks[]>([])
  const [isEnter, setIsEnter] = useState(false)
  const mouseEnter = (e: any) => {
    map.dragging.disable()
    setIsEnter(true)
  }
  const mouseLeave = (e: any) => {
    map.dragging.enable()
    setIsEnter(false)
  }
  const handleChange = (event: any, value: any) => {
    dispatch(coordInputSlice.actions.depthMeterValue(value))
  }
  useEffect(() => {
    const getElevations = async () => {
      try {
        const response = await fetch('https://nrt.cmems-du.eu/thredds/wms/global-analysis-forecast-phy-001-024-3dinst-thetao?request=GetCapabilities&service=WMS')
        const text = await response.text()
        const xmlDoc = new window.DOMParser().parseFromString(text, "text/xml")
        const elevationList = xmlDoc.getElementsByName('elevation')[0].textContent?.trim().split(',').map(Number).reverse()

        if (elevationList) {
          setMarks(getMarks('m', elevationList))
          // setElevations(elevationList)
          dispatch(coordInputSlice.actions.elevations(elevationList))
        }
      } catch (e) {
        console.log(e)
      }
    }
    getElevations()
  }, [])

  return (
    <Box
      sx={{
        // position: 'fixed',
        display: 'flex',
        height: '65%',
        justifyContent: 'right',
        margin: '5px',
        padding: '15px 5px',
        // flexWrap: 'wrap',
        // zIndex: 1700,
        // width: '95px',
        // right: '6px',
        // bottom: '8rem',
        // backgroundColor: isEnter ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
        // borderRadius: '4px',
      }}
    >
      <Paper
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        sx={{
          position: 'relative',
          zIndex: 1700,
          width: '95px',
          display: 'flex',
          margin: '2px',
          padding: '15px 5px',
          top: '250px',
          height: 'calc(70vh - 200px)',
          backgroundColor: isEnter ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
          opacity: props.opacity,
        }}>
        <DepthMeterSlider values={elevations} marks={marks} handleChange={handleChange} />
      </Paper>
    </Box >
  )
}