/*
From the answer by Seth Lutske on Stackoverflow
https://stackoverflow.com/questions/67146756/how-to-add-tiles-nested-in-leaflet-map-to-canvas-with-latest-version-of-react-le
*/
import { createLayerComponent } from "@react-leaflet/core";
import L from "leaflet";
//@ts-ignore
import "tilelayer-canvas";
import "./wmslayer-canvas.js"

const createLayer = (props: any, context: any) => {
  const layer: any = L.tileLayer
  const type = props.type ? props.type.toUpperCase() : ''
  const instance = (type === 'WMTS') ? layer.canvas(props.url, { ...props.params }) : layer.wms.canvas2D(props.url, { ...props.params });
  if (type !== 'WMTS') {
    const newParams = Object.fromEntries(
      Object.entries(props.params).map(([k, v]) => [k.toUpperCase(), v])
    );
    const wmsKeys = Object.keys(instance.wmsParams).filter(key => !Object.keys(newParams).includes(key.toUpperCase()))
    const defaultObj: { [key: string]: any } = {}
    wmsKeys.forEach(key => {
      defaultObj[key] = instance.wmsParams[key]
    })
    Object.assign(newParams, defaultObj)
    instance.wmsParams = {}
    instance.setParams({ ...newParams })
  }
  return { instance, context };
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
};


export const TileLayerCanvas = createLayerComponent(createLayer, updateLayer);
