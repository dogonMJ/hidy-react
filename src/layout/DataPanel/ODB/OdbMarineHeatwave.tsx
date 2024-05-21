import { TileLayer, useMapEvents } from "react-leaflet";
import { useAppSelector } from "hooks/reduxHooks";
import { LegendControl } from "components/LeafletLegend"
import { Legend } from 'types';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react'
import { AlertSlide } from "components/AlertSlide/AlertSlide";
import { RenderIf } from "components/RenderIf/RenderIf";
import  OdbMHWTimeSerise  from "./OdbMHWTimeSerise";

export const OdbMarineHeatwave = () => {
  const { t } = useTranslation()
  const [notInRange, setNotInRange] = useState<boolean>(false)
  const [timespan, setTimespan] = useState([new Date('1985-01-01'), new Date()])
  const datetime = useAppSelector(state => state.map.datetime);
  const month = datetime.slice(0, 7) + '-01'
  const url = `https://service.oc.ntu.edu.tw/data/odbgeowmts/rest/marineheatwave:mhw/polygon_level/WebMercatorQuad/{z}/{y}/{x}?format=image/png&Time=${month}`
  const legned: Legend = {
    'ice': {
      "color": "#c6e0fe",
      "description": t('OdbData.mhw.ice')
    },
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
    fetch('https://service.oc.ntu.edu.tw/data/odbgeowmts/?service=WMTS&version=1.1.1&request=GetCapabilities')
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
  
    //added by Yeh
    const [coords, setCoords] = useState({ lat: 121, lng: 20 });
    const [open, setOpen] = useState(false)
    useMapEvents({
      click(e) {
        const {lat, lng} = e.latlng;
        setCoords({ lat: lat, lng: lng })
        setOpen(true)    
      },
    });
  return (
    <>
      <AlertSlide open={notInRange} setOpen={setNotInRange} severity='error' timeout={3000} > {t('alert.notInTime')} </AlertSlide>
      <TileLayer
        id='mhw'
        url={url}
        crossOrigin="anonymous"
      />
       <RenderIf isTrue={open}>
        <OdbMHWTimeSerise
          key={`${coords.lat}-${coords.lng}`}
          coords={coords}
          setOpen={setOpen}
        />     
      </RenderIf>
      <LegendControl position='bottomleft' legendContent={legnedContents.join('<br>')} legendClassNames={'sedLegend'} />
    </>
  )
}