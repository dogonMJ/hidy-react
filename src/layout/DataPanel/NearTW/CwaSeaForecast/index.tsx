import { useEffect, useRef, useState } from "react";
import { ImageOverlay } from "react-leaflet";
import { DataPanelRadioList } from 'components/DataPanelRadioList';
import { RenderIf } from "components/RenderIf/RenderIf";
import { ShowCwaForecast } from "./ShowCwaForecast";
import { Divider } from "@mui/material";
import { useAlert } from "hooks/useAlert";
import { AlertSlide } from "components/AlertSlide/AlertSlide";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { isOptionsCWAFore, isOptionsCWAForeCur, optionListCWAFore, optionListCWAForeCur } from "types";
import { onoffsSlice } from "store/slice/onoffsSlice";

const optionsForecast = [...optionListCWAFore]
const optionsCur = [...optionListCWAForeCur]
const getUrl = (identifier: string, date: string) => `${process.env.REACT_APP_PROXY_BASE}/data/figs/cwaforecast/epsg3857_${identifier}_${date}.png`

export const CwaSeaForecast = () => {
  const ref = useRef<any>(null)
  const ref2 = useRef<any>(null)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const idForecast = useAppSelector(state => state.switches.cwaSeaForecast)
  const idCur = useAppSelector(state => state.switches.cwaSeaForeCur)
  const [jsonData, setJsonData] = useState(null)
  const { openAlert, alertMessage, setOpenAlert, setMessage } = useAlert()
  const datetime = useAppSelector(state => state.map.datetime);
  const date = datetime.replace(/T|-|:/g, '').substring(0, 10)

  const handleToggleForecast = (value: string) => () => {
    isOptionsCWAFore(value) ?
      dispatch(onoffsSlice.actions.setCwaSeaForecast(value)) :
      setMessage(t('alert.checkQueryParameter'))
  };
  const handleToggleCur = (value: string) => () => {
    isOptionsCWAForeCur(value) ?
      dispatch(onoffsSlice.actions.setCwaSeaForeCur(value)) :
      setMessage(t('alert.checkQueryParameter'))
  };
  useEffect(() => {
    if (ref.current) {
      const url = getUrl(idForecast, date)
      fetch(url, { method: "HEAD" })
        .then((response) => {
          if (response.ok) {
            ref.current.setUrl(url)
            ref.current.setOpacity(1)
          }
        })
        .catch(err => {
          ref.current.setUrl()
          ref.current.setOpacity(0)
        })
    };
    if (ref2.current) {
      const url = getUrl(idCur, date)
      fetch(url, { method: "HEAD" })
        .then((response) => {
          if (response.ok) {
            ref2.current.setUrl(url)
            ref2.current.setOpacity(1)
          }
        })
        .catch(err => {
          ref2.current.setUrl()
          ref2.current.setOpacity(0)
        })
    }
  }, [datetime, idForecast, idCur])
  useEffect(() => {
    if (idForecast !== 'close' || idCur !== 'close') {
      fetch(`${process.env.REACT_APP_PROXY_BASE}/data/figs/cwaforecast/data_${date}.json`)
        .then((response) => response.json())
        .then((json) => {
          setJsonData(json)
        })
        .catch((e) => {
          setJsonData(null)
          if (ref.current) {
            ref.current.setUrl()
            ref.current.setOpacity(0)
          }
          if (ref2.current) {
            ref2.current.setUrl()
            ref2.current.setOpacity(0)
          }
          setMessage(t('alert.notInTime'))
        })
    }
  }, [date, idForecast, idCur])
  return (
    <>
      <DataPanelRadioList
        identifier={idCur}
        handleClick={handleToggleCur}
        group='CwaSeaForecast'
        optionList={optionsCur}
      />
      <Divider variant="middle" sx={{ width: '80%', marginLeft: '16%', }} flexItem light />
      <DataPanelRadioList
        identifier={idForecast}
        handleClick={handleToggleForecast}
        group='CwaSeaForecast'
        optionList={optionsForecast}
      />
      <RenderIf isTrue={(idForecast !== 'close' || idCur !== 'close') && jsonData}>
        <ShowCwaForecast data={jsonData} bounds={[[6.95, 109.95], [36.05, 126.05]]} />
      </RenderIf>
      <RenderIf isTrue={idCur !== 'close'}>
        <ImageOverlay ref={ref2} url={''} crossOrigin='anonymous' bounds={[[6.95, 109.95], [36.05, 126.05]]} zIndex={3} opacity={0} />
      </RenderIf>
      <RenderIf isTrue={idForecast !== 'close'}>
        <ImageOverlay ref={ref} url={''} crossOrigin='anonymous' bounds={[[6.95, 109.95], [36.05, 126.05]]} zIndex={2} opacity={0} />
      </RenderIf>
      <AlertSlide open={openAlert} setOpen={setOpenAlert} severity='error' timeout={3000} > {alertMessage} </AlertSlide>
    </>
  );
}