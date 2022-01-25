import { memo } from 'react';
import { MapContainer, TileLayer, LayersControl, BaseLayer, ZoomControl, ScaleControl } from 'react-leaflet'
// @ts-ignore
import { BingLayer } from 'react-leaflet-bing-v2' //not yet ts version
process.env = ''
const MyBaseLayer = () => (
    <LayersControl position='topright'>
        <BaseLayer name='Open Street Map'>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        </BaseLayer>
        <BaseLayer name='Bing Map' checked>
        <BingLayer
            bingkey={bing_key}
            type="Aerial"
        />
        </BaseLayer>
    </LayersControl>
)

export default memo(MyBaseLayer);