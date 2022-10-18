import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "store/store"
import ProcWMS from './ProcWMS'
import { DataPanelRadioList } from 'components/DataPanelRadioList';
// import { ImageLengend } from "components/ImageLegend";
import { LegendControl } from 'components/LeafletLegend'
import { RenderIf } from "components/RenderIf/RenderIf";
import { Divider, ListSubheader } from "@mui/material";
import SeaTempAno from 'assets/images/colorbar_GHRSST_Sea_Surface_Temperature_Anomalies.png'
import SeaTemp from 'assets/images/colorbar_GHRSST_Sea_Surface_Temperature.png'
import { useState } from "react";

const optionList = ["close", "GHRSST_L4_MUR_Sea_Surface_Temperature", "GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies", "MODIS_Aqua_CorrectedReflectance_TrueColor",
  "sla", "adt", "CHL",]
const optionForecast = ["close", "3dinst_thetao", "3dinst_so", "3dsea_water_velocity", "mlotst", "zos", "bottomT",]
const getLegendUrl = (layerIdentifier: string) => {
  switch (layerIdentifier) {
    case "GHRSST_L4_MUR_Sea_Surface_Temperature":
      return SeaTemp
    case "GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies":
      return SeaTempAno
    default:
      return
  }
}
const APILayers = (props: { cache: any }) => {
  const { t } = useTranslation()
  const [identifier, setIdentifier] = useState("close")
  const datetime = useSelector((state: RootState) => state.coordInput.datetime);
  const cache = props.cache
  const handleToggle = (value: string) => () => {
    setIdentifier(value)
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
        optionList={optionList}
      />
      <Divider variant="middle" />
      <ListSubheader component="div" id="nested-list-subheader" sx={{ lineHeight: '25px', marginTop: '10px' }}>
        {t('APIlayers.subheader2')}
      </ListSubheader>
      <DataPanelRadioList
        identifier={identifier}
        handleClick={handleToggle}
        group='APIlayers'
        optionList={optionForecast}
      />
      <Divider variant="middle" />
      <RenderIf isTrue={identifier !== "close"}>
        <ProcWMS
          Identifier={identifier}
          Time={datetime}
          cache={cache}
        />
      </RenderIf>
      <RenderIf isTrue={legendUrl}>
        <LegendControl position='bottomleft' legendContent={legendContent} />
      </RenderIf>
    </>
  )
}

export default APILayers