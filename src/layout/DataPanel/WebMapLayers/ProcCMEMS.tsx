import { objectToQueryString } from "Utils/UtilsApi";
import { TileLayerCanvas } from "components/TileLayerCanvas"
import { useAppSelector } from "hooks/reduxHooks";
import { cmemsList } from "./cmemsWMTSList";
import { WmProps } from "store/slice/webmapSlice";

interface ProcCMEMSProps extends WmProps {
  identifier: string
}

export const ProcCMEMS = (props: ProcCMEMSProps) => {
  const { identifier, opacity, cmap = 'default', range, mask = false, inverse = false, logScale = false, elevation } = props
  const time = useAppSelector(state => state.map.datetime)
  let style = `style=cmap:${cmap}`
  style = mask ? `${style},noClamp` : style
  style = inverse ? `${style},inverse` : style
  style = range ? `${style},range:${range.min}/${range.max}` : style
  style = logScale ? `${style},logScale` : style
  const url = `${cmemsList[identifier].urlbase}${objectToQueryString(cmemsList[identifier].params)}&${style}&time=${time}`
  return (
    <>
      <TileLayerCanvas type={cmemsList[identifier].type} url={url} opacity={opacity ? opacity / 100 : 1} />
    </>
  )
}