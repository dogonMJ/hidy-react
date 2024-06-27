import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { Box, Typography, MenuItem, InputLabel, Select, SelectChangeEvent, FormControl } from '@mui/material'
import { RenderIf } from "components/RenderIf/RenderIf";
import { PlotContour } from "../PlotContour";
import { PlotProfile } from "../PlotProfile";
import { varList, avgTimeList, years } from "../varList";
import { useMapDragScroll } from "hooks/useMapDragScroll";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { longtermSlice } from "store/slice/longtermSlice";
import { LongtermPar, LongtermPeriod, isMonth } from "types";


export const ProcUrl = (props: { parameter: LongtermPar, depth: number, monthly: boolean, profile: boolean, coord: string }) => {
  const { parameter, depth, monthly, profile, coord } = props
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { setDrag } = useMapDragScroll()
  const year = useAppSelector(state => state.longterm.year)
  const month = useAppSelector(state => state.longterm.month)
  const timePeriod = useAppSelector(state => state.longterm.period)
  const [url, setUrl] = useState('')
  const [text, setText] = useState({})

  const handleMouseLeave = () => setDrag(true)
  const handleTimePeriod = (event: SelectChangeEvent) => {
    dispatch(longtermSlice.actions.setPeriod(event.target.value as LongtermPeriod))
  }
  const handleMonth = (event: SelectChangeEvent) => {
    dispatch(longtermSlice.actions.setMonth(event.target.value))
  }
  const handleYear = (event: SelectChangeEvent) => {
    dispatch(longtermSlice.actions.setYear(event.target.value))
  }
  const handelDirection = (coord: string) => {
    // coord.length === 5為選擇經線，x軸為緯線，反之亦然
    return coord.length === 5 ? [`${t('StatMean.lat')} (\u00b0N)`, '\u00b0E'] : [`${t('StatMean.lon')} (\u00b0E)`, '\u00b0N']
  }
  useEffect(() => {
    const textObj: { [key: string]: string } = {}
    const dir = handelDirection(coord)
    switch (true) {
      case monthly === true && profile === false:
        setUrl(`${process.env.REACT_APP_PROXY_BASE}/data/clim/xygeo/${parameter}/${year}${month}00/${depth}/geojson`)
        break
      case monthly === false && profile === false:
        setUrl(`${process.env.REACT_APP_PROXY_BASE}/data/clim/xygeo/${parameter}/1000${avgTimeList[timePeriod].code}00/${depth}/geojson`)
        break
      case monthly === true && profile === true:
        setUrl(`${process.env.REACT_APP_PROXY_BASE}/data/clim/zsect/${parameter}/${year}${month}00/${coord}/json`)
        textObj.unit = varList[parameter].unit
        textObj.xLabel = dir[0]
        textObj.title = `${t(varList[parameter].name)} @ ${coord.slice(0, -2)}.${coord.slice(-2)}${dir[1]} <br>${year}/${month}`
        setText(textObj)
        break
      case monthly === false && profile === true:
        setUrl(`${process.env.REACT_APP_PROXY_BASE}/data/clim/zsect/${parameter}/1000${avgTimeList[timePeriod].code}00/${coord}/json`)
        textObj.unit = varList[parameter].unit
        textObj.xLabel = dir[0]
        textObj.title = `${t(varList[parameter].name)} @ ${coord.slice(0, -2)}.${coord.slice(-2)}${dir[1]}<br>1955-2017 ${t(avgTimeList[timePeriod].text)}`
        setText(textObj)
        break
    }
  }, [parameter, year, timePeriod, depth, monthly, month, profile, coord, t])

  return (
    <>
      <RenderIf isTrue={!monthly}>
        <Box sx={{ margin: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('StatMean.longterm')}{t('StatMean.mean')} (1955-2017, WOA18)
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
            <InputLabel >{t('StatMean.timePeriod')}</InputLabel>
            <Select
              name={'StatMean-url-timePeriod'}
              value={timePeriod}
              label="TimePeriods"
              onChange={handleTimePeriod}
            >
              {Object.keys(avgTimeList).map((par: string, id: number) => {
                const typedPar = par as LongtermPeriod
                return <MenuItem key={id} value={par} onMouseLeave={handleMouseLeave}>{t(avgTimeList[typedPar].text)}</MenuItem>
              })}
            </Select>
          </FormControl>
        </Box>
      </RenderIf>
      <RenderIf isTrue={monthly}>
        <Box sx={{ margin: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('StatMean.monthly')}{t('StatMean.mean')} (1993-2018, CMEMS)
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>{t('StatMean.year')}</InputLabel>
            <Select
              name={'StatMean-url-year'}
              value={year}
              label="year"
              onChange={handleYear}
            >
              {years.map((yr: string, id: number) => {
                return <MenuItem key={id} value={yr} onMouseLeave={handleMouseLeave}>{yr}</MenuItem>
              })}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>{t('StatMean.month')}</InputLabel>
            <Select
              name={'StatMean-url-month'}
              value={month}
              label="Month"
              onChange={handleMonth}
            >
              {Object.keys(avgTimeList).map((par: string, id: number) => {
                const typedPar = par as LongtermPeriod
                return isMonth(avgTimeList[typedPar].code)
                  ? <MenuItem key={id} value={avgTimeList[typedPar].code} onMouseLeave={handleMouseLeave}>{t(avgTimeList[typedPar].text)}</MenuItem>
                  : null
              })}
            </Select>
          </FormControl>
        </Box>
      </RenderIf>
      <RenderIf isTrue={!profile && url.includes('xygeo')}>
        <PlotContour url={url} />
      </RenderIf>
      <RenderIf isTrue={profile && url.includes('zsect') && parameter}>
        <PlotProfile url={url} coord={coord} text={text} />
        {/* <LineProfile url={`https://ecodata.odb.ntu.edu.tw/api/ctd?lon0=105&lon1=135&lat0=${(Number(coord) / 100).toFixed(2)}&mode=0&dep_mode=10&format=json&append=temperature`} text={{ unit: 'xxx', title: 'ds' }} /> */}
        {/* <LineProfile url={`https://ecodata.odb.ntu.edu.tw/api/sadcp?lon0=105&lon1=135&lat0=${(Number(coord) / 100).toFixed(2)}&dep_mode=exact&format=json&mean_threshold=10&append=u%2Cv%2Ccount`} text={{ unit: 'xxx', title: 'ds' }} /> */}
      </RenderIf>
    </>
  )
}

