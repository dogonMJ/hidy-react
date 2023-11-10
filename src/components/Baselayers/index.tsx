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
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        crossOrigin="anonymous"
                    />
                </BaseLayer>
                <BaseLayer name='臺灣通用電子地圖'>
                    <TileLayer
                        id='EMAP5'
                        attribution='&copy; <a href="https://maps.nlsc.gov.tw/" target="_blank">內政部國土測繪中心</a>'
                        url="https://wmts.nlsc.gov.tw/wmts/EMAP5/default/GoogleMapsCompatible/{z}/{y}/{x}.png"
                        crossOrigin="anonymous"
                    />
                </BaseLayer>
                <BaseLayer name='Taiwan e-Map'>
                    <TileLayer
                        id='EMAP8'
                        attribution='&copy; <a href="https://maps.nlsc.gov.tw/homePage.action?in_type=web&language=EN" target="_blank">NLSC</a>'
                        url="https://wmts.nlsc.gov.tw/wmts/EMAP8/default/GoogleMapsCompatible/{z}/{y}/{x}.png"
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
                        attribution='<a href="https://doi.org/10.5285/f98b053b-0cbc-6c23-e053-6c86abc0af7b" target="_blank">GEBCO Compilation Group (2023) GEBCO 2023 Grid</a>'
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
                        attribution='<a href="https://doi.org/10.5285/f98b053b-0cbc-6c23-e053-6c86abc0af7b" target="_blank">GEBCO Compilation Group (2023) GEBCO 2023 Grid</a>'
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
                        attribution='<a href="https://doi.org/10.5285/f98b053b-0cbc-6c23-e053-6c86abc0af7b" target="_blank">GEBCO Compilation Group (2023) GEBCO 2023 Grid</a>'
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
