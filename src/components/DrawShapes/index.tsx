import 'leaflet'
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import { LatLng } from "leaflet";
import { useRef, useState } from "react";
import { useMap, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw"
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css'
import { RenderIf } from "components/RenderIf/RenderIf";
import { SeafloorElevation } from "components/SeafloorElevation";
import geodesic from "geographiclib-geodesic"

declare const L: any

const dotIcon = ({ fill = "#3388ff", opacity = 0.7, size = [10, 10], anchor = [10, 10] } = {}) => L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
  <circle cx="10" cy="10" r="5" fill=${fill} opacity="${opacity}"/>
  </svg>`,
  className: "Icon-dot",
  iconSize: size,
  iconAnchor: anchor,
});

const calGeodesic = (latlng1: LatLng, latlng2: LatLng) => {
  const geod = geodesic.Geodesic.WGS84
  return geod.Inverse(latlng1.lat, latlng1.lng, latlng2.lat, latlng2.lng).s12!
}

export const DrawShapes = () => {
  const map = useMap()
  const featureRef = useRef<any>()
  const [coordsProfile, setCoordsProfile] = useState<LatLng[]>([])
  const [renderProfile, setRenderProfile] = useState(false)
  const scaleUnit = useSelector((state: RootState) => state.coordInput.scaleUnit);
  // const geod = geodesic.Geodesic.WGS84
  const readableDistance = (distanceInMeters: number) => L.GeometryUtil.readableDistance(
    distanceInMeters,
    scaleUnit === 'metric' ? true : false,
    false,
    scaleUnit === 'nautical' ? true : false,
  )
  const readableArea = (areaInSqMeters: number) => L.GeometryUtil.readableArea(
    areaInSqMeters,
    scaleUnit === 'imperial' ? false : ['km', 'ha', 'm'], //metric and nautical
    scaleUnit === 'imperial' ? true : false,
  )
  return (
    <>
      <FeatureGroup ref={featureRef}>
        <EditControl
          position="topright"
          draw={{
            circlemarker: false,
            marker: false,
            polygon: {
              showArea: true,
              showLength: true,
              feet: false,
              metric: scaleUnit === 'metric' ? true : false,
              nautic: scaleUnit === 'nautical' ? true : false,
            },
            rectangle: false,
            polyline: {
              showLength: true,
              feet: false,
              metric: scaleUnit === 'metric' ? true : false,
              nautic: scaleUnit === 'nautical' ? true : false,
              icon: dotIcon(),
            },
            circle: {
              showRadius: true,
              feet: false,
              metric: scaleUnit === 'metric' ? true : false,
              nautic: scaleUnit === 'nautical' ? true : false,
            }
          }}
          onCreated={(e) => {
            switch (e.layerType) {
              case 'polyline':
                const tooltips = new L.layerGroup();
                const latlngs = e.layer.getLatLngs()
                e.layer.on('click', (e: any) => {
                  setCoordsProfile(latlngs)
                  setRenderProfile(true)
                })
                e.layer.on('mouseover', () => {
                  const accDist: number[] = []
                  latlngs.forEach((latlng: LatLng, i: number) => {
                    if (i > 0) {
                      const distance = calGeodesic(latlngs[i - 1], latlng)
                      accDist.push(distance)
                      const acc = accDist.reduce((a, b) => a + b, 0)
                      const distanceString = readableDistance(distance)
                      const accString = readableDistance(acc)
                      const content = `${latlng.lat.toFixed(2)}, ${latlng.lng.toFixed(2)}<br>d = ${distanceString}<br>D = ${accString}`
                      L.tooltip().setLatLng(latlng).setContent(content).addTo(tooltips)
                    } else {
                      const content = `${latlng.lat.toFixed(2)}, ${latlng.lng.toFixed(2)}`
                      L.tooltip().setLatLng(latlng).setContent(content).addTo(tooltips)
                    }
                  })
                  tooltips.addTo(map)
                })
                e.layer.on('mouseout', () => {
                  tooltips.clearLayers()
                })
                setCoordsProfile(latlngs)
                setRenderProfile(true)
                break
              case 'polygon':
                let pgLatlngs = e.layer.getLatLngs()[0]
                e.layer.on('mouseover', () => {
                  const accDist: number[] = []
                  pgLatlngs.forEach((latlng: LatLng, i: number) => {
                    if (i > 0) {
                      const distance = calGeodesic(pgLatlngs[i - 1], latlng)
                      accDist.push(distance)
                    }
                  })
                  accDist.push(calGeodesic(pgLatlngs[0], pgLatlngs.slice(-1)[0]))
                  const acc = accDist.reduce((a, b) => a + b, 0)
                  const accString = readableDistance(acc)
                  const pgArea = L.GeometryUtil.geodesicArea(pgLatlngs);
                  const areaString = readableArea(pgArea)
                  const pgContent = `A = ${areaString}<br>p = ${accString}`
                  e.layer.bindTooltip(pgContent)
                })
                e.layer.on('edit', () => {
                  pgLatlngs = e.layer.getLatLngs()[0]
                  e.layer.bringToFront()
                })
                break
              case 'circle':
                let latlng = e.layer.getLatLng()
                let center = L.circleMarker(latlng, { radius: 1 })
                e.layer.bringToFront()
                e.layer.on('mouseover', () => {
                  const radius = e.layer.getRadius()
                  const ccArea = radius ** 2 * Math.PI
                  const circumference = 2 * radius * Math.PI
                  const radiusString = readableDistance(radius)
                  const circumferenceString = readableDistance(circumference)
                  const areaString = readableArea(ccArea)
                  const ccContent = `${latlng.lat.toFixed(2)}, ${latlng.lng.toFixed(2)}<br>
                  r = ${radiusString}<br>
                  c = ${circumferenceString}<br>
                  A = ${areaString}`
                  e.layer.bindTooltip(ccContent)
                  center.addTo(featureRef.current)
                })
                e.layer.on('mouseout', () => {
                  featureRef.current.removeLayer(center)
                })
                e.layer.on('edit', () => {
                  latlng = e.layer.getLatLng()
                  center.initialize(latlng)
                  center.addTo(featureRef.current)
                  e.layer.bringToFront()
                })
                break
            }
          }}
        />
      </FeatureGroup>
      <RenderIf isTrue={renderProfile}>
        <SeafloorElevation coords={coordsProfile} setOpen={setRenderProfile} />
      </RenderIf>
    </>
  );
};
