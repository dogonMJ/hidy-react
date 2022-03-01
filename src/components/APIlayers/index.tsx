import { useState } from "react";
import ProcWMTS from './ProcWMTS'

const APILayers = (props: { datetime: Date, cache: any }) => {
  const cache = props.cache
  const [identifier, setIdentifier] = useState<string>("");
  const onDatasetChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(evt.target.value)
  }
  return (
    <>
      <div className='APIlayers' onChange={onDatasetChange}>
        {/* <input type="radio" value="dataset-oc-glo-bio-multi-l4-chl_interpolated_4km_daily-rt" name="api" /> CHL */}
        <input type="radio" value="GHRSST_L4_MUR_Sea_Surface_Temperature" name="api" /> Temperature
        <input type="radio" value="GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies" name="api" /> Anomalies
        <input type="radio" value="MODIS_Aqua_CorrectedReflectance_TrueColor" name="api" /> True Color
        <input type="radio" value="Himawari_AHI_Band3_Red_Visible_1km" name="api" /> Himawari-8
        <input type="radio" value="" name="api" /> close
      </div>
      <ProcWMTS
        Identifier={identifier}
        Time={props.datetime}
        cache={cache}
      />
    </>
  )
}

export default APILayers