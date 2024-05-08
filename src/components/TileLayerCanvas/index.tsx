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
  const key = props.params?.key ?? (props.key ?? 'wmLayer')
  // const instance = (type === 'WMTS') ? layer.canvas(props.url, { ...props.params }) : layer.wmscanvas(props.url, { ...props.params, });
  if (type === 'WMTS') {
    const urlParams = props.params ? Object.entries(props.params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
      : ''
    const instance = layer.canvas(props.url + urlParams, { crossOrigin: 'anonymous' })
    if (props.opacity) { instance.setOpacity(props.opacity) }
    return { instance, context };
  } else {
    const instance = layer.wmscanvas(props.url, { ...props.params, })
    const newParams = Object.fromEntries(
      Object.entries(props.params).map(([k, v]) => [k.toUpperCase(), v])
    );
    const wmsKeys = Object.keys(instance.wmsParams).filter(key => !Object.keys(newParams).includes(key.toUpperCase())) //篩掉重複參數
    const defaultObj: { [key: string]: any } = {}
    wmsKeys.forEach(key => {
      defaultObj[key] = instance.wmsParams[key]
    })
    Object.assign(newParams, defaultObj)
    instance.wmsParams = {}
    instance.setParams({ ...newParams })
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