import { useEffect, useRef, useState } from "react";
import { GeoJSON, Popup } from "react-leaflet";
import { RenderIf } from "components/RenderIf/RenderIf";
import { useAlert } from "hooks/useAlert";
import { AlertSlide } from "components/AlertSlide/AlertSlide";
import { useAppSelector } from "hooks/reduxHooks";
import { Point } from 'geojson'
import { calDir, createIntervalList, findInterval, getColorWithInterval } from 'Utils/UtilsODB';
import { reversePalette } from "layout/DataPanel/ODB/OdbCTD";
import CMEMSPalettes from "assets/jsons/CMEMS_cmap.json"
import { LatLng, LeafletMouseEvent } from "leaflet";
import { Feature } from 'geojson'
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ColorPaletteLegend } from "components/ColorPaletteLegend";
import OrangeArrow from 'assets/images/ArrowUp.png'
import BlackArrow from 'assets/images/black.png'
import GreyArrow from 'assets/images/grey.png'
import 'Utils/canvasmarker.js'
import { CMEMSPalette } from "types";
declare const L: any;

const isNumber = (data: any, digit: number) => isNaN(data) ? data : data.toFixed(digit)
const formatPopupTime = (datetime: string) => {
  const [datePart, timePart] = datetime.split('T')
  return `${datePart} ${timePart.split(':')[0]}hr UTC`
}
const switchArrowColor = (arrowColor: string) => {
  switch (arrowColor) {
    case 'grey':
      return GreyArrow
    case 'black':
      return BlackArrow
    case 'orange':
      return OrangeArrow
    default:
      return GreyArrow
  }
}
const switchSize = (scale: boolean, level: number, speed: number) => {
  switch (level) {
    case 1:
      return scale ? [speed / 20, speed / 5] : [2, 8]
    case 2:
      return scale ? [speed / 10, speed / 2.5] : [4, 16]
    case 3:
      return scale ? [speed / 4, speed] : [10, 40]
    default:
      return [4, 16]
  }
}
const createPointToLayer = (arrowColor: string, scale: boolean, level: number) => {
  return (feature: any, latlng: LatLng) => {
    const property = feature.properties
    const u = Number(property.UC)
    const v = Number(property.VC)
    const angle = calDir(u, v)
    const speed = property.SPD * 40
    return L.canvasMarker(latlng, {
      img: {
        url: switchArrowColor(arrowColor),
        size: switchSize(scale, level, speed),
        rotate: angle,
      },
    });
  };
}
const pointToLayer = (feature: Feature<Point, any>, latlng: LatLng) => {
  const cellsize = 0.1
  const extend = cellsize / 2
  const lat = latlng.lat
  const lng = latlng.lng
  const bounds = [[lat - extend, lng - extend], [lat + extend, lng + extend]]
  return new L.rectangle(bounds)
}
export const CwaSeaForecast = () => {
  const ref = useRef<any>()
  const refDir = useRef<any>()
  const { t } = useTranslation()
  const { openAlert, alertMessage, setOpenAlert, setMessage } = useAlert()
  const datetime = useAppSelector(state => state.map.datetime);
  const date = datetime.replace(/T|-|:/g, '').substring(0, 10)
  const popupTime = formatPopupTime(datetime)
  const identifier = useAppSelector(state => state.switches.cwaSeaForecast)
  const arrow = useAppSelector(state => state.cwaForecastDir.arrow)
  const level = useAppSelector(state => state.cwaForecastDir.level)
  const scale = useAppSelector(state => state.cwaForecastDir.scale)
  const checked = useAppSelector(state => state.switches.checked)
  const dir = checked.includes('cwaForecastDir')
  const customs = useAppSelector(state => state.cwaForecast[identifier])
  const opacity = customs.opacity
  const palette = customs.palette
  const inverse = customs.inverse
  const mask = customs.mask
  const min = customs.min
  const max = customs.max

  const [data, setData] = useState<any>()
  const [popupContent, setPopupContent] = useState(<></>)
  const [dirKey, setDirKey] = useState(0)
  const [dirPointToLayer, setDirPointToLayer] = useState(() => createPointToLayer(arrow, scale, level));

  const styleFunc = (feature: any) => {
    const value = feature.properties[identifier]
    if (value) {
      const colorList = reversePalette(CMEMSPalettes[palette as keyof typeof CMEMSPalettes], inverse)
      const length = colorList.length
      const i = findInterval(value, createIntervalList(min, max, length - 2))
      return {
        color: getColorWithInterval(colorList, length)[i],
        stroke: false,
        fillOpacity: (mask && (value < min || value > max)) ? 0 : opacity / 100,
      }
    }
    else {
      return {
        weight: 0,
        fillOpacity: 0
      }
    }
  }

  const handlePopup = (e: LeafletMouseEvent) => {
    const property = e.sourceTarget.feature.properties
    const center = e.sourceTarget.feature.geometry.coordinates
    const content = (
      <Box>
        {center[1]}, {center[0]}<br />
        {popupTime}<br />
        {t('CwaSeaForecast.legendSST')}: {isNumber(property.SST, 2)}<br />
        {t('CwaSeaForecast.legendSAL')}: {isNumber(property.SAL, 1)}<br />
        {t('CwaSeaForecast.legendSSH')}: {isNumber(property.SSH, 2)}<br />
        {t('CwaSeaForecast.DIR')}: {isNumber(property.DIR, 1)}<br />
        {t('CwaSeaForecast.legendSPD')}: {isNumber(property.SPD, 3)}<br />
        {t('CwaSeaForecast.east')}: {isNumber(property.UC, 3)}<br />
        {t('CwaSeaForecast.north')}: {isNumber(property.VC, 3)}
      </Box>
    )
    setPopupContent(content)
  }

  const fetchData = (requestedDate: string) => {
    fetch(`${process.env.REACT_APP_PROXY_BASE}/data/figs/cwaforecast/data_${requestedDate}.json`)
      .then((response) => response.json())
      .then((json) => {
        if (json.type === 'FeatureCollection') {
          setData(json);
          if (dir) {
            try {
              refDir.current.clearLayers()
              refDir.current.addData(json)
              refDir.current.bringToFront()
              setDirKey(prev => prev + 1)
            } catch (e) {
              console.log(e)
              refDir.current.clearLayers()
            }
          }
          if (identifier && identifier !== 'close') {
            try {
              ref.current.clearLayers()
              ref.current.addData(json)
              ref.current.bringToBack()
            } catch (e) {
              console.log(e)
              ref.current.clearLayers()
            }
          }
        } else {
          setMessage(t('alert.notInTime'))
        }
      })
      .catch((e) => {
        setMessage(t('alert.notInTime'))
        console.log(e);
      });
  };

  useEffect(() => {
    fetchData(date)
  }, [date])

  useEffect(() => {
    if (refDir.current) {
      if (dir) {
        if (data) {
          refDir.current.clearLayers()
          refDir.current.addData(data)
          setDirKey(prev => prev + 1)
        } else {
          fetchData(date)
        }
      } else {
        refDir.current.clearLayers()
      }
    }
  }, [dir])

  useEffect(() => {
    if (ref.current) {
      if (identifier === 'close') {
        ref.current.clearLayers()
      } else {
        ref.current.bringToBack()
      }
    }
  }, [identifier])

  useEffect(() => {
    if (dir) {
      setDirPointToLayer(() => createPointToLayer(arrow, scale, level));
      setDirKey(prev => prev + 1)
    }
  }, [arrow, scale, level]);

  return (
    <>
      <RenderIf isTrue={['SST', 'SAL', 'SSH', 'SPD'].includes(identifier)}>
        <GeoJSON
          key={identifier}
          ref={ref}
          data={data}
          style={styleFunc}
          pointToLayer={pointToLayer}
          eventHandlers={{ mousedown: handlePopup }}
        >
          <Popup>{popupContent}</Popup>
        </GeoJSON>
      </RenderIf>
      <RenderIf isTrue={dir}>
        <GeoJSON
          key={dirKey}
          ref={refDir}
          data={data}
          eventHandlers={{ mousedown: handlePopup }}
          pointToLayer={dirPointToLayer}
        >
          <Popup>{popupContent}</Popup>
        </GeoJSON>
      </RenderIf>
      <RenderIf isTrue={identifier && identifier !== 'close'}>
        <ColorPaletteLegend
          palette={reversePalette(CMEMSPalettes[palette as CMEMSPalette], inverse)}
          interval={256}
          min={min}
          max={max}
          title={t(`CwaSeaForecast.legend${identifier}`)}
        />
      </RenderIf>
      <AlertSlide open={openAlert} setOpen={setOpenAlert} severity='error' timeout={3000} > {alertMessage} </AlertSlide>
    </>
  );
}