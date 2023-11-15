import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { ReactNode } from "react";


interface Station {
  [key: string]: string
}

const processUnknown = (data: string | undefined) => {
  try {
    if (data === 'None' || data === undefined || data === '-') {
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
const PopupTemplate = (props: { weatherData: any, station: Station }) => {
  const weatherData = props.weatherData
  const station = props.station
  const weatherElements = weatherData[station.StationID].WeatherElements
  const datatime = weatherData[station.StationID].DateTime

  const link = "https://www.cwa.gov.tw/V8/C/M/OBS_Marine_plot.html?MID=" + station.StationID
  const { t } = useTranslation()
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan={3} sx={{ textAlign: 'center', padding: 0.5, lineHeight: 1.4 }}>
            <a href={link} target="_blank" rel="noreferrer noopenner" title={station.StationID}>
              {station.StationID} {station.StationName} {station.StationNameEN}
            </a>
            <br />
            {datatime.substring(0, 19).replace('T', ' ')} <br />
            {station.StationLatitude} &deg;N, {station.StationLongitude} &deg;E<br />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <CustomTableRow label={t('CWAsites.airtemp')} value={processUnknown(weatherElements.Temperature)} unit={'\u00b0C'} />
        <CustomTableRow label={t('CWAsites.seatemp')} value={processUnknown(weatherElements.SeaTemperature)} unit={'\u00b0C'} />
        <CustomTableRow label={t('CWAsites.airpres')} value={processUnknown(weatherElements.StationPressure)} unit={'hPa'} />
        <CustomTableRow label={t('CWAsites.wavehgt')} value={processUnknown(weatherElements.WaveHeight)} unit={'m'} />
        <CustomTableRow label={t('CWAsites.wavedir')} value={processUnknown(weatherElements.WaveDirection)} unit={'-'} />
        <CustomTableRow label={t('CWAsites.waveprd')} value={processUnknown(weatherElements.WavePeriod)} unit={'s'} />

        <CustomTableRow label={t('CWAsites.winddir')} value={weatherElements.hasOwnProperty('PrimaryAnemometer') ? processUnknown(weatherElements.PrimaryAnemometer.WindDirection) : <i>NA</i>} unit={'-'} />
        <CustomTableRow label={t('CWAsites.windlvl')} value={weatherElements.hasOwnProperty('PrimaryAnemometer') ? processUnknown(weatherElements.PrimaryAnemometer.WindScale) : <i>NA</i>} unit={t('CWAsites.BS')} />
        <CustomTableRow label={t('CWAsites.windspd')} value={weatherElements.hasOwnProperty('PrimaryAnemometer') ? processUnknown(weatherElements.PrimaryAnemometer.WindSpeed) : <i>NA</i>} unit={'m/s'} />
        <CustomTableRow label={t('CWAsites.maxwlvl')} value={weatherElements.hasOwnProperty('PrimaryAnemometer') ? processUnknown(weatherElements.PrimaryAnemometer.MaximumWindScale) : <i>NA</i>} unit={t('CWAsites.BS')} />
        <CustomTableRow label={t('CWAsites.maxwspd')} value={weatherElements.hasOwnProperty('PrimaryAnemometer') ? processUnknown(weatherElements.PrimaryAnemometer.MaximumWindSpeed) : <i>NA</i>} unit={'m/s'} />

        <CustomTableRow label={t('CWAsites.currdir')} value={weatherElements.hasOwnProperty('SeaCurrents') ? processUnknown(weatherElements.SeaCurrents.Layer[0].CurrentDirection) : <i>NA</i>} unit={'-'} />
        <CustomTableRow label={t('CWAsites.currspd')} value={weatherElements.hasOwnProperty('SeaCurrents') ? processUnknown(weatherElements.SeaCurrents.Layer[0].CurrentSpeed) : <i>NA</i>} unit={'m/s'} />
        <CustomTableRow label={t('CWAsites.currspd')} value={weatherElements.hasOwnProperty('SeaCurrents') ? processUnknown(weatherElements.SeaCurrents.Layer[0].CurrentSpeedInKnots) : <i>NA</i>} unit={'kt'} />

        <CustomTableRow label={t('CWAsites.tidehgt')} value={processUnknown(weatherElements.TideHeight)} unit={'m'} />
        <CustomTableRow label={t('CWAsites.tidelvl')} value={processUnknown(weatherElements.TideLevel)} unit={'-'} />

      </TableBody>
    </Table>
  )
}

export default PopupTemplate