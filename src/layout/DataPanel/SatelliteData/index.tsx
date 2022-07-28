import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import { ImageOverlay } from "react-leaflet";
import { DataPanelRadioList } from 'components/DataPanelRadioList';
import { RenderIf } from "components/RenderIf/RenderIf";

const optionList = ['close', 'madt', 'msla', 'chla']
const SatelliteData = () => {
  const ref = useRef<any>(null)
  const [identifier, setIdentifier] = useState('close')
  const datetime = useSelector((state: RootState) => state.coordInput.datetime);
  const date = datetime.replace(/T.*|-/g, '')

  const handleToggle = (value: string) => () => {
    setIdentifier(value)
  };;

  useEffect(() => {
    if (ref.current) {
      const url = `https://odbpo.oc.ntu.edu.tw/static/figs/${identifier}/${identifier}${date}.png`
      ref.current.setUrl(url)
    }
  })
  return (
    <>
      <DataPanelRadioList
        identifier={identifier}
        handelClick={handleToggle}
        group='SatelliteData'
        optionList={optionList}
      />
      <RenderIf isTrue={identifier !== 'close'}>
        <ImageOverlay ref={ref} url={''} crossOrigin='anonymous' bounds={[[2, 105], [35, 150]]} />
      </RenderIf>
    </>
  );
}

export default SatelliteData