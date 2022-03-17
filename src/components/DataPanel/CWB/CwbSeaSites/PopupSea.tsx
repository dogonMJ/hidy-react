import { useTranslation } from "react-i18next";

interface Station {
  [key: string]: string
}

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
const PopupTemplate = (props: { weatherData: any, station: Station }) => {
  const weatherData = props.weatherData
  const station = props.station
  const weatherElements = weatherData[station.stationID].weatherElements
  const datatime = weatherData[station.stationID].dataTime

  const link = "https://www.cwb.gov.tw/V8/C/M/OBS_Marine_plot.html?MID=" + station.stationID
  const { t } = useTranslation()
  return (
    <table>
      <caption>
        <a href={link} target="_blank" rel="noreferrer noopenner" title={station.stationID}>{station.stationName} {station.stationNameEN}</a><br />
        {datatime.substring(0, 19).replace('T', ' ')} <br />
        {station.stationLatitude} N, {station.stationLongitude} E
      </caption>
      <tbody>
        <tr>
          <td>{t('CWBsites.airtemp')}: {processUnknown(weatherElements.temperature)} &deg;C</td>
          <td>{t('CWBsites.seatemp')}: {processUnknown(weatherElements.seaTemperature)} &deg;C</td>
          <td>{t('CWBsites.airpres')}: {processUnknown(weatherElements.stationPressure)} &#13169;</td>
        </tr>
        <tr>
          <td>{t('CWBsites.wavehgt')}: {processUnknown(weatherElements.waveHeight)} m</td>
          <td>{t('CWBsites.wavedir')}: {processUnknown(weatherElements.waveDirection)}</td>
          <td>{t('CWBsites.waveprd')}: {processUnknown(weatherElements.wavePeriod)} s</td>
        </tr>
        <tr>
          <td>{t('CWBsites.winddir')}: {weatherElements.hasOwnProperty('primaryAnemometer') ? processUnknown(weatherElements.primaryAnemometer.windDirection) : <i>NA</i>}</td>
          <td>{t('CWBsites.windspd')}: {weatherElements.hasOwnProperty('primaryAnemometer') ? processUnknown(weatherElements.primaryAnemometer.windScale) : <i>NA</i>}{t('CWBsites.BS')}
            {weatherElements.hasOwnProperty('primaryAnemometer') ? processUnknown(weatherElements.primaryAnemometer.windSpeed) : <i>NA</i>} m/s
          </td>
          <td>{t('CWBsites.maxwspd')}: {weatherElements.hasOwnProperty('primaryAnemometer') ? processUnknown(weatherElements.primaryAnemometer.maximumWindScale) : <i>NA</i>}{t('CWBsites.BS')}
            {weatherElements.hasOwnProperty('primaryAnemometer') ? processUnknown(weatherElements.primaryAnemometer.maximumWindSpeed) : <i>NA</i>} m/s</td>
        </tr>
        <tr>
          <td>{t('CWBsites.currdir')}: {weatherElements.hasOwnProperty('seaCurrents') ? processUnknown(weatherElements.seaCurrents.layer[0].currentDirection) : <i>NA</i>}</td>
          <td>{t('CWBsites.currspd')}: {weatherElements.hasOwnProperty('seaCurrents') ? processUnknown(weatherElements.seaCurrents.layer[0].currentSpeed) : <i>NA</i>} m/s</td>
          <td>{t('CWBsites.currspd')}: {weatherElements.hasOwnProperty('seaCurrents') ? processUnknown(weatherElements.seaCurrents.layer[0].currentSpeedInKnots) : <i>NA</i>} kt</td>
        </tr>
        <tr>
          <td>{t('CWBsites.tidehgt')}: {processUnknown(weatherElements.tideHeight)} m</td>
          <td>{t('CWBsites.tidelvl')}: {processUnknown(weatherElements.tideLevel)}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  )
}

export default PopupTemplate