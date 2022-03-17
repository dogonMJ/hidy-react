import { memo } from 'react';
import { TileLayer, LayersControl, Pane } from 'react-leaflet'
// @ts-ignore
import { BingLayer } from 'react-leaflet-bing-v2'
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
