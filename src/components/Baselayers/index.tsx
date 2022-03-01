import { memo } from 'react';
import { TileLayer, LayersControl, Pane, WMSTileLayer } from 'react-leaflet'
// @ts-ignore
import { BingLayer } from 'react-leaflet-bing-v2'
import L from 'leaflet'
const { BaseLayer } = LayersControl;
const MyBaseLayers = () => {
    return (
        <LayersControl position='topright'>
            <Pane name='baseLayers' style={{ zIndex: 1 }}>
                <BaseLayer name='Open Street Map'>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        id='baseLayer'
                    />
                </BaseLayer>
                <BaseLayer name='Bing Map' checked>
                    <BingLayer
                        bingkey={process.env.REACT_APP_BING_KEY}
                        type="Aerial"
                        id='baseLayer'
                    />
                </BaseLayer>
            </Pane>
        </LayersControl >
    )
}
export default memo(MyBaseLayers);

// request=GetMap&VERSION=1.3.0&LAYERS=CHL&CRS=EPSG:3857&BBOX=15028131.257091936,-2504688.542848654,17532819.79994059,1.3969838619232178e-9