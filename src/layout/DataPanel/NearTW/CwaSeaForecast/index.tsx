import { useCallback, useEffect, useRef, useState } from "react";
import { GeoJSON, Pane, Popup } from "react-leaflet";
import { DataPanelRadioList } from 'components/DataPanelRadioList';
import { RenderIf } from "components/RenderIf/RenderIf";
import { useAlert } from "hooks/useAlert";
import { AlertSlide } from "components/AlertSlide/AlertSlide";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { onoffsSlice } from "store/slice/onoffsSlice";
import { FeatureCollection, Point } from 'geojson'
import { calDir, createIntervalList, findInterval, getColorWithInterval } from 'Utils/UtilsODB';
import { BrushOutlined, BrushRounded } from "@mui/icons-material";
import { CWAForecastCustomPanel } from "./CWAForecastCustomPanel";
import { reversePalette } from "layout/DataPanel/ODB/OdbCTD";
import CMEMSPalettes from "assets/jsons/CMEMS_cmap.json"
import { LatLng, LeafletMouseEvent } from "leaflet";
import { Feature } from 'geojson'
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ColorPaletteLegend } from "components/ColorPaletteLegend";
import OrangeArrow from 'assets/images/ArrowUp.png'
import BlackArrow from 'assets/images/black.png'
import GreyArrow from 'assets/images/grey.png'
import 'Utils/canvasmarker.js'
import { PanelSlider } from "components/PanelSlider";
declare const L: any;

// const optionsCur = [...optionListCWAForeCur]
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
export const CwaSeaForecast = () => {
  const ref = useRef<any>()
  const refDir = useRef<any>()
  const refCurPane = useRef<any>()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { openAlert, alertMessage, setOpenAlert, setMessage } = useAlert()
  const datetime = useAppSelector(state => state.map.datetime);
  const date = datetime.replace(/T|-|:/g, '').substring(0, 10)
  const popupTime = formatPopupTime(datetime)
  const identifier = useAppSelector(state => state.switches.cwaSeaForecast)
  const customs = useAppSelector(state => state.cwaForecast[identifier])
  const opacity = customs.opacity
  const palette = customs.palette
  const inverse = customs.inverse
  const mask = customs.mask
  const min = customs.min
  const max = customs.max

  const [data, setData] = useState<any>()
  const [openCustomPanel, setOpenCustomPanel] = useState(false)
  const [popupContent, setPopupContent] = useState(<></>)
  const [check, setCheck] = useState(false)
  const [dirKey, setDirKey] = useState(0)
  const [arrow, setArrow] = useState('black')
  const [scale, setScale] = useState(false)
  const [level, setLevel] = useState(2)
  const [dirPointToLayer, setDirPointToLayer] = useState(() => createPointToLayer(arrow, scale, level));

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

  const pointToLayer = (feature: Feature<Point, any>, latlng: LatLng) => {
    const cellsize = 0.1
    const extend = cellsize / 2
    const lat = latlng.lat
    const lng = latlng.lng
    const bounds = [[lat - extend, lng - extend], [lat + extend, lng + extend]]
    // return new L.rectangle(bounds, { pane: 'CWA' })
    return new L.rectangle(bounds)
  }

  const handlePopup = (e: LeafletMouseEvent) => {
    const property = e.sourceTarget.feature.properties
    const center = e.sourceTarget.feature.geometry.coordinates
    const content = (
      <Box>
        {center[1]}, {center[0]}<br />
        {popupTime}<br />
        {t('CwaSeaForecast.sst')}: {isNumber(property.SST, 2)}<br />
        {t('CwaSeaForecast.sal')}: {isNumber(property.SAL, 1)}<br />
        {t('CwaSeaForecast.ssh')}: {isNumber(property.SSH, 2)}<br />
        {t('CwaSeaForecast.dir')}: {isNumber(property.DIR, 1)}<br />
        {t('CwaSeaForecast.spd')}: {isNumber(property.SPD, 3)}<br />
        {t('CwaSeaForecast.east')}: {isNumber(property.UC, 3)}<br />
        {t('CwaSeaForecast.north')}: {isNumber(property.VC, 3)}
      </Box>
    )
    setPopupContent(content)
  }

  const handleCheck = () => {
    setCheck((prev) => !prev)
  }

  useEffect(() => {
    if (refDir.current) {
      if (check) {
        refDir.current.bringToFront()
        refDir.current.addData(data)
        refDir.current.setStyle({ fillColor: 'red' })
      } else {
        refDir.current.bringToBack() //避免蓋在ref上點不到
        refDir.current.clearLayers()
      }
    }
    // if (refCurPane.current) {
    //   if (check) {
    //     refCurPane.current.style.zIndex = 410
    //   } else {
    //     refCurPane.current.style.zIndex = 399
    //   }
    // }
  }, [check, data])


  useEffect(() => {
    if (ref.current) {
      ref.current.bringToBack()
      if (identifier === 'close') {
        ref.current.clearLayers()
      } else {
        fetch(`${process.env.REACT_APP_PROXY_BASE}/data/figs/cwaforecast/data_${date}.json`)
          .then((response) => response.json())
          .then((json: FeatureCollection) => {
            ref.current.clearLayers()
            ref.current.addData(json)
            setData(json)
          })
          .catch((e) => {
            ref.current.clearLayers()
            console.log(e)
          })
      }
    }
  }, [identifier, date])
  useEffect(() => {
    if (check) {
      setDirPointToLayer(() => createPointToLayer(arrow, scale, level));
      setDirKey(prev => prev + 1)
    }
  }, [arrow, scale, level]);
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
      <FormControlLabel
        control={
          <Switch
            checked={check}
            onChange={handleCheck}
          />
        }
        label="CwaSeaForecast.DIR"
        sx={{ paddingLeft: '16px' }}
      />
      <br />
      <FormControl>
        <FormLabel id="ArrowSwitch">Arrow</FormLabel>
        <RadioGroup
          row
          aria-labelledby="ArrowSwitch"
          name="ArrowSwitch"
          value={arrow}
          onChange={(e) => setArrow(e.target.value)}
        >
          <FormControlLabel value="grey" control={<Radio />} label="Grey" />
          <FormControlLabel value="black" control={<Radio />} label="Black" />
          <FormControlLabel value="orange" control={<Radio />} label="Orange" />
        </RadioGroup>
      </FormControl>
      <br />
      <FormControlLabel
        control={
          <Switch
            checked={scale}
            onChange={() => setScale(prev => !prev)}
          />
        }
        label="CwaSeaForecast.scale"
        sx={{ paddingLeft: '16px' }}
      />
      <br />
      <PanelSlider
        initValue={level}
        min={1}
        max={3}
        onChangeCommitted={(e, value) => setLevel(value as number)}
        track={false}
      />
      {/* <RenderIf isTrue={['SST', 'SAL', 'SSH', 'SPD'].includes(identifier)}> */}
      {/* <Pane name={'CWA'} > */}
      <GeoJSON
        key={identifier}
        ref={ref}
        data={data}
        style={styleFunc}
        // onEachFeature={onEachFeature} //much slower
        pointToLayer={pointToLayer}
        eventHandlers={{
          mousedown: handlePopup
        }}
      >
        {/* <Pane name='cwa-popup' style={{ zIndex: 450, opacity: 1 }}> */}
        <Popup>{popupContent}</Popup>
        {/* </Pane> */}
      </GeoJSON>
      {/* </Pane> */}
      {/* </RenderIf> */}
      {/* <Pane ref={refCurPane} name={'CWA_DIR'} > */}
      {/* <RenderIf isTrue={check}> */}
      <GeoJSON
        key={dirKey}
        ref={refDir}
        data={data}
        style={{ fillOpacity: 0.5, fillColor: 'red' }}
        eventHandlers={{
          mousedown: handlePopup
        }}
        pointToLayer={dirPointToLayer}
      >
        {/* <Pane name='cur-popup' style={{ zIndex: 450 }} className="cur-popup"> */}
        <Popup>{popupContent}</Popup>
        {/* </Pane> */}
      </GeoJSON>
      {/* </RenderIf> */}
      {/* </Pane> */}
      <RenderIf isTrue={identifier && identifier !== 'close'}>
        <ColorPaletteLegend
          palette={reversePalette(CMEMSPalettes[palette as keyof typeof CMEMSPalettes], inverse)}
          interval={256}
          min={min}
          max={max}
          title={t(`OdbData.CwaSeaForecast.${identifier}`)}
        />
      </RenderIf>
      <AlertSlide open={openAlert} setOpen={setOpenAlert} severity='error' timeout={3000} > {alertMessage} </AlertSlide>
    </>
  );
}