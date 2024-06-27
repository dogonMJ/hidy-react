import { Polygon as PolygonType, Polyline as PolylineType, Circle as CircleType, layerGroup, LatLngExpression, polyline } from 'leaflet';
import { useSelector } from "react-redux";
import { RootState } from "store/store"
import { LatLng } from "leaflet";
import { useRef, useState } from "react";
import { useMap, FeatureGroup, Popup, useMapEvents } from "react-leaflet";

import { EditControl } from "react-leaflet-draw"
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css'
import { RenderIf } from "components/RenderIf/RenderIf";
import { SeafloorElevation } from "layout/UpRightControls/DrawControl/SeafloorElevation";
import { readableArea, readableDistance, calGeodesic, calPolygon, handleButton, } from 'Utils/UtilsDraw';
import { Button, ButtonGroup, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

declare const L: any

const dotIcon = ({ fill = "#3388ff", opacity = 0.7, size = [10, 10], anchor = [10, 10] } = {}) => L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
  <circle cx="10" cy="10" r="3" fill=${fill} opacity="${opacity}"/>
  </svg>`,
  className: "Icon-dot",
  // iconSize: size,
  iconAnchor: anchor,
});

export const DrawShapes = () => {
  const { t } = useTranslation()
  const map = useMap()
  const featureRef = useRef<any>()
  const [coordsProfile, setCoordsProfile] = useState<LatLng[]>([])
  const [renderProfile, setRenderProfile] = useState(false)
  const [popupPos, setPopupPos] = useState<LatLngExpression | undefined>()
  const [contentLayer, setContentLayer] = useState<any>()
  const scaleUnit = useSelector((state: RootState) => state.map.scaleUnit);
  const allLayerGroup = layerGroup()

  return (
    <>
      <FeatureGroup ref={featureRef}>
        <EditControl
          position="topright"
          draw={{
            marker: false,
            circlemarker: {
              stroke: false,
              color: 'black',
              weight: 1,
              fillColor: '#3388ff',
              fillOpacity: 1,
              radius: 3  //change type: react-leaflet-draw/src/index.d.ts and leaflet-draw/@types/index.d.ts
            },
            polygon: {
              showArea: true,
              showLength: true,
              feet: false,
              metric: scaleUnit === 'metric' ? true : false,
              nautic: scaleUnit === 'nautical' ? true : false,
              icon: dotIcon(),
              shapeOptions: { color: '#ffe6a8', opacity: 0.9 },
            },
            rectangle: false,
            polyline: {
              showLength: true,
              feet: false,
              metric: scaleUnit === 'metric' ? true : false,
              nautic: scaleUnit === 'nautical' ? true : false,
              icon: dotIcon(),
              shapeOptions: { color: '#ffe6a8', opacity: 0.9 },
            },
            circle: {
              showRadius: true,
              feet: false,
              metric: scaleUnit === 'metric' ? true : false,
              nautic: scaleUnit === 'nautical' ? true : false,
              shapeOptions: { color: '#ffe6a8', opacity: 0.9 },
            }
          }}
          onDeleted={(e) => {
            e.layers.eachLayer((layer) => {
              allLayerGroup.removeLayer(layer)
            })
          }}
          onCreated={async (e) => {
            switch (e.layerType) {
              case 'circlemarker':
                const circlemarkerLayer = e.layer as CircleType
                circlemarkerLayer.addTo(allLayerGroup)
                circlemarkerLayer.on('mouseover', async () => {
                  //edit後需要更新，需要放在mouseover內重算
                  const markerLatlng = circlemarkerLayer.getLatLng()
                  const json = await fetch(`${process.env.REACT_APP_PROXY_BASE}/data/gebco?lon=${markerLatlng.lng}&lat=${markerLatlng.lat}`)
                    .then(res => res.json())
                  const z = scaleUnit === 'imperial' ? `${Math.round(json.z[0] / 0.3048)} ft` : `${json.z[0]} m`
                  const cmContent = `${markerLatlng.lat.toFixed(4)}, ${markerLatlng.lng.toFixed(4)}<br>ele: ${z}`
                  circlemarkerLayer.bindTooltip(cmContent)
                  circlemarkerLayer.openTooltip() //不加會閃掉
                })
                circlemarkerLayer.on('click', async (e: any) => {
                  setPopupPos(e.latlng)
                  setContentLayer(allLayerGroup)
                })
                break
              case 'polyline':
                const polylineLayer = e.layer as PolylineType
                polylineLayer.addTo(allLayerGroup)
                const tooltips = new L.layerGroup();
                const latlngs = polylineLayer.getLatLngs() as LatLng[]
                polylineLayer.on('click', async (e) => {
                  setCoordsProfile(latlngs)
                  setRenderProfile(true)
                  setPopupPos(e.latlng)
                  setContentLayer(allLayerGroup)
                  // const popupContent = await downloadPopup(allLayerGroup)
                  // polylineLayer.bindPopup(popupContent)
                  // polylineLayer.openPopup()
                })
                polylineLayer.on('mouseover', () => {
                  const accDist: number[] = []
                  latlngs.forEach((latlng: LatLng, i: number) => {
                    if (i > 0) {
                      const distance = calGeodesic(latlngs[i - 1], latlng)
                      accDist.push(distance)
                      const acc = accDist.reduce((a, b) => a + b, 0)
                      const distanceString = readableDistance(distance, scaleUnit)
                      const accString = readableDistance(acc, scaleUnit)
                      const content = `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}<br>d: ${distanceString}<br>D: ${accString}`
                      L.tooltip().setLatLng(latlng).setContent(content).addTo(tooltips)
                    } else {
                      const content = `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`
                      L.tooltip().setLatLng(latlng).setContent(content).addTo(tooltips)
                    }
                  })
                  tooltips.addTo(map)
                })
                polylineLayer.on('mouseout', () => {
                  tooltips.clearLayers()
                })
                setCoordsProfile(latlngs)
                setRenderProfile(true)
                break
              case 'polygon':
                const polygonLayer = e.layer as PolygonType
                const pgTooltips = new L.layerGroup();
                polygonLayer.addTo(allLayerGroup)
                polygonLayer.on('mouseover', () => {
                  //edit後需要更新，需要放在mouseover內重算
                  const pgLatlngs = polygonLayer.getLatLngs()[0] as LatLng[]
                  const { area, perimeter } = calPolygon(pgLatlngs, scaleUnit)
                  const pgContent = `A = ${area}<br>p = ${perimeter}`
                  polygonLayer.bindTooltip(pgContent)
                  pgLatlngs.forEach((latlng: LatLng, i: number) => {
                    const content = `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`
                    L.tooltip().setLatLng(latlng).setContent(content).addTo(pgTooltips)
                  })
                  pgTooltips.addTo(map)
                })
                polygonLayer.on('mouseout', () => {
                  pgTooltips.clearLayers()
                })
                polygonLayer.on('edit', () => {
                  polygonLayer.bringToFront()
                })
                polygonLayer.on('click', async (e) => {
                  setPopupPos(e.latlng)
                  setContentLayer(allLayerGroup)
                  // const popupContent = await downloadPopup(allLayerGroup)
                  // polygonLayer.bindPopup(popupContent)
                  // polygonLayer.openPopup()
                })
                break
              case 'circle':
                const circleLayer = e.layer as CircleType
                let latlng = circleLayer.getLatLng()
                let center = L.circleMarker(latlng, { radius: 1 })
                circleLayer.bringToFront()
                circleLayer.on('mouseover', () => {
                  const radius = circleLayer.getRadius()
                  const ccArea = radius ** 2 * Math.PI
                  const circumference = 2 * radius * Math.PI
                  const radiusString = readableDistance(radius, scaleUnit)
                  const circumferenceString = readableDistance(circumference, scaleUnit)
                  const areaString = readableArea(ccArea, scaleUnit)
                  const ccContent = `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}<br>
              r: ${radiusString}<br>
              c: ${circumferenceString}<br>
              A: ${areaString}`
                  circleLayer.bindTooltip(ccContent)
                  center.addTo(featureRef.current)
                })
                circleLayer.on('mouseout', () => {
                  featureRef.current.removeLayer(center)
                })
                circleLayer.on('edit', () => {
                  latlng = circleLayer.getLatLng()
                  center.initialize(latlng)
                  center.addTo(featureRef.current)
                  circleLayer.bringToFront()
                })
                break
            }
          }}
        />
      </FeatureGroup>
      {popupPos &&
        <Popup position={popupPos}>
          <Typography variant='subtitle1'>
            <b>{t('draw.downloadTitle')}</b>
          </Typography>
          <Typography variant='subtitle2' sx={{ whiteSpace: 'pre-wrap' }} gutterBottom>
            {t('draw.downloadDescription')}
          </Typography>
          <Typography variant='caption' sx={{ whiteSpace: 'pre-wrap' }} gutterBottom>
            {t('draw.downloadCaption')}
          </Typography>
          <ButtonGroup variant="outlined" size="small">
            <Button onClick={(e) => handleButton(contentLayer, 'GPX')}>GPX</Button>
            <Button onClick={async (e) => await handleButton(contentLayer, 'GeoJSON')}>GeoJSON</Button>
            <Button onClick={async (e) => await handleButton(contentLayer, 'KML')}>KML</Button>
          </ButtonGroup>
        </Popup>
      }
      <RenderIf isTrue={renderProfile}>
        <SeafloorElevation coords={coordsProfile} setOpen={setRenderProfile} />
      </RenderIf>
    </>
  );
};
