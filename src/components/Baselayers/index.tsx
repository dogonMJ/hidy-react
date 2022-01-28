import { memo } from 'react';
import { TileLayer, LayersControl } from 'react-leaflet'
// @ts-ignore
import { BingLayer } from 'react-leaflet-bing-v2' //not yet ts version
const { BaseLayer } = LayersControl;
const MyBaseLayers = () => {
    return (
        <LayersControl position='topright'>
            <BaseLayer name='Open Street Map'>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </BaseLayer>
            <BaseLayer name='Bing Map' checked>
                <BingLayer
                    bingkey={process.env.REACT_APP_BING_KEY}
                    type="Aerial"
                />
            </BaseLayer>
        </LayersControl>
    )
}
export default memo(MyBaseLayers);