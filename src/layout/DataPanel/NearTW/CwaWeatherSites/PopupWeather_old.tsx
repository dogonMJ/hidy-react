import { useTranslation } from "react-i18next";

interface Station {
  [key: string]: string
}
interface Element {
  elementName: string
  elementValue: string
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
const PopupTemplate = (props: { weatherData: any, stationId: string }) => {
  const { t } = useTranslation()
  const weatherData = props.weatherData
  const stationId = props.stationId
  const weatherElements: Station = {}
  weatherData.weatherElement.forEach((element: Element) => {
    weatherElements[element.elementName] = element.elementValue
  })
  const link = "https://www.cwa.gov.tw/V8/" + t('CWAsites.sitelang') + "/W/OBS_Station.html?ID=" + stationId.slice(0, -1)
  return (
    <table>
      <caption>
        <a href={link} target="_blank" rel="noreferrer noopenner" title={weatherData.locationName}>{weatherData.locationName} {stationId}</a><br />
        {/* {weatherData.parameter[0].parameterValue}{weatherData.parameter[2].parameterValue}<br /> */}
        {weatherData.time.obsTime} <br />
        TWD67(EPSG:3821): {weatherData.lat} N, {weatherData.lon} E<br />
        {weatherElements.ELEV} m
      </caption>
      <tbody>
        <tr>
          <td>{t('CWAsites.prec_day')}: {processUnknown(weatherElements.H_24R)} mm</td>
          <td>{t('CWAsites.airpres')}: {processUnknown(weatherElements.PRES)} &#13169;</td>
          <td>{t('CWAsites.Rhumd')}: {(weatherElements.HUMD === undefined) ? <i>ND</i> : <b>{Math.round(Number(weatherElements.HUMD) * 100)}</b>} %</td>
        </tr>
        <tr>
          <td>{t('CWAsites.winddir')}: {processUnknown(weatherElements.WDIR)}</td>
          <td>{t('CWAsites.windspd')}: {processUnknown(weatherElements.WDSD)} m/s</td>
          <td>{t('CWAsites.maxwindspd_hour')}: {processUnknown(weatherElements.H_FX)} m/s</td>
        </tr>
        <tr>
          <td>{t('CWAsites.airtemp')}: {processUnknown(weatherElements.TEMP)} &deg;C</td>
          <td>{t('CWAsites.airtemp_H_day')}: {processUnknown(weatherElements.D_TX)} &deg;C</td>
          <td>{t('CWAsites.airtemp_L_day')}: {processUnknown(weatherElements.D_TN)} &deg;C</td>
        </tr>
      </tbody>
    </table>
  )
}

export default PopupTemplate