import { objectToQueryString } from "Utils/UtilsApi";
import { TileLayerCanvas } from "components/TileLayerCanvas"
import { useAppSelector } from "hooks/reduxHooks";
import { cmemsList } from "./WMTSList";
import { WmProps } from "store/slice/webmapSlice";

interface ProcCMEMSProps extends WmProps {
  identifier: string
}

export const ProcCMEMS = (props: ProcCMEMSProps) => {
  const { identifier, opacity, cmap = 'default', min, max, noClamp = false, inverse = false, elevation } = props
  const time = useAppSelector(state => state.map.datetime)
  let style = `style=cmap:${cmap}`
  style = noClamp ? `${style},noClamp` : style
  style = inverse ? `${style},inverse` : style
  style = (min && max) ? `${style},range:${min}/${max}` : style
  const url = elevation ?
    `${cmemsList[identifier].urlbase}${objectToQueryString(cmemsList[identifier].params)}&${style}&time=${time}&elevation=${elevation}&format=image/png` :
    `${cmemsList[identifier].urlbase}${objectToQueryString(cmemsList[identifier].params)}&${style}&time=${time}&format=image/png`
  return (
    <>
      <TileLayerCanvas type={cmemsList[identifier].type} url={url} opacity={(opacity || opacity === 0) ? opacity / 100 : 1} />
    </>
  )
}