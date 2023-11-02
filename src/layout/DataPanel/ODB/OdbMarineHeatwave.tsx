import { TileLayer } from "react-leaflet"
import { useSelector } from "react-redux"
import { RootState } from "store/store"
import { LegendControl } from "components/LeafletLegend"
import { Legend } from 'types';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react'
import { AlertSlide } from "components/AlertSlide/AlertSlide";

export const OdbMarineHeatwave = () => {
  const { t } = useTranslation()
  const [notInRange, setNotInRange] = useState<boolean>(false)
  const [timespan, setTimespan] = useState([new Date('1985-01-01'), new Date()])
  const datetime = useSelector((state: RootState) => state.coordInput.datetime);
  const month = datetime.slice(0, 7)
  const url = `https://ecodata.odb.ntu.edu.tw/geoserver/gwc/service/wmts?service=WMTS&version=1.0.0&request=GetTile&layer=marineheatwave:mhw&style=polygon_level&tilerow={y}&tilecol={x}&tilematrix=EPSG:900913:{z}&tilematrixset=EPSG:900913&format=image/png&Time=${month}`
  const legned: Legend = {
    'moderate': {
      "color": "#f5c268",
      "description": t('OdbData.mhw.moderate')
    },
    'strong': {
      "color": "#ec6b1a",
      "description": t('OdbData.mhw.strong')
    },
    'severe': {
      "color": "#cb3827",
      "description": t('OdbData.mhw.severe')
    },
    'extreme': {
      "color": "#7f1416",
      "description": t('OdbData.mhw.extreme')
    },
  }
  const legnedContents: string[] = []
  Object.keys(legned).forEach((key) => {
    legnedContents.push(`<b style="background:${legned[key].color}; color:${legned[key].color}">●</b>&nbsp;${legned[key].description}`)
  })

  useEffect(() => {
    fetch('https://ecodata.odb.ntu.edu.tw/geoserver/gwc/service/wmts?request=GetCapabilities')
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
      .then(xml => {
        const dimension = xml.getElementsByTagName('Dimension') as any
        dimension[0].childNodes.forEach((child: any) => {
          if (child.nodeName === 'Value') {
            const startTime = new Date(child.innerHTML.split('--')[0])
            const endTime = new Date(child.innerHTML.split('--')[1])
            setTimespan([startTime, endTime])
          }
        })
      });
  }, [])

  useEffect(() => {
    const startTime = timespan[0]
    const endTime = timespan[1]
    const selectDate = new Date(datetime)
    const monthsBetween = (endTime.getFullYear() - startTime.getFullYear()) * 12 + endTime.getMonth() - startTime.getMonth()
    const monthsFromStart = (selectDate.getFullYear() - startTime.getFullYear()) * 12 + (selectDate.getMonth() - startTime.getMonth());
    setNotInRange(monthsFromStart > monthsBetween || monthsFromStart < 0 ? true : false)
  }, [url, datetime, timespan])

  return (
    <>
      <AlertSlide open={notInRange} setOpen={setNotInRange} severity='error' timeout={3000} > {t('alert.notInTime')} </AlertSlide>
      <TileLayer url={url} />
      <LegendControl position='bottomleft' legendContent={legnedContents.join('<br>')} legendClassNames={'sedLegend'} />
    </>
  )
}