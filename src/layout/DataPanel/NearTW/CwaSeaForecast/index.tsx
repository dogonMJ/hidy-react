import { useEffect, useRef, useState } from "react";
import { GeoJSON, Pane, Rectangle } from "react-leaflet";
import { DataPanelRadioList } from 'components/DataPanelRadioList';
import { RenderIf } from "components/RenderIf/RenderIf";
import { useAlert } from "hooks/useAlert";
import { AlertSlide } from "components/AlertSlide/AlertSlide";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { onoffsSlice } from "store/slice/onoffsSlice";
import { FeatureCollection, Point } from 'geojson'
import { createIntervalList, findInterval, getColorWithInterval } from 'Utils/UtilsODB';
import { BrushOutlined, BrushRounded } from "@mui/icons-material";
import { CWAForecastCustomPanel } from "./CWAForecastCustomPanel";
import { reversePalette } from "layout/DataPanel/ODB/OdbCTD";
import CMEMSPalettes from "assets/jsons/CMEMS_cmap.json"
import { LatLng } from "leaflet";
import { Feature } from 'geojson'
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { renderToString } from "react-dom/server";
declare const L: any;
// const optionsCur = [...optionListCWAForeCur]
const isNumber = (data: any, digit: number) => isNaN(data) ? data : data.toFixed(digit)

export const CwaSeaForecast = () => {
  const ref = useRef<any>()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { openAlert, alertMessage, setOpenAlert, setMessage } = useAlert()
  const datetime = useAppSelector(state => state.map.datetime);
  const date = datetime.replace(/T|-|:/g, '').substring(0, 10)
  const identifier = useAppSelector(state => state.switches.cwaSeaForecast)
  const customs = useAppSelector(state => state.cwaForecast[identifier])
  const opacity = customs.opacity
  const palette = customs.palette
  const inverse = customs.inverse
  const mask = customs.mask
  const min = customs.min
  const max = customs.max

  const [data, setData] = useState<any>({ features: {} })
  const [openCustomPanel, setOpenCustomPanel] = useState(false)

  const hadleBrushClick = async (ev: any) => {
    const id = ev.currentTarget.id
    if (id === identifier) { setOpenCustomPanel(prev => !prev) }
  }
  const handleToggleForecast = (value: any) => {
    dispatch(onoffsSlice.actions.setCwaSeaForecast(value))
  };
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

  const onEachFeature = (feature: Feature<Point, any>, layer: L.Layer) => {
    if (feature.geometry.type === 'Point') {
      const property = feature.properties
      const center = feature.geometry.coordinates
      const content = (
        <Box>
          {center[1]}, {center[0]}<br />
          {t('CwaSeaForecast.sst')}: {isNumber(property.SST, 2)}<br />
          {t('CwaSeaForecast.sal')}: {isNumber(property.SAL, 1)}<br />
          {t('CwaSeaForecast.ssh')}: {isNumber(property.SSH, 2)}<br />
          {t('CwaSeaForecast.dir')}: {isNumber(property.DIR, 1)}<br />
          {t('CwaSeaForecast.spd')}: {isNumber(property.SPD, 3)}<br />
          {t('CwaSeaForecast.east')}: {isNumber(property.UC, 3)}<br />
          {t('CwaSeaForecast.north')}: {isNumber(property.VC, 3)}
        </Box>
      )
      layer.bindTooltip(renderToString(content))
    }
  }
  const pointToLayer = (feature: Feature<Point, any>, latlang: LatLng) => {
    const cellsize = 0.1
    const extend = cellsize / 2
    const lat = latlang.lat
    const lng = latlang.lng
    const bounds = [[lat - extend, lng - extend], [lat + extend, lng + extend]]
    return new L.rectangle(bounds)
  }
  useEffect(() => {
    if (ref.current) {
      if (identifier === 'close') {
        ref.current.clearLayers()
      } else if (ref.current.getLayers().length === 0) {
        fetch(`${process.env.REACT_APP_PROXY_BASE}/data/figs/cwaforecast/data_${date}.json`)
          .then((response) => response.json())
          .then((json: FeatureCollection) => {
            ref.current.addData(json)
          })
          .catch((e) => {
            console.log(e)
          })
      }
    }
  }, [identifier])

  useEffect(() => {
    if (identifier !== 'close' && ref.current) {
      ref.current.clearLayers()
      fetch(`${process.env.REACT_APP_PROXY_BASE}/data/figs/cwaforecast/data_${date}.json`)
        .then((response) => response.json())
        .then((json: FeatureCollection) => {
          ref.current.addData(json)
        })
    }
  }, [date])

  return (
    <>
      <DataPanelRadioList
        group="CwaSeaForecast"
        identifier={identifier}
        optionList={['close']}
        handleClick={handleToggleForecast}
      />
      <DataPanelRadioList
        group='CwaSeaForecast'
        identifier={identifier}
        optionList={['SST', 'SAL', 'SSH', 'SPD']}
        handleClick={handleToggleForecast}
        customButtonProps={{
          handleClick: hadleBrushClick,
          Icon: <BrushOutlined />,
          closeIcon: <BrushRounded />,
          open: openCustomPanel
        }}
        customPanel={
          <RenderIf isTrue={openCustomPanel}>
            <CWAForecastCustomPanel identifier={identifier} />
          </RenderIf>
        }
      />
      <Pane name={'CWA'}>
        <GeoJSON
          key={identifier}
          ref={ref}
          data={data}
          style={styleFunc}
          onEachFeature={onEachFeature}
          pointToLayer={pointToLayer}
        />
      </Pane>
      <AlertSlide open={openAlert} setOpen={setOpenAlert} severity='error' timeout={3000} > {alertMessage} </AlertSlide>
    </>
  );
}