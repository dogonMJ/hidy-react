import { useEffect, useRef, useState } from "react"
import { GeoJSON, useMap } from "react-leaflet"
import * as geojson from 'geojson';
import L from 'leaflet'

// declare const L: any;

export const PlotContour = (props: { url: string }) => {
  const { url } = props
  const map = useMap()
  const ref = useRef<any>()
  const [data, setData] = useState<any>()
  const tooltipLayer = useRef(L.layerGroup())


  const onEachFeature = (feature: geojson.Feature<geojson.LineString, any>, layer: L.Layer) => {
    layer.bindPopup(feature.properties.title)
    // layer.bindTooltip(`<div style='color:${feature.properties.color}'>${feature.properties.title}</div>`,
    //   { className: 'Longterm-Contour-Label', permanent: false, direction: "center", sticky: true })

    const idx = Math.ceil(feature.geometry.coordinates.length / 2)
    const latlng = feature.geometry.coordinates[idx].reverse()
    L.tooltip({ className: 'Longterm-Contour-Label', permanent: false, direction: "center", sticky: true, })
      .setContent(`<div style='color:${feature.properties.color}'>${feature.properties.title}</div>`)
      .setLatLng([latlng[0], latlng[1]])
      .addTo(tooltipLayer.current)
  }

  const eventHandlers = {
    mouseover: () => {
      tooltipLayer.current.addTo(map)
    },
    mouseout: () => {
      map.removeLayer(tooltipLayer.current)
    }
  }

  const styleFunc = (feature: any) => {
    return {
      weight: 3,
      color: feature.properties.color,
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