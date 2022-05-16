/*
From the answer by Seth Lutske on Stackoverflow
https://stackoverflow.com/questions/67146756/how-to-add-tiles-nested-in-leaflet-map-to-canvas-with-latest-version-of-react-le
*/
import { createLayerComponent } from "@react-leaflet/core";
import L from "leaflet";
//@ts-ignore
import "tilelayer-canvas";
import "./wmslayer-canvas"
const createLayer = (props: any, context: any) => {
  const layer: any = L.tileLayer
  const instance = (props.type === 'wmts') ? layer.canvas(props.url, { ...props.params }) : layer.wms.canvas2D(props.url, { ...props.params });
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
