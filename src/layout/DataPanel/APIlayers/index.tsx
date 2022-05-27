import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store/store"
import { coordInputSlice } from "store/slice/mapSlice";
import ProcWMS from './ProcWMS'
import { DataPanelRadioList } from 'components/DataPanelRadioList';
import { RenderIf } from "components/RenderIf/RenderIf";

const optionList = ["close", "GHRSST_L4_MUR_Sea_Surface_Temperature",
  "GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies", "MODIS_Aqua_CorrectedReflectance_TrueColor", "sla", "adt", "CHL", "3dinst_thetao"]
const APILayers = (props: { cache: any }) => {
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
      <DataPanelRadioList
        identifier={identifier}
        handelClick={handleToggle}
        group='APIlayers'
        optionList={optionList}
      />
      <RenderIf isTrue={identifier !== "close"}>
        <ProcWMS
          Identifier={identifier}
          Time={datetime}
          elevation={elevation}
          cache={cache}
        />
      </RenderIf>
    </>
  )
}

export default APILayers