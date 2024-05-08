import { TileLayerCanvas } from "components/TileLayerCanvas"
import { useAppSelector } from "hooks/reduxHooks";
import { gibsList } from "./WMTSList";
import { WmProps } from "store/slice/webmapSlice";
import SeaTempAno from 'assets/images/colorbar_GHRSST_Sea_Surface_Temperature_Anomalies.png'
import SeaTemp from 'assets/images/colorbar_GHRSST_Sea_Surface_Temperature.png'
import { RenderIf } from "components/RenderIf/RenderIf";
import { LegendControl } from "components/LeafletLegend";
import { GibsShowData } from "./GibsShowData";
import { useRef } from "react";

interface ProcGibsProps extends WmProps {
  identifier: string
}
//https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi?Service=WMTS&Request=GetTile&Version=1.0.0%20&layer=GHRSST_L4_MUR_Sea_Surface_Temperature&tilematrixset=GoogleMapsCompatible_Level7&TileMatrix={z}&TileCol={x}&TileRow={y}&style=default&TIME=2012-07-09&Format=image%2Fjpeg

const getLegendUrl = (layerIdentifier: string) => {
  switch (layerIdentifier) {
    case "sst":
      return SeaTemp
    case "ssta":
      return SeaTempAno
    default:
      return
  }
}

export const ProcGibs = (props: ProcGibsProps) => {
  const { identifier, opacity } = props
  const ref = useRef<any>()
  const time = useAppSelector(state => state.map.datetime)
  const date = time.split('T')[0]
  const newParams = Object.assign({}, { ...gibsList[identifier].params, TIME: date })
  const legendUrl = getLegendUrl(identifier)
  const legendContent = `<img src=${legendUrl} alt="legend" style="width:320px;margin:-5px"/>`
  return (
    <>
      <TileLayerCanvas
        ref={ref}
        customKey={identifier + date}
        type={gibsList[identifier].type}
        url={gibsList[identifier].urlbase}
        params={newParams}
        opacity={(opacity || opacity === 0) ? opacity / 100 : 1}
      />
      <GibsShowData layer={ref.current} colorbar={gibsList[identifier].colorbar} unit={gibsList[identifier].unit} />
      <RenderIf isTrue={legendUrl}>
        <LegendControl position='bottomleft' legendContent={legendContent} />
      </RenderIf>
    </>
  )
}