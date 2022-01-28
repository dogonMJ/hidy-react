import { TileLayer, LayersControl } from 'react-leaflet'
import ProcUrls from 'components/APIlayers/Urlchange'

const { BaseLayer } = LayersControl;
const APILayers = (props: { datetime: Date }) => {
  return (
    <LayersControl>
      <BaseLayer name='Close'>
        <TileLayer url='' />
      </BaseLayer>
      <BaseLayer name='Sea Surface Temperature'>
        <ProcUrls
          urlRoot="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GHRSST_L4_MUR_Sea_Surface_Temperature/default/"
          urlDate={props.datetime}
          urlEnd="/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png"
        />
      </BaseLayer>
      <BaseLayer name='Sea Surface Temperature Anomalies'>
        <ProcUrls
          urlRoot="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies/default/"
          urlDate={props.datetime}
          urlEnd="/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png"
        />
      </BaseLayer>
    </LayersControl>
  )
}

export default APILayers