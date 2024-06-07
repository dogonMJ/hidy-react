import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { TileLayerOptions } from 'leaflet';
import { memo } from 'react';
import { TileLayer, LayersControl, Pane, WMSTileLayer, LayerGroup, useMapEvents } from 'react-leaflet'
// @ts-ignore
import { BingLayer } from 'react-leaflet-bing-v2'
import { mapSlice } from 'store/slice/mapSlice';
const { BaseLayer } = LayersControl;

export const BaselayerControl = memo(() => {
    const dispatch = useAppDispatch()
    const layerId = useAppSelector(state => state.map.baseLayer)
    useMapEvents({
        baselayerchange: (e) => {
            const layerOptions = e.layer.options as TileLayerOptions
            dispatch(mapSlice.actions.setBaseLayerId(layerOptions.id))
        }
    })
    return (
        <LayersControl position='topright' >
            <LayerGroup >
                <Pane name='baseLayers' style={{ zIndex: 1 }} >
                    <BaseLayer name='Open Street Map' checked={layerId === 'osm'}>
                        <TileLayer
                            id='osm'
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            crossOrigin="anonymous"
                        />
                    </BaseLayer>
                    <BaseLayer name='臺灣通用電子地圖' checked={layerId === 'EMAP5'}>
                        <TileLayer
                            id='EMAP5'
                            attribution='&copy; <a href="https://maps.nlsc.gov.tw/" target="_blank">內政部國土測繪中心</a>'
                            url="https://wmts.nlsc.gov.tw/wmts/EMAP5/default/GoogleMapsCompatible/{z}/{y}/{x}.png"
                            crossOrigin="anonymous"
                        />
                    </BaseLayer>
                    <BaseLayer name='Taiwan e-Map' checked={layerId === 'EMAP8'}>
                        <TileLayer
                            id='EMAP8'
                            attribution='&copy; <a href="https://maps.nlsc.gov.tw/homePage.action?in_type=web&language=EN" target="_blank">NLSC</a>'
                            url="https://wmts.nlsc.gov.tw/wmts/EMAP8/default/GoogleMapsCompatible/{z}/{y}/{x}.png"
                            crossOrigin="anonymous"
                        />
                    </BaseLayer>
                    <BaseLayer name='Bing Map' checked={layerId === undefined || layerId === 'bingmap'}>
                        <BingLayer
                            id='bingmap'
                            bingkey={process.env.REACT_APP_BING_KEY}
                            type="Aerial"
                        />
                    </BaseLayer>
                    <BaseLayer name='GEBCO Grid shaded relief' checked={layerId === 'shaded'}>
                        <WMSTileLayer
                            id='shaded'
                            attribution='<a href="https://doi.org/10.5285/f98b053b-0cbc-6c23-e053-6c86abc0af7b" target="_blank">GEBCO Compilation Group (2023) GEBCO 2023 Grid</a>'
                            url="https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?"
                            crossOrigin="anonymous"
                            params={{
                                layers: 'gebco_latest',
                                format: 'image/png'
                            }}
                        />
                    </BaseLayer>
                    <BaseLayer name='GEBCO Grid colour-shaded for elevation including under ice topography' checked={layerId === 'subice'}>
                        <WMSTileLayer
                            id='subice'
                            attribution='<a href="https://doi.org/10.5285/f98b053b-0cbc-6c23-e053-6c86abc0af7b" target="_blank">GEBCO Compilation Group (2023) GEBCO 2023 Grid</a>'
                            url="https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?"
                            crossOrigin="anonymous"
                            params={{
                                layers: 'GEBCO_LATEST_2_sub_ice_topo',
                                format: 'image/png'
                            }}
                        />
                    </BaseLayer>
                    <BaseLayer name='GEBCO Grid based on measured data only' checked={layerId === 'measured'}>
                        <WMSTileLayer
                            id='measured'
                            attribution='<a href="https://doi.org/10.5285/f98b053b-0cbc-6c23-e053-6c86abc0af7b" target="_blank">GEBCO Compilation Group (2023) GEBCO 2023 Grid</a>'
                            url="https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?"
                            crossOrigin="anonymous"
                            params={{
                                layers: 'GEBCO_LATEST_3',
                                format: 'image/png'
                            }}
                        />
                    </BaseLayer>
                    {/* <BaseLayer name='Esri World Imagery' checked={layerId === 'ESRI'}>
                        <TileLayer
                            id='Esri'
                            attribution='<a href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9" target="_blank">Powered by Esri. Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community</a>'
                            url="https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/tile/1.0.0/World_Imagery/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg"
                            crossOrigin="anonymous"
                        />
                    </BaseLayer> */}
                </Pane>
            </LayerGroup>
        </LayersControl >
    )
})
