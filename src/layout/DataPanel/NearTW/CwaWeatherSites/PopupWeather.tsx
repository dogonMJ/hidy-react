import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { ReactNode } from "react";

const processUnknown = (data: string | undefined) => {
  try {
    if (data === 'None' || data === undefined) {
      return <i>ND</i>
    } else {
      return <b>{data}</b>
    }
  }
  catch (e) {
    console.log(e)
    return ' '
  }
}

const CustomTableRow = ({ label, value, unit }: { label: ReactNode | string, value: any, unit: string }) => {
  return (
    <TableRow>
      <TableCell sx={{ p: 0.2 }}>{label}</TableCell>
      <TableCell sx={{ p: 0.5 }}>{value}</TableCell>
      <TableCell sx={{ p: 0.1 }}>{unit}</TableCell>
    </TableRow>
  )
}

const PopupTemplate = (props: { weatherData: any }) => {
  const { t } = useTranslation()
  const weatherData = props.weatherData
  const stationId = weatherData.StationId
  const wgs84Coordinate = weatherData.GeoInfo.Coordinates.find((coordinate: any) => coordinate.CoordinateName === 'WGS84')
  const weatherElements = weatherData.WeatherElement
  const link = `https://www.cwa.gov.tw/V8/${t('CWAsites.sitelang')}/W/OBS_Station.html?ID=${stationId.slice(0, -1)}`
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan={3} sx={{ textAlign: 'center', padding: 0.5, lineHeight: 1.4 }}>
            <a href={link} target="_blank" rel="noreferrer noopenner" title={weatherData.StationName}>
              {weatherData.StationName} {stationId}
            </a>
            <br />
            {weatherData.ObsTime.DateTime} <br />
            {wgs84Coordinate.StationLatitude} &deg;N, {wgs84Coordinate.StationLongitude} &deg;E<br />
            {weatherData.GeoInfo.StationAltitude} m
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <CustomTableRow label={t('CWAsites.prec_day')} value={processUnknown(weatherElements.Now.Precipitation)} unit={'mm'} />
        <CustomTableRow label={t('CWAsites.airpres')} value={processUnknown(weatherElements.AirPressure)} unit={'hPa'} />
        <CustomTableRow label={t('CWAsites.Rhumd')} value={<b>{weatherElements.RelativeHumidity}</b> ?? <i>ND</i>} unit={'%'} />
        <CustomTableRow label={t('CWAsites.winddir')} value={processUnknown(weatherElements.WindDirection)} unit={'-'} />
        <CustomTableRow label={t('CWAsites.windspd')} value={processUnknown(weatherElements.WindSpeed)} unit={'m/s'} />
        <CustomTableRow label={t('CWAsites.maxwindspd_hour')} value={processUnknown(weatherElements.GustInfo.PeakGustSpeed)} unit={'m/s'} />
        <CustomTableRow label={t('CWAsites.airtemp')} value={processUnknown(weatherElements.AirTemperature)} unit={'\u00b0C'} />
        <CustomTableRow label={t('CWAsites.airtemp_H_day')} value={processUnknown(weatherElements.DailyExtreme.DailyHigh.TemperatureInfo.AirTemperature)} unit={'\u00b0C'} />
        <CustomTableRow label={t('CWAsites.airtemp_L_day')} value={processUnknown(weatherElements.DailyExtreme.DailyLow.TemperatureInfo.AirTemperature)} unit={'\u00b0C'} />
      </TableBody>
    </Table>
  )
}

export default PopupTemplate