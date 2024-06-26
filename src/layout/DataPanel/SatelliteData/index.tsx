import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import { ImageOverlay } from "react-leaflet";
import { DataPanelRadioList } from 'components/DataPanelRadioList';
import { RenderIf } from "components/RenderIf/RenderIf";
import { Divider } from "@mui/material";

const optionList = ['close', 'madt', 'msla', 'chla']
const SatelliteData = () => {
  const ref = useRef<any>(null)
  const [identifier, setIdentifier] = useState('close')
  const datetime = useSelector((state: RootState) => state.map.datetime);
  const date = datetime.replace(/T.*|-/g, '')

  const handleToggle = (value: string) => () => {
    setIdentifier(value)
  };;

  useEffect(() => {
    if (ref.current) {
      const url = `${process.env.REACT_APP_PROXY_BASE}/data/figs/${identifier}/${identifier}${date}.png`
      ref.current.setUrl(url)
    }
  })
  return (
    <>
      <Divider variant="middle" />
      <DataPanelRadioList
        identifier={identifier}
        handleClick={handleToggle}
        group='SatelliteData'
        optionList={optionList}
      />
      <Divider variant="middle" />
      <RenderIf isTrue={identifier !== 'close'}>
        <ImageOverlay ref={ref} url={''} crossOrigin='anonymous' bounds={[[2, 105], [35, 150]]} />
      </RenderIf>
    </>
  );
}

export default SatelliteData