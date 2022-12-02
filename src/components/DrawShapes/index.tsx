import 'leaflet'
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
  return geod.Inverse(latlng1.lat, latlng1.lng, latlng2.lat, latlng2.lng).s12! / 1000
}

export const DrawShapes = () => {
  const map = useMap()
  const featureRef = useRef<any>()
  const [coordsProfile, setCoordsProfile] = useState<LatLng[]>([])
  const [renderProfile, setRenderProfile] = useState(false)
  // const geod = geodesic.Geodesic.WGS84
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
            },
            rectangle: false,
            polyline: {
              showLength: true,
              icon: dotIcon(),
            },
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
                      // const distance = (latlngs[i - 1].distanceTo(latlng) / 1000)
                      // accDist.push(distance)
                      const acc = accDist.reduce((a, b) => a + b, 0)
                      const content = `${latlng.lat.toFixed(2)}, ${latlng.lng.toFixed(2)}<br>d = ${distance.toFixed(2)} km<br>D = ${acc.toFixed(2)} km`
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
                      const distance = calGeodesic(pgLatlngs[i - 1], latlng)//(pgLatlngs[i - 1].distanceTo(latlng) / 1000)
                      accDist.push(distance)
                    }
                  })
                  // accDist.push(pgLatlngs[0].distanceTo(pgLatlngs.slice(-1)[0]) / 1000)
                  accDist.push(calGeodesic(pgLatlngs[0], pgLatlngs.slice(-1)[0]))
                  const acc = accDist.reduce((a, b) => a + b, 0)
                  const pgArea = L.GeometryUtil.geodesicArea(pgLatlngs) / 1000000;
                  const pgContent = `A = ${pgArea.toFixed(2)} km&sup2<br>p = ${acc.toFixed(2)} km`
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
                  const radius = e.layer.getRadius() / 1000
                  const ccArea = radius ** 2 * Math.PI
                  const circumference = 2 * radius * Math.PI
                  const ccContent = `${latlng.lat.toFixed(2)}, ${latlng.lng.toFixed(2)}<br>
                  r = ${radius.toFixed(2)} km<br>
                  c = ${circumference.toFixed(2)} km<br>
                  A = ${ccArea.toFixed(2)} km&sup2`
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
