import { useEffect, useRef, useState } from "react"
import { GeoJSON, useMap } from "react-leaflet"
import * as geojson from 'geojson';

declare const L: any;

export const PlotContour = (props: { url: string }) => {
  const { url } = props
  const map = useMap()
  const ref = useRef<any>()
  const [data, setData] = useState<any>()

  const tooltipLayer = L.layerGroup()

  const eventHandlers = {
    mouseover: () => tooltipLayer.addTo(map),
    mouseout: () => map.removeLayer(tooltipLayer)
  }
  const onEachFeature = (feature: geojson.Feature<geojson.LineString, any>, layer: L.Layer) => {
    layer.bindPopup(feature.properties.title)
    // layer.bindTooltip(`<div style='color:${feature.properties.color}'>${feature.properties.title}</div>`,
    //   { className: 'Longterm-Contour-Label', permanent: false, direction: "center", sticky: true })
    const idx = Math.ceil(feature.geometry.coordinates.length / 2)
    L.tooltip({ className: 'Longterm-Contour-Label', permanent: false, direction: "center", sticky: true })
      .setContent(`<div style='color:${feature.properties.color}'>${feature.properties.title}</div>`)
      .setLatLng(feature.geometry.coordinates[idx].reverse())
      .addTo(tooltipLayer);
  }
  const styleFunc = (feature: any) => {
    return {
      weight: 2.5,
      color: feature.properties.color
    }
  }
  useEffect(() => {
    if (url) {
      fetch(url)
        .then((response) => response.json())
        .then((json) => {
          ref.current.clearLayers()
          setData(json)
          ref.current.addData(json)
        })
    }
  }, [url])

  return (
    <>
      <GeoJSON ref={ref} data={data} onEachFeature={onEachFeature} style={styleFunc} eventHandlers={eventHandlers} />
    </>
  )
}