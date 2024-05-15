/*
From the answer by Seth Lutske on Stackoverflow
https://stackoverflow.com/questions/67146756/how-to-add-tiles-nested-in-leaflet-map-to-canvas-with-latest-version-of-react-le
*/

//@ts-ignore
import "tilelayer-canvas";
import { createLayerComponent } from "@react-leaflet/core";
import L from "leaflet";
// import "./wmslayer-canvas.js"
import "./WMSCanvas-TileLayer.js"

const createLayer = (props: any, context: any) => {
  const layer: any = L.tileLayer
  const type = props.type ? props.type.toUpperCase() : ''
  if (type === 'WMTS') {
    const urlParams = props.params ? Object.entries(props.params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
      : ''
    const instance = layer.canvas(props.url + urlParams, { crossOrigin: 'anonymous' })
    if (props.opacity) { instance.setOpacity(props.opacity) }
    if (props.zIndex) { instance.setZIndex(props.zIndex); }
    return { instance, context };
  } else {
    let url;
    let newParams = Object.assign({}, props.params);
    // NASA Gibs的time只接受:不接受%3A，time加入url內避免setParams自動改為%3A
    if (props.params && props.params['time']) {
      url = `${props.url.split('?')[0]}?&time=${props.params['time']}`
      delete newParams['time'] //避免同key衝突
    } else {
      url = props.url.split('?')[0]
    }
    const instance = layer.wmscanvas(url)
    instance.setParams({ ...newParams })
    if (props.opacity) { instance.setOpacity(props.opacity) }
    if (props.zIndex) { instance.setZIndex(props.zIndex); }
    return { instance, context };
  }
};

const updateLayer = (instance: any, props: any, prevProps: any) => {
  // basic layer setters for any leaflet layer:
  if (prevProps.url !== props.url) {
    if (instance.setUrl) instance.setUrl(props.url);
  }
  if (prevProps.opacity !== props.opacity) {
    if (instance.setOpacity) instance.setOpacity(props.opacity);
  }
  if (prevProps.zIndex !== props.zIndex) {
    if (instance.setZIndex) instance.setZIndex(props.zIndex);
  }
  if (prevProps.customKey !== props.customKey) {
    if (instance.setParams) instance.setParams(props.params);
  }
};


export const TileLayerCanvas = createLayerComponent(createLayer, updateLayer);