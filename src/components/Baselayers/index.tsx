import { memo } from 'react';
import { TileLayer, LayersControl, Pane, WMSTileLayer } from 'react-leaflet'
// @ts-ignore
import { BingLayer } from 'react-leaflet-bing-v2'
const { BaseLayer } = LayersControl;
export const MyBaseLayers = memo(() => {
    return (
        <LayersControl position='topright'>
            <Pane name='baseLayers' style={{ zIndex: 1 }}>
                <BaseLayer name='Open Street Map'>
                    <TileLayer
                        id='baseLayer'
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        crossOrigin="anonymous"
                    />
                </BaseLayer>
                <BaseLayer name='Bing Map' checked>
                    <BingLayer
                        id='baseLayer'
                        bingkey={process.env.REACT_APP_BING_KEY}
                        type="Aerial"
                    />
                </BaseLayer>
                <BaseLayer name='GEBCO Grid shaded relief'>
                    <WMSTileLayer
                        id='baseLayer'
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?"
                        crossOrigin="anonymous"
                        params={{
                            layers: 'gebco_latest',
                            format: 'image/png'
                        }}
                    />
                </BaseLayer>
                <BaseLayer name='GEBCO Grid colour-shaded for elevation including under ice topography'>
                    <WMSTileLayer
                        id='baseLayer'
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?"
                        crossOrigin="anonymous"
                        params={{
                            layers: 'GEBCO_LATEST_2_sub_ice_topo',
                            format: 'image/png'
                        }}
                    />
                </BaseLayer>
                <BaseLayer name='GEBCO Grid based on measured data only'>
                    <WMSTileLayer
                        id='baseLayer'
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?"
                        crossOrigin="anonymous"
                        params={{
                            layers: 'GEBCO_LATEST_3',
                            format: 'image/png'
                        }}
                    />
                </BaseLayer>
            </Pane>
        </LayersControl >
    )
})
//TYLES=default&FEATUREINFO=false&service=WMS&request=GetMap&version=1.1.1&width=256&height=256&srs=EPSG%3A3857