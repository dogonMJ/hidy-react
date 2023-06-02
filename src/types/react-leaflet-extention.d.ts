import 'leaflet';
import { TileLayerOptions, TileLayer } from 'leaflet';

declare module 'leaflet' {
  interface WMSParams {
    key?: string
    time?: string | undefined
    elevation?: number
    featureinfo?: boolean
  }
}


declare module 'leaflet' {
  interface TileLayerOptions {
    renderer?: Renderer;
  }

  namespace tileLayer {
    function canvas(urlTemplate: string, options?: TileLayerOptions): TileLayer;
    function wmscanvas(urlTemplate: string, options?: TileLayerOptions): TileLayer;
  }
}