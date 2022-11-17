import { useRef, useEffect } from "react";
import { GeoJSON } from "react-leaflet";
import * as topojson from "topojson-client";

export const TopoJSON = (props: any) => {
  const ref = useRef<any>()
  const { data, ...otherProps } = props;

  const addData = (layer: any, jsonData: any) => {
    if (jsonData.type === "Topology") {
      for (let key in jsonData.objects) {
        const geojson = topojson.feature(jsonData, jsonData.objects[key]);
        layer.addData(geojson);
      }
    } else {
      layer.addData(jsonData);
    }
  }

  useEffect(() => {
    const layer = ref.current;
    if (data) {
      addData(layer, data);
    }
  });

  return (
    data ? <GeoJSON ref={ref} {...otherProps} /> : <></>
  );
}
