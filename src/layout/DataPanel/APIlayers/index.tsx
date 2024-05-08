import { useTranslation } from "react-i18next";
import ProcWMS from './ProcWMS'
import { DataPanelRadioList } from 'components/DataPanelRadioList';
import { LegendControl } from 'components/LeafletLegend'
import { RenderIf } from "components/RenderIf/RenderIf";
import { Divider, ListSubheader } from "@mui/material";
import SeaTempAno from 'assets/images/colorbar_GHRSST_Sea_Surface_Temperature_Anomalies.png'
import SeaTemp from 'assets/images/colorbar_GHRSST_Sea_Surface_Temperature.png'
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { onoffsSlice } from "store/slice/onoffsSlice";
import { optionList, optionForecast, OptionsWmsLayer, OptionsWmsLayerForecast } from "types";

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
const APILayers = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const identifier = useAppSelector(state => state.switches.wmsLayer)
  const datetime = useAppSelector(state => state.map.datetime);
  const handleToggle = (value: string) => {
    dispatch(onoffsSlice.actions.setWmsLayer(value as OptionsWmsLayer | OptionsWmsLayerForecast))
  };
  const legendUrl = getLegendUrl(identifier)
  const legendContent = `<img src=${legendUrl} alt="legend" style="width:320px;margin:-5px"/>`
  return (
    <>
      <Divider variant="middle" />
      <ListSubheader component="div" id="nested-list-subheader" sx={{ lineHeight: '25px', marginTop: '10px' }}>
        {t('APIlayers.subheader1')}
      </ListSubheader>
      <DataPanelRadioList
        identifier={identifier}
        handleClick={handleToggle}
        group='APIlayers'
        optionList={optionList as unknown as string[]}
      />
      <Divider variant="middle" />
      <ListSubheader component="div" id="nested-list-subheader" sx={{ lineHeight: '25px', marginTop: '10px' }}>
        {t('APIlayers.subheader2')}
      </ListSubheader>
      <DataPanelRadioList
        identifier={identifier}
        handleClick={handleToggle}
        group='APIlayers'
        optionList={optionForecast as unknown as string[]}
      />
      <Divider variant="middle" />
      <RenderIf isTrue={identifier !== "close"}>
        <ProcWMS
          Identifier={identifier}
          Time={datetime}
        />
      </RenderIf>
      <RenderIf isTrue={legendUrl}>
        <LegendControl position='bottomleft' legendContent={legendContent} />
      </RenderIf>
      {/* <WMSTileLayer
        id='baseLayer'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?"
        crossOrigin="anonymous"
        params={{
          layers: 'GHRSST_L4_MUR_Sea_Surface_Temperature',
          format: 'image/png',
          time: '2023-05-27',
          transparent: true
        }}
      /> */}
    </>
  )
}

export default APILayers