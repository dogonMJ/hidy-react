import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import { ImageOverlay } from "react-leaflet";
import { DataPanelRadioList } from 'components/DataPanelRadioList';
import { RenderIf } from "components/RenderIf/RenderIf";
import { ShowCwbForecast } from "./ShowCwbForecast";
import { Divider } from "@mui/material";

const optionList = ['close', 'cwbsst', 'cwbpsu', 'cwbsla', 'cwbspd']
const optionList2 = ['close', 'cwbcur', 'cwbdir']
const getUrl = (identifier: string, date: string) => `${process.env.REACT_APP_PROXY_BASE}/data/figs/cwbforecast/epsg3857_${identifier}_${date}.png`
const CwbSeaForecast = () => {
  const ref = useRef<any>(null)
  const ref2 = useRef<any>(null)
  const [identifier, setIdentifier] = useState('close')
  const [identifier2, setIdentifier2] = useState('close')
  const [jsonData, setJsonData] = useState(null)
  const datetime = useSelector((state: RootState) => state.coordInput.datetime);
  const date = datetime.replace(/T|-|:/g, '').substring(0, 10)

  const handleToggle = (value: string) => () => {
    setIdentifier(value)
  };
  const handleToggle2 = (value: string) => () => {
    setIdentifier2(value)
  };
  useEffect(() => {
    if (ref.current) {
      const url = getUrl(identifier, date)
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
      const url = getUrl(identifier2, date)
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
  }, [datetime, identifier, identifier2])
  useEffect(() => {
    if (identifier !== 'close' || identifier2 !== 'close') {
      fetch(`${process.env.REACT_APP_PROXY_BASE}/data/figs/cwbforecast/data_${date}.json`)
        .then((response) => response.json())
        .then((json) => {
          setJsonData(json)
        })
        .catch((e) => {
          setJsonData(null)
        })
    }
  }, [date, identifier, identifier2])
  return (
    <>
      <DataPanelRadioList
        identifier={identifier2}
        handleClick={handleToggle2}
        group='CwbSeaForecast'
        optionList={optionList2}
      />
      <Divider variant="middle" sx={{ width: '80%', marginLeft: '16%', }} flexItem light />
      <DataPanelRadioList
        identifier={identifier}
        handleClick={handleToggle}
        group='CwbSeaForecast'
        optionList={optionList}
      />
      <RenderIf isTrue={(identifier !== 'close' || identifier2 !== 'close') && jsonData}>
        <ShowCwbForecast data={jsonData} bounds={[[6.95, 109.95], [36.05, 126.05]]} />
      </RenderIf>
      <RenderIf isTrue={identifier2 !== 'close'}>
        <ImageOverlay ref={ref2} url={''} crossOrigin='anonymous' bounds={[[6.95, 109.95], [36.05, 126.05]]} zIndex={3} />
      </RenderIf>
      <RenderIf isTrue={identifier !== 'close'}>
        <ImageOverlay ref={ref} url={''} crossOrigin='anonymous' bounds={[[6.95, 109.95], [36.05, 126.05]]} zIndex={2} />
      </RenderIf>
    </>
  );
}

export default CwbSeaForecast