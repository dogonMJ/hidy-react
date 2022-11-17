import { useEffect, useState } from "react"
import { useMap } from "react-leaflet"
import { useTranslation } from "react-i18next";
import { Box, Typography, MenuItem, InputLabel, Select, SelectChangeEvent, FormControl } from '@mui/material'
import { RenderIf } from "components/RenderIf/RenderIf";
import { PlotContour } from "../PlotContour";
import { PlotProfile } from "../PlotProfile";
import { varList, avgTimeList } from "../varList";

const years = Array.from({ length: 26 }, (v, i) => (i + 1993).toString())

export const ProcUrl = (props: { parameter: string, depth: number, monthly: boolean, profile: boolean, coord: string }) => {
  const { parameter, depth, monthly, profile, coord } = props
  const { t } = useTranslation()
  const map = useMap()
  const [timePeriod, setTimePeriod] = useState<string>('mean')
  const [year, setYear] = useState(years[0])
  const [month, setMonth] = useState('01')
  const [url, setUrl] = useState('')
  const [text, setText] = useState({})

  const handleMouseLeave = () => {
    map.scrollWheelZoom.enable()
    map.dragging.enable()
  }
  const handleTimePeriod = (event: SelectChangeEvent) => {
    setTimePeriod(event.target.value)
  }
  const handleMonth = (event: SelectChangeEvent) => {
    setMonth(event.target.value)
  }
  const handleYear = (event: SelectChangeEvent) => {
    setYear(event.target.value)
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
        setUrl(`https://odbpo.oc.ntu.edu.tw/clim/xygeo/${parameter}/${year}${month}00/${depth}/geojson`)
        break
      case monthly === false && profile === false:
        setUrl(`https://odbpo.oc.ntu.edu.tw/clim/xygeo/${parameter}/1000${avgTimeList[timePeriod].code}00/${depth}/geojson`)
        break
      case monthly === true && profile === true:
        setUrl(`https://odbpo.oc.ntu.edu.tw/clim/zsect/${parameter}/${year}${month}00/${coord}/json`)
        textObj.unit = varList[parameter].unit
        textObj.xLabel = dir[0]
        textObj.title = `${t(varList[parameter].name)} @ ${coord.slice(0, -2)}.${coord.slice(-2)}${dir[1]} <br>${year}/${month}`
        setText(textObj)
        break
      case monthly === false && profile === true:
        setUrl(`https://odbpo.oc.ntu.edu.tw/clim/zsect/${parameter}/1000${avgTimeList[timePeriod].code}00/${coord}/json`)
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
              value={timePeriod}
              label="TimePeriods"
              onChange={handleTimePeriod}
            >
              {Object.keys(avgTimeList).map((par: string, id: number) => {
                return <MenuItem key={id} value={par} onMouseLeave={handleMouseLeave}>{t(avgTimeList[par].text)}</MenuItem>
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
              value={month}
              label="Month"
              onChange={handleMonth}
            >
              {Object.keys(avgTimeList).map((par: string, id: number) => {
                if (Number(avgTimeList[par].code) < 13 && Number(avgTimeList[par].code) !== 0) {
                  return <MenuItem key={id} value={avgTimeList[par].code} onMouseLeave={handleMouseLeave}>{t(avgTimeList[par].text)}</MenuItem>
                } else {
                  return null
                }
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
      </RenderIf>
    </>
  )
}

