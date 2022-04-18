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
  const weatherElements = weatherData[station.StationID].WeatherElements
  const datatime = weatherData[station.StationID].DateTime

  const link = "https://www.cwb.gov.tw/V8/C/M/OBS_Marine_plot.html?MID=" + station.StationID
  const { t } = useTranslation()
  return (
    <table>
      <caption>
        <a href={link} target="_blank" rel="noreferrer noopenner" title={station.StationID}>{station.StationName} {station.StationNameEN}</a><br />
        {datatime.substring(0, 19).replace('T', ' ')} <br />
        {station.StationLatitude} N, {station.StationLongitude} E
      </caption>
      <tbody>
        <tr>
          <td>{t('CWBsites.airtemp')}: {processUnknown(weatherElements.Temperature)} &deg;C</td>
          <td>{t('CWBsites.seatemp')}: {processUnknown(weatherElements.SeaTemperature)} &deg;C</td>
          <td>{t('CWBsites.airpres')}: {processUnknown(weatherElements.StationPressure)} &#13169;</td>
        </tr>
        <tr>
          <td>{t('CWBsites.wavehgt')}: {processUnknown(weatherElements.WaveHeight)} m</td>
          <td>{t('CWBsites.wavedir')}: {processUnknown(weatherElements.WaveDirection)}</td>
          <td>{t('CWBsites.waveprd')}: {processUnknown(weatherElements.WavePeriod)} s</td>
        </tr>
        <tr>
          <td>{t('CWBsites.winddir')}: {weatherElements.hasOwnProperty('PrimaryAnemometer') ? processUnknown(weatherElements.PrimaryAnemometer.WindDirection) : <i>NA</i>}</td>
          <td>{t('CWBsites.windspd')}: {weatherElements.hasOwnProperty('PrimaryAnemometer') ? processUnknown(weatherElements.PrimaryAnemometer.WindScale) : <i>NA</i>}{t('CWBsites.BS')}
            {weatherElements.hasOwnProperty('PrimaryAnemometer') ? processUnknown(weatherElements.PrimaryAnemometer.WindSpeed) : <i>NA</i>} m/s
          </td>
          <td>{t('CWBsites.maxwspd')}: {weatherElements.hasOwnProperty('PrimaryAnemometer') ? processUnknown(weatherElements.PrimaryAnemometer.MaximumWindScale) : <i>NA</i>}{t('CWBsites.BS')}
            {weatherElements.hasOwnProperty('PrimaryAnemometer') ? processUnknown(weatherElements.PrimaryAnemometer.MaximumWindSpeed) : <i>NA</i>} m/s</td>
        </tr>
        <tr>
          <td>{t('CWBsites.currdir')}: {weatherElements.hasOwnProperty('SeaCurrents') ? processUnknown(weatherElements.SeaCurrents.Layer[0].CurrentDirection) : <i>NA</i>}</td>
          <td>{t('CWBsites.currspd')}: {weatherElements.hasOwnProperty('SeaCurrents') ? processUnknown(weatherElements.SeaCurrents.Layer[0].CurrentSpeed) : <i>NA</i>} m/s</td>
          <td>{t('CWBsites.currspd')}: {weatherElements.hasOwnProperty('SeaCurrents') ? processUnknown(weatherElements.SeaCurrents.Layer[0].CurrentSpeedInKnots) : <i>NA</i>} kt</td>
        </tr>
        <tr>
          <td>{t('CWBsites.tidehgt')}: {processUnknown(weatherElements.TideHeight)} m</td>
          <td>{t('CWBsites.tidelvl')}: {processUnknown(weatherElements.TideLevel)}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  )
}

export default PopupTemplate