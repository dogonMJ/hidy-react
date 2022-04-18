import { useSelector } from "react-redux";
import { RootState } from "store/store"

import SeaTempAno from 'components/DataPanel/APIlayers/colorbar_GHRSST_Sea_Surface_Temperature_Anomalies.png'
import SeaTemp from 'components/DataPanel/APIlayers/colorbar_GHRSST_Sea_Surface_Temperature.png'

const LayerLegend = () => {
  const layerIdentifier = useSelector((state: RootState) => state.coordInput.layerIdent);
  let legend: string | undefined;

  switch (layerIdentifier) {
    case "GHRSST_L4_MUR_Sea_Surface_Temperature":
      legend = SeaTemp
      break;
    case "GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies":
      legend = SeaTempAno
      break;
    default:
      return <></>
  }
  return <img src={legend} alt="legend" style={{ position: 'absolute', zIndex: 1000, bottom: 25, left: 5, backgroundColor: 'rgba(255,255,255,0.7)' }} />
}

export default LayerLegend