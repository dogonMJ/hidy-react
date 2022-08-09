import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "store/store"
import { coordInputSlice } from "store/slice/mapSlice";
import ProcWMS from './ProcWMS'
import { DataPanelRadioList } from 'components/DataPanelRadioList';
import { RenderIf } from "components/RenderIf/RenderIf";
import { Divider, ListSubheader } from "@mui/material";

const optionList = ["close", "GHRSST_L4_MUR_Sea_Surface_Temperature", "GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies", "MODIS_Aqua_CorrectedReflectance_TrueColor",
  "sla", "adt", "CHL",]
const optionForecast = ["close", "3dinst_thetao", "3dinst_so", "3dsea_water_velocity", "mlotst", "zos", "bottomT",]
const APILayers = (props: { cache: any }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const identifier = useSelector((state: RootState) => state.coordInput.layerIdent);
  const datetime = useSelector((state: RootState) => state.coordInput.datetime);
  const depthMeterValue = useSelector((state: RootState) => state.coordInput.depthMeterValue);
  const elevations = useSelector((state: RootState) => state.coordInput.elevations);
  const elevation = elevations[depthMeterValue]
  const cache = props.cache
  const handleToggle = (value: string) => () => {
    dispatch(coordInputSlice.actions.layerIdentifier(value))
  };
  return (
    <>
      <Divider variant="middle" />
      <ListSubheader component="div" id="nested-list-subheader" sx={{ lineHeight: '25px', marginTop: '10px' }}>
        {t('APIlayers.subheader1')}
      </ListSubheader>
      <DataPanelRadioList
        identifier={identifier}
        handelClick={handleToggle}
        group='APIlayers'
        optionList={optionList}
      />
      <Divider variant="middle" />
      <ListSubheader component="div" id="nested-list-subheader" sx={{ lineHeight: '25px', marginTop: '10px' }}>
        {t('APIlayers.subheader2')}
      </ListSubheader>
      <DataPanelRadioList
        identifier={identifier}
        handelClick={handleToggle}
        group='APIlayers'
        optionList={optionForecast}
      />
      <Divider variant="middle" />
      <RenderIf isTrue={identifier !== "close"}>
        <ProcWMS
          Identifier={identifier}
          Time={datetime}
          // elevation={elevation}
          cache={cache}
        />
      </RenderIf>
    </>
  )
}

export default APILayers