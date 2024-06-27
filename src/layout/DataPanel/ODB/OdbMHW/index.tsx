import { TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useAppSelector } from "hooks/reduxHooks";
import { LegendControl } from "components/LeafletLegend"
import { Legend } from 'types';
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from 'react'
import { AlertSlide } from "components/AlertSlide/AlertSlide";
import { RenderIf } from "components/RenderIf/RenderIf";
import OdbMHWTimeSeries from "./OdbMHWTimeSeries";
import { LatLng } from "leaflet";
import { useAlert } from "hooks/useAlert";

export const OdbMarineHeatwave = () => {
  const { t } = useTranslation()
  const map = useMap()
  const ref = useRef<any>()
  const { openAlert, setOpenAlert, alertMessage, setMessage, } = useAlert()
  const [notInRange, setNotInRange] = useState<boolean>(false)
  const [timespan, setTimespan] = useState([new Date('1985-01-01'), new Date()])
  const mapCenter = map.latLngToLayerPoint(map.getBounds().getCenter())
  const [position, setPosition] = useState({ x: mapCenter.x - 400, y: mapCenter.y - 150 })
  const [coords, setCoords] = useState<LatLng>({ lat: 121, lng: 20 } as LatLng);
  const [open, setOpen] = useState(false)

  const datetime = useAppSelector(state => state.map.datetime);
  const month = datetime.slice(0, 7) + '-02'
  const url = `https://service.oc.ntu.edu.tw/data/odbgeowmts/rest/marineheatwave:mhw/polygon_level/WebMercatorQuad/{z}/{y}/{x}?format=image/png&Time=${month}`

  const legned: Legend = {
    'ice': {
      "color": "#c6e0fe",
      "description": t('OdbData.mhw.ice')
    },
    'moderate': {
      "color": "#f5c268",
      "description": t('OdbData.mhw.level_1')
    },
    'strong': {
      "color": "#ec6b1a",
      "description": t('OdbData.mhw.level_2')
    },
    'severe': {
      "color": "#cb3827",
      "description": t('OdbData.mhw.level_3')
    },
    'extreme': {
      "color": "#7f1416",
      "description": t('OdbData.mhw.level_4')
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
      })
      .catch((e) => setMessage(t('alert.fetchFail')))
  }, [])

  useEffect(() => {
    const startTime = timespan[0]
    const endTime = timespan[1]
    const selectDate = new Date(datetime)
    const monthsBetween = (endTime.getFullYear() - startTime.getFullYear()) * 12 + endTime.getMonth() - startTime.getMonth()
    const monthsFromStart = (selectDate.getFullYear() - startTime.getFullYear()) * 12 + (selectDate.getMonth() - startTime.getMonth());
    // setNotInRange(monthsFromStart > monthsBetween || monthsFromStart < 0 ? true : false)
    // setOpenAlert(monthsFromStart > monthsBetween || monthsFromStart < 0 ? true : false)
    if (monthsFromStart > monthsBetween || monthsFromStart < 0) {
      setNotInRange(true)
      setMessage(t('alert.notInTime'))
    } else {
      setNotInRange(false)
      ref.current.setUrl(url)
    }
    ref.current.setUrl(url)
  }, [url, datetime, timespan])

  const forbiddenList = ['CTDProfile', 'ADCPProfile', 'dateTimePicker', 'seafloorProfile']

  useMapEvents({
    click: (e) => {
      if (!notInRange) {
        // const allElements = document.elementsFromPoint(e.layerPoint.x, e.layerPoint.y);
        const allElements = document.elementsFromPoint(e.containerPoint.x, e.containerPoint.y);
        if (allElements && allElements.length > 1) {
          const forbidden = allElements.some(ele => ele.classList.contains("MuiPaper-root") || forbiddenList.includes(ele.id))
          if (!forbidden) {
            setCoords(e.latlng)
            setOpen(true)
          }
        }
      }
    }
  });
  return (
    <>
      <TileLayer
        ref={ref}
        id='mhw'
        url={url}
        crossOrigin="anonymous"
      />
      <RenderIf isTrue={open}>
        <OdbMHWTimeSeries
          key={`${coords.lat}-${coords.lng}`}
          coords={coords}
          setOpen={setOpen}
          plotPosition={position}
          setPlotPosition={setPosition}
        />
      </RenderIf>
      <LegendControl position='bottomleft' legendContent={legnedContents.join('<br>')} legendClassNames={'sedLegend'} />
      <AlertSlide open={openAlert} severity="error" setOpen={setOpenAlert}>{alertMessage}</AlertSlide>
    </>
  )
}